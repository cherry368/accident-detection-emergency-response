from flask import request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token
from pymongo import MongoClient
import os
from dotenv import load_dotenv

from . import auth_bp  # ✅ REQUIRED


load_dotenv()

# MongoDB connection (Atlas)
client = MongoClient(os.getenv("MONGO_URI"))
db = client["accident_db"]
users = db["users"]

# -------------------------
# REGISTER
# -------------------------
@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"msg": "Email and password are required"}), 400

    if users.find_one({"email": email}):
        return jsonify({"msg": "User already exists"}), 409

    hashed_password = generate_password_hash(password)

    users.insert_one({
        "email": email,
        "password": hashed_password
    })

    return jsonify({"msg": "User registered successfully"}), 201


# -------------------------
# LOGIN
# -------------------------
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    email = data.get("username") or data.get("email")
    password = data.get("password")

    user = users.find_one({"email": email})

    if not user:
        return jsonify({"msg": "Invalid email or password"}), 401

    if not check_password_hash(user["password"], password):
        return jsonify({"msg": "Invalid email or password"}), 401

    access_token = create_access_token(identity=email)

    response = jsonify({"access_token": access_token})
    response.set_cookie(
        "token",
        access_token,
        httponly=True,
        samesite="Lax"
    )

    return response, 200
