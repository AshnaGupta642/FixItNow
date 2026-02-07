const API_BASE = "http://localhost:5000/api/admin";

/* ================== LOAD DASHBOARD ================== */
document.addEventListener("DOMContentLoaded", () => {
  loadStats();
  loadReports();
});

/* ================== STATS ================== */
async function loadStats() {
  try {
    const res = await fetch(`${API_BASE}/stats`);
    const data = await res.json();

    const statEls = document.querySelectorAll(".stat h2");

    statEls[0].innerHTML = `${data.total}`;
    statEls[1].innerHTML = `${data.highPriority}`;
    statEls[2].innerHTML = `${data.resolvedToday}`;
  } catch (err) {
    console.error("Stats fetch error:", err);
  }
}

/* ================== REPORT TABLE ================== */
async function loadReports() {
  try {
    const res = await fetch(`${API_BASE}/reports`);
    const reports = await res.json();

    const tbody = document.querySelector("table tbody");
    tbody.innerHTML = ""; // 🔥 REMOVE FAKE DATA

    reports.forEach(report => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td class="issue">
          <img src="${report.imageUrl || 'https://via.placeholder.com/40'}">
          <div>
            <strong>${report.title}</strong>
            <small>ID: ${report._id}</small>
          </div>
        </td>

        <td>${report.address}</td>

        <td>
          <span class="tag ${priorityClass(report.priority)}">
            ${report.priority}
          </span>
        </td>

        <td>${report.status}</td>

        <td>${timeAgo(report.createdAt)}</td>

        <td>
          <button onclick="assignReport('${report._id}')">
            ${report.status === "Unassigned" ? "Assign" : "Update"}
          </button>
        </td>
      `;

      tbody.appendChild(tr);
    });

  } catch (err) {
    console.error("Reports fetch error:", err);
  }
}

/* ================== HELPERS ================== */
function priorityClass(priority) {
  if (priority === "CRITICAL") return "critical";
  if (priority === "HIGH") return "high";
  return "medium";
}

function timeAgo(date) {
  const diff = Math.floor((Date.now() - new Date(date)) / 60000);
  if (diff < 60) return `${diff} mins ago`;
  return `${Math.floor(diff / 60)} hours ago`;
}

/* ================== ACTION ================== */
function assignReport(id) {
  alert("Assign clicked for report: " + id);
  // yahan backend PATCH call ja sakti hai
}
