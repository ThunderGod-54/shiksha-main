from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os
import re
import json
from fpdf import FPDF
import qrcode
import firebase_admin
from firebase_admin import credentials, auth
from datetime import datetime

app = Flask(__name__)

# --- CONFIG & FIREBASE ---
# --- CONFIG & FIREBASE ---
# Use this exact line for the most permissive CORS
CORS(app, resources={r"/*": {"origins": "*", "allow_headers": "*", "methods": "*"}})
app.config['SECRET_KEY'] = "hackathon-secret-key" 

# Vercel fix: Use /tmp for certificates
CERT_FOLDER = "/tmp/certificates"
os.makedirs(CERT_FOLDER, exist_ok=True)

base_dir = os.path.dirname(os.path.abspath(__file__))
key_path = os.path.join(base_dir, "serviceAccountKey.json")

if not firebase_admin._apps:
    cred = credentials.Certificate(key_path)
    firebase_admin.initialize_app(cred)

users = {}

@app.route("/", methods=["GET"])
def health_check():
    return "Shiksha Plus Backend Running Successfully!"

def auth_required():
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return None, jsonify({"error": "No token provided"}), 401
    token = auth_header.split(" ")[1]
    try:
        decoded_token = auth.verify_id_token(token, clock_skew_seconds=60)
        uid = decoded_token['uid']
        user = users.get(uid) or {"id": uid, "name": decoded_token.get('name', "Valued Student")}
        return (user, uid), None, None
    except Exception as e:
        return None, jsonify({"error": str(e)}), 401

@app.route("/api/auth/login", methods=["POST"])
def login():
    data = request.get_json()
    token = data.get("id_token")
    user_type = data.get("user_type", "student")
    try:
        decoded_token = auth.verify_id_token(token, clock_skew_seconds=60)
        uid = decoded_token['uid']
        users[uid] = {
            "id": uid,
            "email": decoded_token.get('email'),
            "user_type": user_type,
            "name": decoded_token.get('name', ""),
            "onboarded": True 
        }
        return jsonify({"success": True, "user": users[uid]}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 401

@app.route("/api/certificate/generate", methods=["POST"])
def generate_certificate():
    result, err_json, code = auth_required()
    if err_json: return err_json, code
    
    user, uid = result
    data = request.get_json()
    
    user_name = user.get("name") or "Valued Student"
    course_name = data.get("course_name", "Python Mastery")
    completion_date = datetime.now().strftime("%d-%m-%Y %H:%M")
    
    safe_name = re.sub(r'[^a-zA-Z0-9\s_-]', '', course_name).replace(' ', '_')
    filename = f"cert_{uid}_{safe_name}.pdf"
    filepath = os.path.join(CERT_FOLDER, filename)
    qr_temp_path = os.path.join(CERT_FOLDER, f"temp_{uid}.png")

    # --- QR CODE GENERATION ---
    qr_data = f"ShikshaPlus. ✅ Course completion verification {user_name}. {course_name}. completed on {completion_date}."
    qr = qrcode.QRCode(box_size=10, border=1)
    qr.add_data(qr_data)
    qr.make(fit=True)
    qr.make_image(fill_color="black", back_color="white").save(qr_temp_path)
    
    # --- ORIGINAL STYLED PDF GENERATION ---
    pdf = FPDF("L", "mm", "A4")
    pdf.add_page()
    
    # Outer Blue Border
    pdf.set_draw_color(0, 51, 153)
    pdf.set_line_width(2)
    pdf.rect(5, 5, 287, 200) 
    
    # Inner Border
    pdf.set_line_width(0.5)
    pdf.rect(8, 8, 281, 194)

    # Logo/Brand
    pdf.set_font('Arial', 'B', 20)
    pdf.set_text_color(0, 51, 153) 
    pdf.set_xy(15, 15)
    pdf.cell(0, 10, 'ShikshaPlus', 0, 1, 'L')
    
    # Main Header
    pdf.set_y(40)
    pdf.set_text_color(0, 0, 0)
    pdf.set_font('Arial', 'B', 40)
    pdf.cell(277, 20, 'CERTIFICATE OF COMPLETION', 0, 1, 'C')
    
    pdf.ln(10)
    pdf.set_font('Arial', '', 18)
    pdf.cell(277, 10, 'This is to certify that', 0, 1, 'C')
    
    # User Name
    pdf.ln(5)
    pdf.set_font('Arial', 'B', 30)
    pdf.set_text_color(0, 51, 153)
    pdf.cell(277, 20, user_name, 0, 1, 'C')
    
    # Course Info
    pdf.set_text_color(0, 0, 0)
    pdf.set_font('Arial', '', 16)
    pdf.cell(277, 15, 'has completed the course and took a test in', 0, 1, 'C')
    pdf.set_font('Arial', 'B', 22)
    pdf.cell(277, 15, course_name, 0, 1, 'C')
    
    pdf.ln(5)
    pdf.set_font('Arial', 'I', 12)
    pdf.cell(277, 10, f'Issued on: {completion_date}', 0, 1, 'C')

    # Position QR Code
    pdf.image(qr_temp_path, x=30, y=145, w=35)

    # Footer
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
    if os.path.exists(path):
        return send_file(path, as_attachment=True)
    return jsonify({"error": "Not found"}), 404

if __name__ == "__main__":
    app.run()