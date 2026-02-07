import torch
from torchvision import models, transforms
from PIL import Image
import os
import warnings

# Suppress all warnings (Torchvision warnings, etc.)
warnings.filterwarnings("ignore")

# Define your class labels
CLASSES = ['pothole', 'roadcrack', 'streetlight', 'waterleak']

# Load model
# Use absolute path relative to this script
model_path = os.path.join(os.path.dirname(__file__), "model", "model.pth")

model = models.resnet18(pretrained=False)  # your trained model architecture
model.fc = torch.nn.Linear(model.fc.in_features, len(CLASSES))

# Load trained weights
if not os.path.exists(model_path):
    raise FileNotFoundError(f"Model file not found at {model_path}")
model.load_state_dict(torch.load(model_path, map_location='cpu'))
model.eval()

# Preprocessing pipeline for input image
preprocess = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406],
                         [0.229, 0.224, 0.225])
])

# Prediction function
def predict_type(image_path):
    if not os.path.exists(image_path):
        raise FileNotFoundError(f"Image not found at {image_path}")
    
    img = Image.open(image_path).convert('RGB')
    img_tensor = preprocess(img).unsqueeze(0)  # add batch dimension
    
    with torch.no_grad():
        output = model(img_tensor)
        pred_idx = torch.argmax(output, dim=1).item()
    
    return CLASSES[pred_idx]

# Allow standalone Python testing
if __name__ == "__main__":
    import sys
    if len(sys.argv) < 2:
        print("Please provide image path as argument")
        sys.exit(1)
    
    image_path = sys.argv[1]
    print(predict_type(image_path))  # Node.js will read this
