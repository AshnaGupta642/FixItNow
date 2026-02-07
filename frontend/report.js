// ==========================
// CONFIG
// ==========================
const API_URL = "http://localhost:5000/api/reports/CN-8902"; 
// ↑ backend route (example)

// ==========================
// ON PAGE LOAD
// ==========================
document.addEventListener("DOMContentLoaded", () => {
  fetchReport();
});

// ==========================
// FETCH REPORT FROM BACKEND
// ==========================
async function fetchReport() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();

    updateUI(data);
  } catch (err) {
    console.error("Error fetching report:", err);
    alert("Unable to load report data");
  }
}

// ==========================
// UPDATE UI WITH DATA
// ==========================
function updateUI(report) {

  // Title + Status
  document.querySelector("h1").innerHTML = `
    ${report.title}
    <span class="status">${report.status}</span>
  `;

  // Subtitle
  document.querySelector(".sub").innerText =
    `Submitted on ${formatDate(report.createdAt)} · ${report.category}`;

  // Timeline
  const timeline = document.querySelector(".timeline");
  timeline.innerHTML = "";

  report.timeline.forEach(step => {
    timeline.innerHTML += `
      <div class="step ${step.state}">
        <b>${step.label}</b>
        <span>${step.time}</span>
        <p>${step.note || ""}</p>
      </div>
    `;
  });

  // Officer Note
  const noteCard = document.querySelector(".note");
  noteCard.innerHTML = `
    <b>Officer ${report.officer.name}</b>
    <span class="time">${report.officer.updated}</span>
    <p>${report.officer.note}</p>
  `;

  // Evidence Image
  document.querySelector(".img").src = report.image;

  // Map
  document.querySelector("iframe").src =
    `https://maps.google.com/maps?q=${report.location.lat},${report.location.lng}&z=14&output=embed`;

  // Summary
  const summary = document.querySelector(".summary");
  summary.innerHTML = `
    <h3>Report Summary</h3>
    <div><span>Tracking ID</span><b>${report.trackingId}</b></div>
    <div><span>Priority</span><b>${report.priority}</b></div>
    <div><span>Estimated Fix</span><b>${report.eta}</b></div>
    <div><span>Views</span><b>${report.views} people</b></div>
    <button class="btn white">Share Update</button>
  `;
}

// ==========================
// HELPERS
// ==========================
function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toDateString();
}
