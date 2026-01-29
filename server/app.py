from dotenv import load_dotenv
load_dotenv()

from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
import datetime
import os

from extensions import mail  # ✅ IMPORT SHARED MAIL

print("✅ REAL app.py RUNNING")

# -------------------------
# Flask App
# -------------------------
app = Flask(__name__, static_folder="static")
app.config["UPLOAD_FOLDER"] = "static/videos"

# -------------------------
# JWT CONFIG
# -------------------------
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = datetime.timedelta(days=1)
jwt = JWTManager(app)

# -------------------------
# CORS
# -------------------------
CORS(app, origins=["http://localhost:3000"], supports_credentials=True)

# -------------------------
# MAIL CONFIG (GMAIL)
# -------------------------
app.config["MAIL_SERVER"] = "smtp.gmail.com"
app.config["MAIL_PORT"] = 465
app.config["MAIL_USERNAME"] = os.getenv("EMAIL")
app.config["MAIL_PASSWORD"] = os.getenv("PASSWORD")
app.config["MAIL_USE_TLS"] = False
app.config["MAIL_USE_SSL"] = True

mail.init_app(app)  # ✅ INITIALIZE MAIL HERE

# -------------------------
# BLUEPRINTS
# -------------------------
from blueprints.auth import auth_bp
from blueprints.accident.accident import accident_bp
from blueprints.public.public import public_bp
from blueprints.emails.emails import emails

app.register_blueprint(auth_bp)
app.register_blueprint(accident_bp)
app.register_blueprint(public_bp)
app.register_blueprint(emails)

# -------------------------
# HEALTH CHECK
# -------------------------
@app.route("/")
def health():
    return jsonify({"msg": "Server running successfully"}), 200

# -------------------------
# RUN
# -------------------------
if __name__ == "__main__":
    app.run(debug=True, port=8080)
