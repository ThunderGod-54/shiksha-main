from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import jwt
import datetime
import hashlib
import os
from fpdf import FPDF
import qrcode
import re # Import re for better filename cleaning

app = Flask(__name__)

# ---------------------------------------------------------------------
# CONFIG
# ---------------------------------------------------------------------
CORS(app, resources={r"/api/*": {"origins": "*"}})

# WARNING: Change this SECRET_KEY in a production environment
app.config['SECRET_KEY'] = "your-secret-key-here" 
CERT_FOLDER = "certificates"
os.makedirs(CERT_FOLDER, exist_ok=True)

# In-memory storage (use DB later)
# NOTE: User must be registered and onboarded (with a name) for the certificate to work well.
users = {}

# ---------------------------------------------------------------------
# UTILITIES
# ---------------------------------------------------------------------
def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

def generate_token(user_id, user_type):
    return jwt.encode(
        {
            "user_id": user_id,
            "user_type": user_type,
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        },
        app.config["SECRET_KEY"],
        algorithm="HS256"
    )

# FIXED USER LOOKUP
def get_user_by_id(user_id):
    # This lookup is inefficient but works for in-memory storage
    for email, data in users.items():
        if data["id"] == user_id:
            return data, email
    return None, None


def auth_required():
    token = request.headers.get("Authorization")

    if not token:
        return None, jsonify({"error": "Authorization header missing"}), 401

    if token.startswith("Bearer "):
        token = token[7:]

    try:
        payload = jwt.decode(token, app.config["SECRET_KEY"], algorithms=["HS256"])
        user, user_email = get_user_by_id(payload["user_id"])

        if not user:
            return None, jsonify({"error": "User not found"}), 404

        # Return user data and email
        return (user, user_email), None, None

    except jwt.ExpiredSignatureError:
        return None, jsonify({"error": "Token expired"}), 401
    except jwt.InvalidTokenError:
        return None, jsonify({"error": "Invalid token"}), 401


# ---------------------------------------------------------------------
# AUTH ROUTES
# ---------------------------------------------------------------------
@app.route("/api/auth/register", methods=["POST"])
def register():
    data = request.get_json()

    email = data.get("email")
    password = data.get("password")
    user_type = data.get("user_type", "student")

    if not email or not password:
        return jsonify({"error": "Email & password required"}), 400

    if email in users:
        return jsonify({"error": "User already exists"}), 409

    # Use a simple counter ID for in-memory storage
    user_id = str(len(users) + 1)

    users[email] = {
        "id": user_id,
        "email": email,
        "password": hash_password(password),
        "user_type": user_type,
        "name": "", # Must be filled by /api/auth/onboard
        "phone": "",
        "institution_type": "",
        "branch": "",
        "interests": [],
        "onboarded": False
    }

    token = generate_token(user_id, user_type)

    return jsonify({
        "success": True,
        "message": "Account created successfully",
        "user": {"id": user_id, "email": email, "user_type": user_type},
        "token": token
    }), 201


@app.route("/api/auth/login", methods=["POST"])
def login():
    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email & password required"}), 400

    user = users.get(email)
    if not user or user["password"] != hash_password(password):
        return jsonify({"error": "Invalid credentials"}), 401

    token = generate_token(user["id"], user["user_type"])

    return jsonify({
        "success": True,
        "message": "Login successful",
        "user": {
            "id": user["id"],
            "email": user["email"],
            "user_type": user["user_type"]
        },
        "token": token
    }), 200


@app.route("/api/auth/verify", methods=["GET"])
def verify_token():
    result, err_json, code = auth_required()
    if err_json:
        return err_json, code

    user, _ = result

    return jsonify({
        "success": True,
        "user": {
            "id": user["id"],
            "email": user["email"],
            "user_type": user["user_type"],
            "onboarded": user.get("onboarded", False)
        }
    }), 200


# ---------------------------------------------------------------------
# ONBOARDING
# ---------------------------------------------------------------------
@app.route("/api/auth/onboard", methods=["POST"])
def onboard_user():
    result, err_json, code = auth_required()
    if err_json:
        return err_json, code

    user, user_email = result
    data = request.get_json()

    required = ["name", "phone", "institution_type"]
    for field in required:
        if not data.get(field):
            return jsonify({"error": f"{field} required"}), 400

    user["name"] = data["name"]
    user["phone"] = data["phone"]
    user["institution_type"] = data["institution_type"]
    user["branch"] = data.get("branch", "")
    user["interests"] = data.get("interests", [])
    user["onboarded"] = True

    return jsonify({
        "success": True,
        "message": "Profile updated",
        "user": user
    }), 200


# ---------------------------------------------------------------------
# CERTIFICATE GENERATOR
# ---------------------------------------------------------------------
@app.route("/api/certificate/generate", methods=["POST"])
def generate_certificate():
    result, err_json, code = auth_required()
    if err_json:
        return err_json, code

    user, _ = result
    data = request.get_json()

    # Ensure user has a name for the certificate
    user_name = user.get("name", "A Valued Student")
    if not user_name:
        user_name = "A Valued Student"

    course_name = data.get("course_name", "Unnamed Course")
    
    # --- AGGRESSIVE CLEANING FOR FILENAME SAFETY ---
    # 1. Replace non-alphanumeric characters (except space, hyphen, underscore)
    safe_course_name = re.sub(r'[^a-zA-Z0-9\s_-]', '', course_name)
    # 2. Replace all remaining spaces with underscores
    safe_course_name = safe_course_name.replace(' ', '_')
    # ----------------------------------------------

    filename = f"certificate_{user['id']}_{safe_course_name}.pdf"
    filepath = os.path.join(CERT_FOLDER, filename)

    # --- QR Code Setup ---
    qr_msg = f"User: {user_name} | Course: {course_name} | Date: {datetime.date.today().strftime('%Y-%m-%d')}"
    qr_path = os.path.join(CERT_FOLDER, f"qr_{user['id']}_{safe_course_name}.png") 

    qr = qrcode.make(qr_msg)
    qr.save(qr_path)
    # ---------------------

    # PDF Generation
    pdf = FPDF("L", "mm", "A4") # Landscape, millimeters, A4 size
    pdf.add_page()
    pdf.set_auto_page_break(False) # Important for fixed layout

    # Page size for reference (A4 landscape: 297mm x 210mm)
    page_width = 297
    page_height = 210
    
    # Border (optional but good for visual)
    pdf.set_line_width(2)
    pdf.rect(5, 5, page_width - 10, page_height - 10)

    # 1. Certificate Title
    pdf.set_font('Arial', 'B', 48)
    pdf.set_text_color(24, 75, 127) # Dark Blue
    pdf.ln(20) # Move down 20mm
    pdf.cell(page_width - 20, 20, 'CERTIFICATE OF COMPLETION', 0, 1, 'C')

    # 2. Text: This certifies that
    pdf.set_font('Arial', '', 18)
    pdf.set_text_color(0, 0, 0) # Black
    pdf.ln(5) # Move down 5mm
    pdf.cell(page_width - 20, 10, 'This certifies that', 0, 1, 'C')

    # 3. User Name (Prominent)
    pdf.set_font('Arial', 'B', 36)
    pdf.set_text_color(16, 126, 172) # Medium Blue
    pdf.ln(5)
    pdf.cell(page_width - 20, 20, user_name, 0, 1, 'C')

    # 4. Text: has successfully completed the course
    pdf.set_font('Arial', '', 18)
    pdf.set_text_color(0, 0, 0) # Black
    pdf.ln(5)
    pdf.cell(page_width - 20, 10, 'has successfully completed the course on', 0, 1, 'C')

    # 5. Course Name (Prominent)
    pdf.set_font('Arial', 'I', 30) # Italic
    pdf.set_text_color(70, 70, 70) # Dark Gray
    pdf.ln(5)
    pdf.cell(page_width - 20, 15, course_name, 0, 1, 'C')

    # 6. Date and Signature (Aligned to the bottom)
    completion_date = datetime.date.today().strftime("%B %d, %Y")
    
    # Signature/Authority (Example) - Left Side
    pdf.set_xy(30, page_height - 35)
    pdf.set_font('Arial', 'I', 12)
    pdf.cell(50, 5, '', 'T', 0, 'C') # Horizontal line for signature
    pdf.set_xy(30, page_height - 30)
    pdf.cell(50, 5, 'Instructor Signature', 0, 0, 'C')

    # Date - Center
    pdf.set_xy((page_width / 2) - 25, page_height - 30)
    pdf.set_font('Arial', '', 14)
    pdf.cell(50, 5, f'Date: {completion_date}', 0, 0, 'C')

    # 7. QR Code (Bottom Right Corner)
    qr_w = 40
    qr_x = page_width - qr_w - 20 
    qr_y = page_height - qr_w - 20 
    pdf.image(qr_path, x=qr_x, y=qr_y, w=qr_w) 


    pdf.output(filepath)

    # OPTIONAL: Delete the temporary QR code file after the PDF is created
    try:
        os.remove(qr_path)
    except OSError as e:
        print(f"Error removing temporary QR file {qr_path}: {e}")
        
    return jsonify({
        "success": True,
        "message": "Certificate generated",
        "download_url": f"/api/certificate/download/{filename}"
    }), 200

# ---------------------------------------------------------------------
# DOWNLOAD ROUTE (CRITICAL FOR FRONTEND DOWNLOAD BUTTON)
# ---------------------------------------------------------------------
@app.route("/api/certificate/download/<filename>", methods=["GET"])
def download_certificate(filename):
    filepath = os.path.join(CERT_FOLDER, filename)
    
    if os.path.exists(filepath):
        # Use send_file to deliver the PDF file as an attachment
        return send_file(
            filepath, 
            as_attachment=True, 
            download_name=filename, 
            mimetype='application/pdf'
        )
    else:
        return jsonify({"error": "Certificate not found"}), 404


# ---------------------------------------------------------------------
# SERVER
# ---------------------------------------------------------------------
if __name__ == "__main__":
    app.run(debug=True, port=5000)