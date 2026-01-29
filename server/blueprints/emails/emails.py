from flask import Blueprint, jsonify, request
from flask_mail import Message
import os

# ✅ IMPORT MAIL FROM SHARED EXTENSIONS (NO CIRCULAR IMPORT)
from extensions import mail

emails = Blueprint("emails", __name__, url_prefix="/api/v1/emails")

@emails.route("/send-email", methods=["POST"])
def send_email():
    data = request.get_json()

    latitude = data.get("latitude")
    longitude = data.get("longitude")
    severity = data.get("severity", "Unknown")
    location = data.get("location", "Unknown location")

    sender_email = os.getenv("EMAIL")
    receiver_email = os.getenv("SENDTO")

    if not sender_email or not receiver_email:
        return jsonify({
            "error": "Email credentials not configured"
        }), 500

    google_map_link = (
        f"https://www.google.com/maps/search/?api=1&query={latitude},{longitude}"
    )

    msg = Message(
        subject=f"🚨 Accident Alert - Severity ({severity})",
        sender=sender_email,
        recipients=[receiver_email],
        body=(
            f"🚨 Accident Alert\n\n"
            f"Severity: {severity}\n"
            f"Location: {location}\n"
            f"Latitude: {latitude}\n"
            f"Longitude: {longitude}\n\n"
            f"Google Maps Link:\n{google_map_link}\n\n"
            f"— Accident Detection System"
        )
    )

    mail.send(msg)

    return jsonify({
        "message": "Email sent successfully"
    }), 200
