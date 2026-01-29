from ultralytics import YOLO
import cv2
import math
import cvzone
import os

def calculate_iou(box1, box2):
    xA = max(box1[0], box2[0])
    yA = max(box1[1], box2[1])
    xB = min(box1[2], box2[2])
    yB = min(box1[3], box2[3])

    interArea = max(0, xB - xA) * max(0, yB - yA)
    box1Area = (box1[2] - box1[0]) * (box1[3] - box1[1])
    box2Area = (box2[2] - box2[0]) * (box2[3] - box2[1])

    if box1Area + box2Area - interArea == 0:
        return 0

    return interArea / float(box1Area + box2Area - interArea)


def detect_object_on_video(video_path):
    video_capture = video_path
    cap = cv2.VideoCapture(video_capture)
    frame_width = int(cap.get(3))
    frame_height = int(cap.get(4))

    model = YOLO('./models/yolov8n.pt')
    classNames = ["person", "bicycle", "car", "motorbike", "aeroplane", "bus", "train", "truck", "boat",
                  "traffic light", "fire hydrant", "stop sign", "parking meter", "bench", "bird", "cat",
                  "dog", "horse", "sheep", "cow", "elephant", "bear", "zebra", "giraffe", "backpack", "umbrella",
                  "handbag", "tie", "suitcase", "frisbee", "skis", "snowboard", "sports ball", "kite", "baseball bat",
                  "baseball glove", "skateboard", "surfboard", "tennis racket", "bottle", "wine glass", "cup",
                  "fork", "knife", "spoon", "bowl", "banana", "apple", "sandwich", "orange", "broccoli",
                  "carrot", "hot dog", "pizza", "donut", "cake", "chair", "sofa", "pottedplant", "bed",
                  "diningtable", "toilet", "tvmonitor", "laptop", "mouse", "remote", "keyboard", "cell phone",
                  "microwave", "oven", "toaster", "sink", "refrigerator", "book", "clock", "vase", "scissors",
                  "teddy bear", "hair drier", "toothbrush"
                  ]
    while True:
        sucess, img = cap.read()
        if not sucess:
            break
        results = model(img,stream=True)
        for r in results:
            boxes = r.boxes
            for box in boxes:
                x1, y1, x2, y2 = box.xyxy[0]
                x1, y1, x2, y2 = int(x1), int(y1), int(x2), int(y2)
                w, h = x2 - x1, y2 - y1

                conf = math.ceil((box.conf[0] * 100)) / 100
                cls = int(box.cls[0])
                label = classNames[cls].upper()
                cvzone.cornerRect(img, (x1, y1, w, h))
                cvzone.putTextRect(img, f'{label} {conf}', (max(0, x1), max(35, y1)), colorR=(0,165,255))
        yield img

cv2.destroyAllWindows()


def analyze_video_for_accident(video_path, max_frames=150):
    cap = cv2.VideoCapture(video_path)
    model = YOLO("./models/yolov8n.pt")

    vehicle_classes = ["car", "truck", "bus", "motorbike"]

    accident_frames = 0
    max_confidence = 0
    frame_count = 0

    best_frame = None  # ✅ FIX: initialize here

    while cap.isOpened() and frame_count < max_frames:
        success, frame = cap.read()
        if not success:
            break

        results = model(frame)
        vehicles = []

        for r in results:
            for box in r.boxes:
                cls = int(box.cls[0])
                label = model.names[cls]
                conf = float(box.conf[0])

                if label in vehicle_classes:
                    x1, y1, x2, y2 = map(int, box.xyxy[0])
                    vehicles.append((x1, y1, x2, y2, conf))
                    max_confidence = max(max_confidence, conf)

        # Check overlap (collision-like)
        collision_detected = False
        for i in range(len(vehicles)):
            for j in range(i + 1, len(vehicles)):
                iou = calculate_iou(vehicles[i][:4], vehicles[j][:4])
                if iou > 0.15:
                    collision_detected = True
                    break

        if collision_detected:
            accident_frames += 1

            # Save first strong collision frame
            if best_frame is None:
                best_frame = frame.copy()

        frame_count += 1

    cap.release()

    # -----------------------------
    # FINAL DECISION
    # -----------------------------
    if accident_frames >= 5:
        severity_percent = int(max_confidence * 100)

        severity = "High" if accident_frames >= 10 else "Medium"

        return {
            "result": "Accident",
            "severity": severity,
            "severityInPercentage": severity_percent,
            "frame": best_frame,  # may be None, safely handled
        }

    return {
        "result": "No Accident",
        "severity": "Low",
        "severityInPercentage": int(max_confidence * 100),
        "frame": None,  # ✅ explicit
    }

