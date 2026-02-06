from ultralytics import YOLO
import cv2

# Load POTHOLE trained model (IMPORTANT)
model = YOLO("models/best.pt")

# Read image
image_path = "samples/test.jpg"
img = cv2.imread(image_path)

# Run detection
results = model(img)

detected_issue = "unknown"

# Check detections
if results[0].boxes and len(results[0].boxes) > 0:
    detected_issue = "pothole"

    for box in results[0].boxes:
        x1, y1, x2, y2 = map(int, box.xyxy[0])
        cv2.rectangle(img, (x1, y1), (x2, y2), (0,255,0), 2)
        cv2.putText(
            img,
            detected_issue,
            (x1, y1 - 10),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.9,
            (0, 255, 0),
            2
        )

print("Detected Issue:", detected_issue)

cv2.imshow("FixItNow AI Detection", img)
cv2.waitKey(0)
cv2.destroyAllWindows()
