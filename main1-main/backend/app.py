from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os
import re
import datetime
import json
from fpdf import FPDF
import qrcode
import firebase_admin
from firebase_admin import credentials, auth
import google.generativeai as genai
from datetime import datetime, timedelta

app = Flask(__name__)

# --- CONFIG & FIREBASE ---
CORS(app, resources={r"/api/*": {"origins": "*"}})
app.config['SECRET_KEY'] = "hackathon-secret-key" 
CERT_FOLDER = "certificates"
os.makedirs(CERT_FOLDER, exist_ok=True)

# Ensure 'serviceAccountKey.json' is in your backend folder!
cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred)

# --- GEMINI AI CONFIGURATION ---
# Set your Gemini API key (get it from: https://makersuite.google.com/app/apikey)
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "YOUR_GEMINI_API_KEY_HERE")  # Set this in environment variables
genai.configure(api_key=GEMINI_API_KEY)

# Initialize the Gemini model
model = genai.GenerativeModel('gemini-pro')

# In-memory storage (UID as key)
users = {}

# Session storage for chat history
chat_sessions = {}

# --- AUTH MIDDLEWARE ---
def auth_required():
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return None, jsonify({"error": "No token provided"}), 401
    token = auth_header.split(" ")[1]
    try:
        decoded_token = auth.verify_id_token(token, clock_skew_seconds=60)
        uid = decoded_token['uid']
        user = users.get(uid)
        if not user:
            return None, jsonify({"error": "User not in backend"}), 404
        return (user, uid), None, None
    except Exception as e:
        return None, jsonify({"error": str(e)}), 401

# --- HELPER FUNCTIONS FOR AI ---
def get_chat_history(uid, session_id):
    """Get or create chat history for a user session"""
    if uid not in chat_sessions:
        chat_sessions[uid] = {}
    
    if session_id not in chat_sessions[uid]:
        chat_sessions[uid][session_id] = []
    
    return chat_sessions[uid][session_id]

def update_chat_history(uid, session_id, role, content):
    """Update chat history with new message"""
    history = get_chat_history(uid, session_id)
    history.append({
        "role": role,
        "parts": [{"text": content}],
        "timestamp": datetime.now().isoformat()
    })
    
    # Keep only last 20 messages to avoid context overflow
    if len(history) > 20:
        chat_sessions[uid][session_id] = history[-20:]

def generate_ai_response(prompt, history=None, system_prompt=None):
    """Generate response using Gemini AI"""
    try:
        if system_prompt:
            # Format the prompt with system context
            full_prompt = f"{system_prompt}\n\n{prompt}"
        else:
            full_prompt = prompt
        
        if history:
            # Convert history to Gemini format
            chat = model.start_chat(history=history)
            response = chat.send_message(full_prompt)
        else:
            response = model.generate_content(full_prompt)
        
        return response.text.strip()
    except Exception as e:
        print(f"Gemini API Error: {e}")
        return f"I apologize, but I encountered an error. Please try again. (Error: {str(e)})"

def clean_gemini_response(text):
    """Clean and format Gemini response"""
    # Remove markdown formatting if present
    text = text.replace('**', '').replace('*', '').replace('#', '')
    # Ensure proper formatting
    return text.strip()

# --- AI ROUTES ---
@app.route("/api/ai/chat", methods=["POST"])
def ai_chat():
    """Handle AI chat requests"""
    result, err_json, code = auth_required()
    if err_json:
        return err_json, code
    
    user, uid = result
    data = request.get_json()
    
    message = data.get("message", "").strip()
    session_id = data.get("session_id", "default")
    context = data.get("context")
    
    if not message:
        return jsonify({"error": "Message is required"}), 400
    
    try:
        # Get chat history for this session
        history = get_chat_history(uid, session_id)
        
        # Convert history to Gemini format if exists
        gemini_history = []
        if history:
            for msg in history:
                if msg["role"] == "user":
                    gemini_history.append({"role": "user", "parts": [{"text": msg["parts"][0]["text"]}]})
                elif msg["role"] == "model":
                    gemini_history.append({"role": "model", "parts": [{"text": msg["parts"][0]["text"]}]})
        
        # System prompt for study assistant
        system_prompt = """You are ShikshaPlus AI Study Assistant, a helpful educational AI. 
        You help students with their studies, answer questions, explain concepts, and provide learning guidance.
        Be concise, accurate, and encouraging. Focus on educational content.
        
        Important guidelines:
        1. Always stay in character as a study assistant
        2. Provide accurate, factual information
        3. Be encouraging and supportive
        4. If you're not sure about something, admit it
        5. Keep responses focused on educational content
        
        Context from previous chat (if provided): {context}"""
        
        if context:
            system_prompt = system_prompt.replace("{context}", context)
        else:
            system_prompt = system_prompt.replace("{context}", "No previous context available")
        
        # Update user message in history
        update_chat_history(uid, session_id, "user", message)
        
        # Generate AI response
        if gemini_history:
            response_text = generate_ai_response(message, gemini_history, system_prompt)
        else:
            response_text = generate_ai_response(f"{system_prompt}\n\nUser: {message}")
        
        # Clean response
        cleaned_response = clean_gemini_response(response_text)
        
        # Update AI response in history
        update_chat_history(uid, session_id, "model", cleaned_response)
        
        return jsonify({
            "success": True,
            "response": cleaned_response,
            "session_id": session_id,
            "timestamp": datetime.now().isoformat()
        }), 200
        
    except Exception as e:
        print(f"Chat error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route("/api/ai/generate-notes", methods=["POST"])
def generate_notes():
    """Generate study notes using AI"""
    result, err_json, code = auth_required()
    if err_json:
        return err_json, code
    
    user, uid = result
    data = request.get_json()
    
    topic = data.get("topic", "").strip()
    
    if not topic:
        return jsonify({"error": "Topic is required"}), 400
    
    try:
        # Prompt for notes generation
        notes_prompt = f"""You are ShikshaPlus AI Notes Generator. Generate comprehensive, well-structured study notes on the topic: "{topic}".

        Format the notes with:
        1. A clear title
        2. Introduction/Overview
        3. Main concepts and definitions
        4. Key points (bullet points)
        5. Examples if applicable
        6. Summary
        7. Important formulas/theorems if applicable
        8. Common misconceptions to avoid
        9. Practice questions/suggestions
        10. Additional resources/references
        
        Make the notes:
        - Educational and accurate
        - Well-organized with headings
        - Easy to understand
        - Suitable for revision
        - Include practical applications
        
        Topic: {topic}"""
        
        response = model.generate_content(notes_prompt)
        notes_text = response.text.strip()
        
        # Format notes with proper markdown-like structure
        formatted_notes = f"# Study Notes: {topic}\n\n{notes_text}"
        
        return jsonify({
            "success": True,
            "notes": formatted_notes,
            "topic": topic,
            "timestamp": datetime.now().isoformat()
        }), 200
        
    except Exception as e:
        print(f"Notes generation error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route("/api/ai/generate-roadmap", methods=["POST"])
def generate_roadmap():
    """Generate learning roadmap using AI"""
    result, err_json, code = auth_required()
    if err_json:
        return err_json, code
    
    user, uid = result
    data = request.get_json()
    
    goal = data.get("goal", "").strip()
    
    if not goal:
        return jsonify({"error": "Learning goal is required"}), 400
    
    try:
        # Prompt for roadmap generation
        roadmap_prompt = f"""You are ShikshaPlus AI Roadmap Generator. Create a comprehensive learning roadmap to achieve: "{goal}".

        Structure the roadmap with:
        
        1. GOAL: Clearly state the learning goal
        
        2. DURATION: Suggest a realistic timeframe (e.g., 3 months, 6 months)
        
        3. PHASES: Break down into 3-4 phases with:
           - Phase name/number
           - Duration (weeks)
           - Learning objectives
           - Key topics to cover
           - Practice projects/exercises
           - Resources to use
        
        4. WEEKLY SCHEDULE: Suggest a weekly study plan
        
        5. MILESTONES: Key achievements to track progress
        
        6. RESOURCES: Recommended books, courses, websites, tools
        
        7. TIPS: Study strategies and best practices
        
        8. COMMON CHALLENGES: What to expect and how to overcome
        
        Goal: {goal}
        
        Make the roadmap:
        - Practical and actionable
        - Progressive (beginner to advanced)
        - Include hands-on projects
        - Suggest free/accessible resources when possible
        - Include time for revision and practice"""
        
        response = model.generate_content(roadmap_prompt)
        roadmap_text = response.text.strip()
        
        # Parse and structure the roadmap for frontend
        # You can add more sophisticated parsing here if needed
        structured_roadmap = {
            "title": goal,
            "raw_content": roadmap_text,
            "structured": parse_roadmap_content(roadmap_text, goal),
            "timestamp": datetime.now().isoformat()
        }
        
        return jsonify({
            "success": True,
            "roadmap": structured_roadmap
        }), 200
        
    except Exception as e:
        print(f"Roadmap generation error: {e}")
        return jsonify({"error": str(e)}), 500

def parse_roadmap_content(text, goal):
    """Parse AI response into structured format for frontend"""
    # Simple parsing - you can enhance this based on your needs
    lines = text.split('\n')
    
    phases = []
    current_phase = None
    
    for line in lines:
        line = line.strip()
        if line.startswith("Phase") or "Phase" in line and ("1" in line or "2" in line or "3" in line):
            if current_phase:
                phases.append(current_phase)
            current_phase = {"title": line, "content": []}
        elif current_phase and line:
            current_phase["content"].append(line)
    
    if current_phase:
        phases.append(current_phase)
    
    return {
        "goal": goal,
        "duration": "12 weeks",  # Extract from text if possible
        "phases": phases if phases else [
            {
                "phase": "Phase 1",
                "title": "Foundation",
                "weeks": "Weeks 1-4",
                "content": ["AI-generated content will appear here"]
            }
        ],
        "milestones": ["Complete foundation", "Build projects", "Master key concepts"],
        "resources": {
            "courses": ["AI will suggest courses"],
            "books": ["AI will suggest books"],
            "platforms": ["GitHub", "Stack Overflow"],
            "communities": ["Online forums", "Study groups"]
        }
    }

# --- EXISTING ROUTES (keep them as is) ---
@app.route("/api/auth/login", methods=["POST"])
def login():
    data = request.get_json()
    token = data.get("id_token")
    user_type = data.get("user_type", "student")
    try:
        decoded_token = auth.verify_id_token(token, clock_skew_seconds=60)
        uid = decoded_token['uid']
        user = users.get(uid)
        
        if not user:
            users[uid] = {
                "id": uid,
                "email": decoded_token.get('email'),
                "user_type": user_type,
                "name": decoded_token.get('name', ""),
                "onboarded": True 
            }
            user = users[uid]
        return jsonify({"success": True, "user": user}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 401

@app.route("/api/auth/profile", methods=["GET"])
def get_profile():
    result, err_json, code = auth_required()
    if err_json: 
        return err_json, code
    return jsonify(result[0]), 200

@app.route("/api/certificate/generate", methods=["POST"])
def generate_certificate():
    result, err_json, code = auth_required()
    if err_json: 
        return err_json, code
    user, uid = result
    data = request.get_json()
    
    user_name = user.get("name") or "Valued Student"
    course_name = data.get("course_name", "Python Mastery")
    completion_date = datetime.now().strftime("%d-%m-%Y %H:%M")
    
    safe_name = re.sub(r'[^a-zA-Z0-9\s_-]', '', course_name).replace(' ', '_')
    filename = f"cert_{uid}_{safe_name}.pdf"
    filepath = os.path.join(CERT_FOLDER, filename)
    qr_temp_path = os.path.join(CERT_FOLDER, f"temp_{uid}.png")

    qr_data = f"ShikshaPlus. ✅ Course completion verification {user_name}. {course_name}. completed on {completion_date}."
    qr = qrcode.QRCode(box_size=10, border=1)
    qr.add_data(qr_data)
    qr.make(fit=True)
    qr.make_image(fill_color="black", back_color="white").save(qr_temp_path)
    
    pdf = FPDF("L", "mm", "A4")
    pdf.add_page()
    
    pdf.set_draw_color(0, 51, 153)
    pdf.set_line_width(2)
    pdf.rect(5, 5, 287, 200) 
    
    pdf.set_line_width(0.5)
    pdf.rect(8, 8, 281, 194)

    pdf.set_font('Arial', 'B', 20)
    pdf.set_text_color(0, 51, 153) 
    pdf.set_xy(15, 15)
    pdf.cell(0, 10, 'ShikshaPlus', 0, 1, 'L')
    
    pdf.set_y(40)
    pdf.set_text_color(0, 0, 0)
    pdf.set_font('Arial', 'B', 40)
    pdf.cell(277, 20, 'CERTIFICATE OF COMPLETION', 0, 1, 'C')
    
    pdf.ln(10)
    pdf.set_font('Arial', '', 18)
    pdf.cell(277, 10, 'This is to certify that', 0, 1, 'C')
    
    pdf.ln(5)
    pdf.set_font('Arial', 'B', 30)
    pdf.set_text_color(0, 51, 153)
    pdf.cell(277, 20, user_name, 0, 1, 'C')
    
    pdf.set_text_color(0, 0, 0)
    pdf.set_font('Arial', '', 16)
    pdf.cell(277, 15, f'has completed the course and took a test in', 0, 1, 'C')
    pdf.set_font('Arial', 'B', 22)
    pdf.cell(277, 15, course_name, 0, 1, 'C')
    
    pdf.ln(5)
    pdf.set_font('Arial', 'I', 12)
    pdf.cell(277, 10, f'Issued on: {completion_date}', 0, 1, 'C')

    pdf.image(qr_temp_path, x=30, y=145, w=35)

    pdf.set_y(185)
    pdf.set_font('Arial', 'I', 10)
    pdf.set_text_color(150, 150, 150)
    pdf.cell(277, 10, 'This is Auto generated Certificate', 0, 0, 'C')

    pdf.output(filepath)
    if os.path.exists(qr_temp_path):
        os.remove(qr_temp_path)
    
    return jsonify({"success": True, "download_url": f"/api/certificate/download/{filename}"}), 200

@app.route("/api/certificate/download/<filename>", methods=["GET"])
def download_certificate(filename):
    path = os.path.join(CERT_FOLDER, filename)
    return send_file(path, as_attachment=True) if os.path.exists(path) else (jsonify({"error": "Not found"}), 404)

if __name__ == "__main__":
    app.run(debug=True, port=5000)