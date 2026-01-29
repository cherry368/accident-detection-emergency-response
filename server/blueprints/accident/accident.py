from flask import Blueprint, jsonify, request
from pymongo import MongoClient
from bson import ObjectId
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

# ---------------------------
# BLUEPRINT
# ---------------------------
accident_bp = Blueprint("accident", __name__, url_prefix="/api/v1/accident")

# ---------------------------
# MONGODB ATLAS
# ---------------------------
client = MongoClient(os.getenv("MONGO_URI"))
db = client["accident_db"]
accident_results = db["accident_results"]

# ---------------------------
# CREATE ACCIDENT
# ---------------------------
@accident_bp.route("/create", methods=["POST"])
def create_accident():
    data = request.get_json()

    required_fields = [
        "address",
        "city",
        "latitude",
        "longitude",
        "severity",
        "severityInPercentage",
        "image_url",
        "video_name"
    ]

    for field in required_fields:
        if field not in data:
            return jsonify({
                "status": "error",
                "message": f"Missing field: {field}"
            }), 400

    accident_results.insert_one({
        "address": data["address"],
        "city": data["city"],
        "latitude": data["latitude"],
        "longitude": data["longitude"],
        "severity": data["severity"],
        "severityInPercentage": data["severityInPercentage"],
        "image_url": data["image_url"],
        "video_name": data["video_name"],
        "date": datetime.utcnow()   # always store as Date
    })

    return jsonify({
        "status": "success",
        "message": "Accident record created"
    }), 201

# ---------------------------
# GET ALL ACCIDENTS
# ---------------------------
@accident_bp.route("/all", methods=["GET"])
def get_all_accidents():
    results = []

    for doc in accident_results.find().sort("date", -1):  # 🔥 newest first
        results.append({
            "id": str(doc["_id"]),
            "video_name": doc.get("video_name"),
            "result": doc.get("result"),
            "severity": doc.get("severity"),
            "severityInPercentage": doc.get("severityInPercentage"),
            "address": doc.get("address"),
            "city": doc.get("city"),
            "latitude": doc.get("latitude"),
            "longitude": doc.get("longitude"),
            "image_url": doc.get("image_url"),
            "date": doc.get("date"),
        })

    return jsonify({
        "status": "success",
        "datas": results
    }), 200


# ---------------------------
# DASHBOARD SUMMARY (SAFE)
# ---------------------------
@accident_bp.route("/summary", methods=["GET"])
def get_summary():
    pipeline = [
        {
            "$addFields": {
                "safeDate": {
                    "$cond": [
                        { "$eq": [{ "$type": "$date" }, "date"] },
                        "$date",
                        {
                            "$cond": [
                                { "$eq": [{ "$type": "$date" }, "string"] },
                                { "$toDate": "$date" },
                                None
                            ]
                        }
                    ]
                }
            }
        },
        {
            "$match": {
                "safeDate": { "$ne": None }
            }
        },
        {
            "$group": {
                "_id": {
                    "year": { "$year": "$safeDate" },
                    "month": { "$month": "$safeDate" }
                },
                "count": { "$sum": 1 }
            }
        },
        {
            "$sort": {
                "_id.year": 1,
                "_id.month": 1
            }
        }
    ]

    data = []
    for item in accident_results.aggregate(pipeline):
        data.append({
            "month": f'{item["_id"]["year"]}-{str(item["_id"]["month"]).zfill(2)}',
            "count": item["count"]
        })

    return jsonify(data), 200

# ---------------------------
# SINGLE ACCIDENT DETAILS
# ---------------------------
@accident_bp.route("/<accident_id>", methods=["GET"])
def get_single_accident(accident_id):
    accident = accident_results.find_one({ "_id": ObjectId(accident_id) })

    if not accident:
        return jsonify({
            "status": "error",
            "message": "Accident not found"
        }), 404

    return jsonify({
        "status": "success",
        "data": {
            "id": str(accident.get("_id")),
            "address": accident.get("address"),
            "city": accident.get("city"),
            "latitude": accident.get("latitude"),
            "longitude": accident.get("longitude"),
            "severity": accident.get("severity"),
            "severityInPercentage": accident.get("severityInPercentage"),
            "image_url": accident.get("image_url"),
            "video_name": accident.get("video_name"),
            "date": accident.get("date")
        }
    }), 200
