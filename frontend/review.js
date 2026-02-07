// ==========================
// CONFIG
// ==========================
const API_BASE = "http://localhost:5000/api";

// reportId normally URL se aata hai
const REPORT_ID = "CN-8902";

// ==========================
// PAGE LOAD
// ==========================
document.addEventListener("DOMContentLoaded", () => {
  fetchReviewData();

  document.querySelector(".submit").addEventListener("click", submitReport);
  document.querySelector(".draft").addEventListener("click", saveDraft);
});

// ==========================
// FETCH REVIEW DATA
// ==========================
async function fetchReviewData() {
  try {
    const res = await fetch(`${API_BASE}/reports/${REPORT_ID}`);
    const report = await res.json();

    fillReviewUI(report);
  } catch (err) {
    console.error(err);
    alert("Failed to load report");
  }
}

// ==========================
// FILL UI
// ==========================
function fillReviewUI(report) {
  // Image
  document.querySelector(".image-card img").src = report.image;

  // Category
  document.querySelector(".info-box").innerHTML = `
    ${report.category}<br>
    <small>${report.confidence}% confidence matching</small>
  `;

  // Priority
  document.querySelector(".high").innerText =
    `⚠ ${report.priority} Priority`;

  // Location Map
  document.querySelector("iframe").src =
    `https://maps.google.com/maps?q=${report.location.lat},${report.location.lng}&z=14&output=embed`;

  document.querySelector(".address").innerText =
    `📍 ${report.location.address}`;
}

// ==========================
// SUBMIT COMPLAINT
// ==========================
async function submitReport() {
  const extraNote =
    document.querySelector("textarea").value;

  try {
    const res = await fetch(`${API_BASE}/reports/submit/${REPORT_ID}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ note: extraNote })
    });

    const data = await res.json();
    alert("Complaint Submitted Successfully ✅");

  } catch (err) {
    alert("Submit failed ❌");
  }
}

// ==========================
// SAVE AS DRAFT
// ==========================
async function saveDraft() {
  const note =
    document.querySelector("textarea").value;

  try {
    await fetch(`${API_BASE}/reports/draft/${REPORT_ID}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ note })
    });

    alert("Saved as Draft 💾");

  } catch (err) {
    alert("Draft save failed ❌");
  }
}
