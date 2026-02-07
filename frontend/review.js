// ================================
// ELEMENTS
// ================================
const retakeBtn = document.querySelector(".retake");
const submitBtn = document.querySelector(".submit");
const draftBtn = document.querySelector(".draft");
const imageEl = document.querySelector(".image-card img");
const textarea = document.querySelector("textarea");

const categoryBox = document.querySelector(".info-box");
const priorityBox = document.querySelector(".priority .high");
const addressEl = document.querySelector(".address");
const mapFrame = document.querySelector("iframe");

// hidden file input (gallery)
const fileInput = document.createElement("input");
fileInput.type = "file";
fileInput.accept = "image/*";
fileInput.style.display = "none";
document.body.appendChild(fileInput);

// ================================
// LOAD REAL DATA FROM BACKEND
// ================================
async function loadLatestReport() {
  try {
    const res = await fetch("http://localhost:5000/api/reports/latest");
    const data = await res.json();

    // IMAGE
    imageEl.src = data.imageUrl;

    // AI DETAILS
    categoryBox.innerHTML = `
      ${data.category}<br>
      <small>${data.confidence}% confidence</small>
    `;

    // PRIORITY
    priorityBox.textContent = data.priority + " Priority";

    // LOCATION
    addressEl.textContent = "📍 " + data.address;

    mapFrame.src = `https://maps.google.com/maps?q=${encodeURIComponent(
      data.address
    )}&z=14&output=embed`;

  } catch (err) {
    console.error("Failed to load report", err);
  }
}

loadLatestReport();

// ================================
// RETAKE → GALLERY IMAGE
// ================================
retakeBtn.addEventListener("click", () => {
  fileInput.click();
});

fileInput.addEventListener("change", async () => {
  const file = fileInput.files[0];
  if (!file) return;

  // show preview immediately
  const reader = new FileReader();
  reader.onload = () => (imageEl.src = reader.result);
  reader.readAsDataURL(file);

  // upload to backend
  const formData = new FormData();
  formData.append("image", file);

  try {
    const res = await fetch(
      "http://localhost:5000/api/reports/upload-image",
      {
        method: "POST",
        body: formData
      }
    );

    const data = await res.json();

    // update AI result after re-analysis
    categoryBox.innerHTML = `
      ${data.category}<br>
      <small>${data.confidence}% confidence</small>
    `;
    priorityBox.textContent = data.priority + " Priority";

  } catch (err) {
    alert("Image upload failed");
  }
});

// ================================
// FINAL SUBMIT → MONGODB
// ================================
submitBtn.addEventListener("click", async () => {
  try {
    const res = await fetch(
      "http://localhost:5000/api/reports/submit",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          additionalContext: textarea.value
        })
      }
    );

    const data = await res.json();

    alert("✅ Complaint submitted successfully!");
    window.location.href = "/dashboard.html";

  } catch (err) {
    alert("❌ Submission failed");
  }
});

// ================================
// SAVE AS DRAFT
// ================================
draftBtn.addEventListener("click", async () => {
  await fetch("http://localhost:5000/api/reports/draft", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      additionalContext: textarea.value
    })
  });

  alert("💾 Saved as draft");
});
