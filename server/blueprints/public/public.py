import os
import cv2
from flask import Blueprint, Response, jsonify, request, current_app
from werkzeug.utils import secure_filename
from datetime import datetime
from pymongo import MongoClient

from modules.geocode import reverse_geocode
from modules.detect_object_on_video import (
    detect_object_on_video,
    analyze_video_for_accident,
)

# -----------------------------
# PUBLIC BLUEPRINT
# -----------------------------
public_bp = Blueprint("public", __name__, url_prefix="/api/v1/public")

# -----------------------------
# DB CONNECTION
# -----------------------------
client = MongoClient(os.getenv("MONGO_URI"))
db = client["accident_db"]
accident_results = db["accident_results"]

# -----------------------------
# HOME
# -----------------------------
@public_bp.route("/", methods=["GET"])
def return_home():
    return jsonify({"message": "Welcome to public API"})

# -----------------------------
# UPLOAD + ANALYZE VIDEO
# -----------------------------
@public_bp.route("/upload-video", methods=["POST"])
def upload_video():
    if "video" not in request.files:
        return jsonify({
            "status": "error",
            "message": "No video file received"
        }), 400

    video_file = request.files["video"]

    if video_file.filename == "":
        return jsonify({
            "status": "error",
            "message": "Empty filename"
        }), 400

    filename = secure_filename(video_file.filename)
    save_dir = current_app.config["UPLOAD_FOLDER"]
    os.makedirs(save_dir, exist_ok=True)

    save_path = os.path.join(save_dir, filename)
    video_file.save(save_path)

    # -----------------------------
    # RUN YOLO ANALYSIS
    # -----------------------------
    analysis = analyze_video_for_accident(save_path)

    # -----------------------------
    # CAPTURE ACCIDENT FRAME
    # -----------------------------
    image_url = ""

    if analysis["result"] == "Accident" and analysis.get("frame") is not None:
        name_without_ext = os.path.splitext(filename)[0]
        image_name = f"accident_{name_without_ext}.jpg"

        image_dir = os.path.join("static", "accident_frames")
        os.makedirs(image_dir, exist_ok=True)

        image_path = os.path.join(image_dir, image_name)
        cv2.imwrite(image_path, analysis["frame"])

        BASE_URL = os.getenv("BACKEND_URL", "http://127.0.0.1:8080")
        image_url = f"{BASE_URL}/static/accident_frames/{image_name}"



    # -----------------------------
    # LOCATION (FIXED CAMERA COORDS)
    # -----------------------------
    latitude = 12.9698
    longitude = 77.75

    address, city = reverse_geocode(latitude, longitude)

    # -----------------------------
    # SAVE RESULT TO DB
    # -----------------------------
    record = {
        "video_name": filename,
        "result": analysis["result"],
        "severity": analysis["severity"],
        "severityInPercentage": analysis["severityInPercentage"],
        "address": address,
        "city": city,
        "latitude": latitude,
        "longitude": longitude,
        "image_url": image_url,
        "date": datetime.utcnow(),
    }

    inserted = accident_results.insert_one(record)

    # -----------------------------
    # RESPONSE TO FRONTEND
    # -----------------------------
    return jsonify({
        "status": "success",
        "video": filename,
        "analysis": {
            "result": analysis["result"],
            "severity": analysis["severity"],
            "severityInPercentage": analysis["severityInPercentage"],
        },
        "accidentId": str(inserted.inserted_id),
    }), 200

# -----------------------------
# SERVE VIDEO (PREVIEW)
# -----------------------------
@public_bp.route("/video/<filename>", methods=["GET"])
def serve_video(filename):
    return current_app.send_static_file(f"videos/{filename}")

# -----------------------------
# STREAM DETECTION FRAMES (OPTIONAL)
# -----------------------------
def generate_frames(path_x=""):
    yolo_output = detect_object_on_video(path_x)
    for detection in yolo_output:
        _, buffer = cv2.imencode(".jpg", detection)
        frame = buffer.tobytes()
        yield (
            b"--frame\r\n"
            b"Content-Type: image/jpeg\r\n\r\n" + frame + b"\r\n"
        )

@public_bp.route("/detect/<filename>", methods=["GET"])
def detect_video(filename):
    video_path = os.path.join("static", "videos", filename)
    return Response(
        generate_frames(path_x=video_path),
        mimetype="multipart/x-mixed-replace; boundary=frame"
    )
