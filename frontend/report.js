// ================================
// CityConnect Frontend JS
// ================================

// Backend URL
const API_URL = "http://localhost:5000/api";

// Page load hote hi report fetch karo
document.addEventListener("DOMContentLoaded", () => {
  loadReport();
});

// Report details fetch
async function loadReport() {
  try {
    const res = await fetch(`${API_URL}/reports/CN-8902`);
    const data = await res.json();

    // Title + Status
    document.querySelector("h1").innerHTML = `
      ${data.title}
      <span class="status">${data.status}</span>
    `;

    // Subtitle
    document.querySelector(".sub").innerText =
      `Submitted on ${data.date} · ${data.category}`;

  } catch (err) {
    console.error("Backend not connected", err);
  }
}

// Add Update button
const addUpdateBtn = document.querySelector(".btn.primary");

if (addUpdateBtn) {
  addUpdateBtn.addEventListener("click", async () => {
    const message = prompt("Enter update");

    if (!message) return;

    await fetch(`${API_URL}/reports/update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        reportId: "CN-8902",
        message
      })
    });

    alert("Update sent to backend");
  });
}
