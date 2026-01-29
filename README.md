# 🚨 Accident Detection and Emergency Response System

A **CNN / YOLO-based Accident Detection System** that analyzes uploaded videos or live feeds to detect road accidents and automatically notify rescue teams via email.  
The system also provides a dashboard with analytics, accident history, and detailed incident views, making it suitable for academic demos and smart safety applications.

---

## 📘 Project Background

This project was initially collected from a friend in an early-stage form and later **significantly enhanced, fixed, and extended**.  
All major backend integrations, frontend dashboard logic, database handling, and alert systems were implemented and stabilized afterward to make the system demo-ready and robust.

---

## ✨ Major Improvements

### ✅ Backend (Flask)

- Integrated **MongoDB Atlas** (replaced local MongoDB) with a standardized accident data schema.
- Fixed date aggregation issues for accurate dashboard analytics.
- Implemented robust REST APIs:
  - `POST /api/v1/accident/create` – Create and store a new accident record.
  - `GET /api/v1/accident/all` – Fetch all recorded accidents.
  - `GET /api/v1/accident/summary` – Return summary/aggregated analytics.
  - `GET /api/v1/accident/<id>` – Fetch a single accident by ID.
- Implemented **Quick Email Alert System** using Flask-Mail to notify rescue teams instantly.
- Resolved circular imports via a shared extensions pattern, improving structure and maintainability.
- Added better error handling and improved overall backend stability.

### ✅ Frontend (Next.js)

- Dashboard redesigned for clearer presentation and academic evaluation.
- Monthly accident overview chart powered by backend aggregation.
- "All Datas" table connected directly to live backend APIs (no dummy/mock data).
- Color-coded severity indicators: **High / Medium / Low** for quick risk understanding.
- Single Accident Details page with:
  - Detailed accident information.
  - Map view using latitude and longitude.
  - Accident image preview from generated snapshots.
  - Quick Mail button to trigger rescue email.
- Removed mock data and polished UI/UX for smooth demos and viva.

### ✅ ML / Video Processing

- **YOLOv8** integrated for object detection and accident inference.
- Video frame processing pipeline to detect accidents in uploaded videos.
- Detection results are persisted to MongoDB and linked to the dashboard and alert system.
- Code structure prepared for future **real-time CCTV / IP camera inference**.

---

## 🧱 System Architecture

```text
Frontend (Next.js Dashboard)
          ↓
Backend (Flask REST APIs)
          ↓
MongoDB Atlas (accident_results collection)
          ↓
Email Alert System (Gmail SMTP via Flask-Mail)
          ↓
Rescue Teams / Authorities
```

- **Frontend**: Analytics, tables, maps, and detailed accident views.
- **Backend**: API layer, business logic, and email notification engine.
- **Database**: Central store for accidents, images, and metadata on MongoDB Atlas.
- **Notification**: Email alerts containing severity, address, coordinates, and map links.

---

## 🖼️ Accident Image Generation & Storage

### How Accident Images Are Generated

When a video is uploaded, it is analyzed using the YOLO-based accident detection model:

- The system processes the video frame by frame.
- If an accident is detected, it:
  - Extracts the relevant frame from the video.
  - Draws bounding boxes around detected objects.
  - Saves this processed frame as an accident snapshot.

Images are generated **only for accident-positive videos**, ensuring authenticity.

### Image Storage Logic

- Accident images are generated **directly from uploaded accident videos**.
- Images are stored externally (e.g., Cloudinary or configured storage).
- MongoDB stores a reference via the `image_url` field.
- No images are fetched from random online sources, and no image is stored if no accident is detected.

### Image Usage in the Application

Accident images are displayed in:

- Single Accident Details page in the dashboard.
- Email alerts sent to rescue teams, so each image corresponds to a real incident frame.

---

## 🗂️ Database Schema (`accident_results`)

Example document:

```json
{
  "address": "MG Road",
  "city": "Bangalore",
  "latitude": 12.9716,
  "longitude": 77.5946,
  "severity": "High",
  "severityInPercentage": 65,
  "image_url": "generated_from_video_frame.jpg",
  "video_name": "uploaded_video.mp4",
  "date": "2024-03-02T23:23:47.000+00:00"
}
```

- Ensure `date` is stored as a valid ISO string or MongoDB `Date` type for correct aggregation and analytics on the dashboard.

---

## 🔐 Environment Configuration (Important)

This project uses personal credentials; anyone reusing it must configure their own values.

Create `server/.env` with:

```env
# MongoDB
MONGO_URI=your_mongodb_atlas_connection_string

# JWT
JWT_SECRET_KEY=your_secret_key

# Email (Gmail SMTP)
EMAIL=your_email@gmail.com
PASSWORD=your_gmail_app_password
SENDTO=receiver_email@gmail.com

# Cloudinary (if used)
CLOUD_NAME=your_cloudinary_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret
```

- Use a **Gmail App Password**, not your regular Gmail account password.

---

## ▶️ How to Run the Project

### Backend

```bash
cd server
python app.py
```

- Backend runs at: `http://127.0.0.1:8080`

### Frontend

```bash
cd client
npm install
npm run dev
```

- Frontend runs at: `http://localhost:3000`

---

## 📧 Quick Mail Feature

Triggered from the **Single Accident Details** page.  
Each email includes:

- Accident severity.
- Address.
- Latitude & longitude.
- Google Maps location link.

Valid email credentials in `.env` are required for this feature to work correctly.

---

## ⚠️ Important Notes

- Do **not** commit `.env` or any secrets to GitHub.
- Always restart the backend after updating `.env`.
- Ensure your IP/network can access MongoDB Atlas.
- All accident images are generated from video frames, not from external/random images.

---

## 🧠 Viva / Evaluation One-Line Explanation

> "Accident images are generated by extracting frames from uploaded videos when an accident is detected, ensuring that each image corresponds to a real incident rather than external or random sources."

This sentence is ideal to use during viva/OR evaluation to explain how images are obtained.

---

## 🚀 Future Enhancements

- Real-time CCTV accident detection.
- SMS / WhatsApp alert integration.
- Routing to multiple rescue teams based on location.
- Admin dashboard for traffic authorities and control rooms.
- Confidence score visualization for each detection on the dashboard.

---

## 👤 Credits & Note

- Initial project structure was obtained in an early-stage form.
- Major backend, frontend, database, ML, and alert system improvements were implemented later to make the current version **stable, demo-ready, and suitable for academic evaluation**.
