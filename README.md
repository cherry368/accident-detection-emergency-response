Here's the complete, professional README.md file content for your Accident Detection and Emergency Response System project. You can copy this and replace your current README:

```markdown
# 🚨 Accident Detection and Emergency Response System

A **CNN / YOLO-based Accident Detection System** that analyzes uploaded videos or live feeds to detect road accidents in real-time and automatically notify rescue teams via email.  
The system includes an interactive dashboard with comprehensive analytics, accident history, and detailed incident views—ideal for academic demonstrations, research prototypes, and smart-city safety applications.

> **Repository:** https://github.com/cherry368/accident-detection-emergency-response

---

## 📋 Table of Contents

- [Overview](#overview)
- [Project Background](#project-background)
- [Key Features](#key-features)
- [Major Improvements](#major-improvements)
- [System Architecture](#system-architecture)
- [Image Generation & Storage](#image-generation--storage)
- [Database Schema](#database-schema)
- [Getting Started](#getting-started)
  - [Clone Repository](#clone-repository)
  - [Project Structure](#project-structure)
  - [Prerequisites](#prerequisites)
  - [Environment Configuration](#environment-configuration)
  - [Installation & Setup](#installation--setup)
- [Running the Project](#running-the-project)
- [Features Guide](#features-guide)
- [Important Notes](#important-notes)
- [Viva Explanation](#viva--evaluation-explanation)
- [Future Enhancements](#future-enhancements)
- [Credits](#credits)

---

## 📖 Overview

This accident detection system leverages deep learning (YOLOv8) to detect road accidents from video feeds and provides instant notifications to rescue teams. The system is built with a modern tech stack including Next.js for the frontend dashboard, Flask for the backend API, and MongoDB Atlas for data persistence.

**Live Features:**
- 🎥 Video upload and frame-by-frame analysis
- 🤖 Real-time accident detection with YOLOv8
- 📧 Automated email alerts to rescue teams
- 📊 Interactive analytics dashboard
- 🗺️ Geolocation mapping of incidents
- 🖼️ Accident image snapshots from video frames

---

## 📘 Project Background

This project was initially collected from a friend in an early-stage form and later **significantly enhanced, fixed, and extended** with production-grade implementations.

**What was improved:**
- Complete backend redesign and API standardization
- Frontend dashboard with live data integration
- MongoDB Atlas integration with proper schema design
- Email alert system with Flask-Mail
- Robust error handling and code stability
- Academic-ready documentation and demo materials

All major systems were implemented and stabilized afterward to create a **stable, demo-ready, and academically suitable** version.

---

## ✨ Key Features

✅ **Real-time Accident Detection** — YOLOv8-based video analysis  
✅ **Automated Email Alerts** — Instant notifications to rescue teams  
✅ **Interactive Dashboard** — Analytics, tables, maps, and drill-down views  
✅ **Geolocation Support** — Latitude/longitude mapping with Google Maps integration  
✅ **Image Snapshots** — Auto-generated from accident video frames  
✅ **Color-coded Severity** — Quick visual risk assessment (High/Medium/Low)  
✅ **Scalable Backend** — MongoDB Atlas cloud database  
✅ **Modern Frontend** — Next.js with React components  

---

## 🎯 Major Improvements

### ✅ Backend (Flask)

- Integrated **MongoDB Atlas** (replaced local MongoDB) with standardized accident data schema
- Fixed date aggregation issues for accurate dashboard analytics
- Implemented robust REST APIs:
  - `POST /api/v1/accident/create` — Create and store a new accident record
  - `GET /api/v1/accident/all` — Fetch all recorded accidents
  - `GET /api/v1/accident/summary` — Return summary and aggregated analytics
  - `GET /api/v1/accident/<id>` — Fetch a single accident by ID
- Implemented **Quick Email Alert System** using Flask-Mail for instant rescue team notifications
- Resolved circular imports via shared extensions pattern (better code organization)
- Added comprehensive error handling and improved overall stability

### ✅ Frontend (Next.js)

- Dashboard redesigned for clarity and academic evaluation readiness
- Monthly accident overview chart (powered by backend aggregation)
- "All Accidents" table fully connected to live backend APIs (no mock data)
- Color-coded severity indicators: **High / Medium / Low** for quick risk assessment
- Single Accident Details page with:
  - Detailed incident metadata
  - Interactive map view using coordinates
  - Accident image preview from video snapshots
  - Quick Mail button to trigger rescue notifications
- Removed all dummy data and polished UI/UX for smooth demos

### ✅ ML / Video Processing

- **YOLOv8** integrated for advanced object detection and accident inference
- Video frame-by-frame processing pipeline
- Detection results automatically persisted to MongoDB
- Code architecture prepared for future **real-time CCTV/IP camera inference**

---

## 🧱 System Architecture

```
┌─────────────────────────┐
│  Frontend (Next.js)     │  Interactive Dashboard
│  - Analytics Charts     │  - Accident Tables
│  - Google Maps          │  - Drill-down Details
└────────────┬────────────┘
             │
             ↓
┌─────────────────────────┐
│  Backend (Flask)        │  REST API Server
│  - API Endpoints        │  - Business Logic
│  - Email Service        │  - Video Processing
└────────────┬────────────┘
             │
             ↓
┌─────────────────────────┐
│  MongoDB Atlas          │  Cloud Database
│  - accident_results     │  - Image URLs
│  - Metadata & Analytics │  - Timestamps
└─────────────────────────┘
             │
             ↓
┌─────────────────────────┐
│  Gmail SMTP             │  Email Alerts
│  - Rescue Teams         │  - Severity & Location
│  - Map Links            │  - Incident Images
└─────────────────────────┘
```

---

## 🖼️ Accident Image Generation & Storage

### How Images Are Generated

When a video is uploaded, the YOLO-based accident detection model processes it frame-by-frame:

1. **Frame Extraction** — Relevant frame captured when accident is detected
2. **Object Detection** — Bounding boxes drawn around detected vehicles/objects
3. **Snapshot Creation** — Processed frame saved as accident snapshot
4. **Verification** — Images stored **only for accident-positive videos**

### Storage Logic

- Images generated **directly from uploaded accident videos**
- Stored externally (Cloudinary or configured cloud storage)
- MongoDB stores image URL reference in `image_url` field
- **No images fetched from external/random sources**
- **No image stored if no accident detected**

### Image Usage

- Displayed in Single Accident Details page
- Included in email alerts to rescue teams
- Each image corresponds to a **real incident frame**

---

## 🗂️ Database Schema

**Collection:** `accident_results`

```json
{
  "_id": "ObjectId",
  "address": "MG Road, Bangalore",
  "city": "Bangalore",
  "latitude": 12.9716,
  "longitude": 77.5946,
  "severity": "High",
  "severityInPercentage": 65,
  "image_url": "https://cloudinary.com/generated_frame.jpg",
  "video_name": "traffic_incident_001.mp4",
  "date": "2024-03-02T23:23:47.000Z",
  "confidence": 0.92
}
```

**Key Fields:**
- `date` — ISO 8601 format for proper aggregation
- `severity` — High / Medium / Low classification
- `severityInPercentage` — Numeric confidence score
- `image_url` — Reference to stored snapshot
- `latitude/longitude` — For map integration

---

## 🚀 Getting Started

### Clone Repository

Get the code to your local machine:

```bash
git clone https://github.com/cherry368/accident-detection-emergency-response.git
cd accident-detection-emergency-response
```

### Project Structure

```
accident-detection-emergency-response/
│
├── client/                           # Next.js Frontend Dashboard
│   ├── app/                          # Next.js App Router
│   ├── components/                   # React Components
│   │   ├── Dashboard.jsx
│   │   ├── AccidentTable.jsx
│   │   ├── AccidentDetails.jsx
│   │   └── MapView.jsx
│   ├── lib/                          # Utilities & API calls
│   ├── public/                       # Static assets
│   ├── package.json
│   ├── next.config.js
│   └── tsconfig.json
│
├── server/                           # Flask Backend
│   ├── app.py                        # Main Flask application
│   ├── routes/                       # API endpoints
│   │   └── accident_routes.py
│   ├── models/                       # Database models
│   │   └── accident_model.py
│   ├── services/                     # Business logic
│   │   ├── yolo_service.py
│   │   └── email_service.py
│   ├── requirements.txt              # Python dependencies
│   ├── .env.example                  # Environment template
│   └── config.py
│
├── README.md                         # This file
├── .gitignore
└── LICENSE
```

### Prerequisites

Ensure you have installed:

- **Python 3.9+** — Backend runtime
- **Node.js 16+** — Frontend runtime
- **Git** — Version control
- **MongoDB Atlas Account** — Cloud database (free tier available)
- **Gmail Account** — For email alerts (create App Password)

### Environment Configuration

Create `server/.env` with your credentials:

```env
# MongoDB Atlas
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/accident_detection

# JWT Security
JWT_SECRET_KEY=your_secure_secret_key_here

# Gmail SMTP (Create App Password from account settings)
EMAIL=your-email@gmail.com
PASSWORD=your_gmail_app_password
SENDTO=rescue_team@email.com

# Cloudinary (Optional, for image storage)
CLOUD_NAME=your_cloudinary_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret

# Server Configuration
FLASK_ENV=development
PORT=8080
```

⚠️ **Important:** Use Gmail App Password, NOT your regular login password. Generate one from [Google Account Security](https://myaccount.google.com/apppasswords)

### Installation & Setup

#### Backend Setup

```bash
# Navigate to backend directory
cd server

# Create Python virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Verify installation
python -c "import flask, pymongo, torch; print('✓ All dependencies installed')"
```

#### Frontend Setup

```bash
# Navigate to frontend directory
cd client

# Install dependencies
npm install

# Verify installation
npm list next react

# Build for production (optional)
npm run build
```

---

## ▶️ Running the Project

### Start Backend Server

```bash
cd server

# Activate virtual environment (if not already activated)
source venv/bin/activate  # Mac/Linux
# or
venv\Scripts\activate     # Windows

# Start Flask server
python app.py
```

**Expected output:**
```
 * Running on http://127.0.0.1:8080
 * WARNING: This is a development server. Do not use in production.
```

### Start Frontend Server

In a **new terminal/command prompt**:

```bash
cd client

# Start development server
npm run dev
```

**Expected output:**
```
> Local:        http://localhost:3000
> Ready in 1234ms
```

### Access the Application

Open your browser and navigate to:

- **Frontend Dashboard:** http://localhost:3000
- **Backend API:** http://127.0.0.1:8080/api/v1/accident/all
- **API Documentation:** Check Flask routes in `server/app.py`

---

## 📋 Features Guide

### 1. Upload Accident Video

1. Navigate to Dashboard → Upload section
2. Select a video file (MP4, AVI, MOV)
3. System analyzes frames with YOLOv8
4. If accident detected → Image snapshot saved, record created

### 2. View Accidents

1. Go to "All Accidents" table
2. See severity color-coded (Red=High, Yellow=Medium, Green=Low)
3. Click row to view detailed incident page

### 3. Accident Details Page

- **Metadata:** Address, city, timestamp, severity
- **Map View:** Interactive map pinpointing incident location
- **Snapshot:** Frame extracted from accident video
- **Quick Mail:** Send alert email to rescue teams

### 4. Analytics Dashboard

- **Monthly Chart:** Accident trends over time
- **Summary Stats:** Total incidents, severity breakdown
- **Filter & Search:** Find specific incidents by location/date

### 5. Email Alerts

- **Triggered By:** Quick Mail button or new accident detected
- **Contents:** Severity, address, coordinates, Google Maps link
- **Recipients:** Configured in `.env` (SENDTO)

---

## ⚠️ Important Notes

### Do's ✅

- ✅ Store `.env` safely — Never commit to Git
- ✅ Restart backend after `.env` changes
- ✅ Use Gmail App Password for SMTP
- ✅ Whitelist your IP in MongoDB Atlas
- ✅ Test email alerts in development first
- ✅ Keep dependencies updated (`pip install --upgrade -r requirements.txt`)

### Don'ts ❌

- ❌ Don't commit `.env` or secrets to GitHub
- ❌ Don't use regular Gmail password (use App Password)
- ❌ Don't expose API keys in frontend code
- ❌ Don't skip MongoDB Atlas IP whitelist configuration
- ❌ Don't run production without environment variables

### Troubleshooting

| Issue | Solution |
|-------|----------|
| MongoDB connection fails | Check MONGO_URI in `.env`, verify IP whitelist in Atlas |
| Email not sending | Verify Gmail App Password, check SENDTO email is valid |
| CORS errors | Ensure backend is running, check allowed origins in Flask |
| Video upload fails | Check file size, supported format (MP4/AVI), disk space |
| Port already in use | Change PORT in `.env` or kill process using port 8080 |

---

## 🧠 Viva / Evaluation Explanation

**Perfect answer to explain accident image generation:**

> "Accident images in this system are generated by extracting frames from uploaded videos at the moment an accident is detected by the YOLO machine learning model. The system processes the video frame-by-frame, identifies accidents using object detection, extracts the relevant frame, and saves it as a snapshot. This ensures that **each image corresponds to a real incident frame from the user's uploaded video, rather than being fetched from external or random sources**. This approach maintains data authenticity and ensures every image has a real incident context."

---

## 🚀 Future Enhancements

- **Real-time CCTV Integration** — Connect to IP cameras for live monitoring
- **SMS / WhatsApp Alerts** — Multi-channel emergency notifications
- **Intelligent Routing** — Route alerts to nearest rescue teams
- **Authority Dashboard** — Admin panel for traffic management centers
- **Confidence Visualization** — Show detection confidence scores
- **Multi-language Support** — Internationalization for different regions
- **Mobile App** — iOS/Android companion application
- **Advanced Analytics** — Accident hotspot identification and patterns

---

## 📞 Support & Contact

For issues, questions, or contributions:

- **Repository:** https://github.com/cherry368/accident-detection-
