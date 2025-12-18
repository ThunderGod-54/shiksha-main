from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os
import re
import datetime
from fpdf import FPDF
import qrcode
import firebase_admin
from firebase_admin import credentials, auth

app = Flask(__name__)

# --- CONFIG & FIREBASE ---
CORS(app, resources={r"/api/*": {"origins": "*"}})
app.config['SECRET_KEY'] = "hackathon-secret-key" 
CERT_FOLDER = "certificates"
os.makedirs(CERT_FOLDER, exist_ok=True)

# Ensure 'serviceAccountKey.json' is in your backend folder!
cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred)

# In-memory storage (UID as key)
users = {}

# --- AUTH MIDDLEWARE ---
def auth_required():
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return None, jsonify({"error": "No token provided"}), 401
    token = auth_header.split(" ")[1]
    try:
        # clock_skew_seconds=60 fixes "Token used too early"
        decoded_token = auth.verify_id_token(token, clock_skew_seconds=60)
        uid = decoded_token['uid']
        user = users.get(uid)
        if not user:
            return None, jsonify({"error": "User not in backend"}), 404
        return (user, uid), None, None
    except Exception as e:
        return None, jsonify({"error": str(e)}), 401

# --- ROUTES ---
@app.route("/api/auth/login", methods=["POST"])
def login():
    data = request.get_json()
    token = data.get("id_token")
    user_type = data.get("user_type", "student")
    try:
        decoded_token = auth.verify_id_token(token, clock_skew_seconds=60)
        uid = decoded_token['uid']
        user = users.get(uid)
        
        # AUTO-REGISTER: Bypasses "User not registered" error
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
    if err_json: return err_json, code
    return jsonify(result[0]), 200

@app.route("/api/certificate/generate", methods=["POST"])
def generate_certificate():
    result, err_json, code = auth_required()
    if err_json: return err_json, code
    user, uid = result
    data = request.get_json()
    
    user_name = user.get("name") or "Valued Student"
    course_name = data.get("course_name", "Python Mastery")
    
    safe_name = re.sub(r'[^a-zA-Z0-9\s_-]', '', course_name).replace(' ', '_')
    filename = f"cert_{uid}_{safe_name}.pdf"
    filepath = os.path.join(CERT_FOLDER, filename)

    qrcode.make(f"User: {user_name} | {course_name}").save(os.path.join(CERT_FOLDER, "temp.png"))
    
    pdf = FPDF("L", "mm", "A4")
    pdf.add_page()
    pdf.rect(5, 5, 287, 200)
    pdf.set_font('Arial', 'B', 40)
    pdf.ln(40)
    pdf.cell(277, 20, 'CERTIFICATE OF COMPLETION', 0, 1, 'C')
    pdf.set_font('Arial', '', 20)
    pdf.cell(277, 40, f'Awarded to {user_name}', 0, 1, 'C')
    pdf.image(os.path.join(CERT_FOLDER, "temp.png"), x=230, y=140, w=40)
    pdf.output(filepath)
    
    return jsonify({"success": True, "download_url": f"/api/certificate/download/{filename}"}), 200

@app.route("/api/certificate/download/<filename>", methods=["GET"])
def download_certificate(filename):
    path = os.path.join(CERT_FOLDER, filename)
    return send_file(path, as_attachment=True) if os.path.exists(path) else (jsonify({"error": "Not found"}), 404)

if __name__ == "__main__":
    app.run(debug=True, port=5000)