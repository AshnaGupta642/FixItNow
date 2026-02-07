import torch
from torchvision import datasets, transforms, models
from torch.utils.data import DataLoader

CLASSES = ['pothole', 'roadcrack', 'streetlight', 'waterleak']

# Dataset path: ai/data/train/pothole, roadcrack, waterleak
transform = transforms.Compose([
    transforms.Resize((224,224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485,0.456,0.406],[0.229,0.224,0.225])
])

train_dataset = datasets.ImageFolder('data/train', transform=transform)
train_loader = DataLoader(train_dataset, batch_size=16, shuffle=True)

model = models.resnet18(pretrained=True)
model.fc = torch.nn.Linear(model.fc.in_features, len(CLASSES))

criterion = torch.nn.CrossEntropyLoss()
optimizer = torch.optim.Adam(model.parameters(), lr=0.0001)

# Simple training loop
for epoch in range(5):
    for imgs, labels in train_loader:
        optimizer.zero_grad()
        outputs = model(imgs)
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()
    print(f"Epoch {epoch+1} done")

# Save model
torch.save(model.state_dict(), 'model/model.pth')
print("Model saved!")
