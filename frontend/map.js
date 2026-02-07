// ================= MAP INITIALIZATION =================
const map = L.map("map").setView([28.6139, 77.2090], 11); // Default: Delhi

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap"
}).addTo(map);

// Layer group for markers
let markersLayer = L.layerGroup().addTo(map);

// ================= FETCH REAL DATA FROM BACKEND =================
async function loadMapReports() {
  try {
    const response = await fetch("http://localhost:5000/api/reports/map-reports");
    const reports = await response.json();

    // Clear old markers (NO FAKE DATA)
    markersLayer.clearLayers();

    reports.forEach(report => {
      // Safety check
      if (!report.latitude || !report.longitude) return;

      const marker = L.marker([report.latitude, report.longitude]);

      marker.bindPopup(`
        <div style="font-size:14px">
          <b>Category:</b> ${report.category}<br>
          <b>Status:</b> ${report.status}<br>
          <b>Pincode:</b> ${report.pincode}<br>
          <b>Description:</b> ${report.description}
        </div>
      `);

      marker.addTo(markersLayer);
    });

  } catch (error) {
    console.error("Map data fetch error:", error);
  }
}

// ================= INITIAL LOAD =================
loadMapReports();

// ================= UPDATE MAP BUTTON =================
const updateBtn = document.querySelector(".update");
if (updateBtn) {
  updateBtn.addEventListener("click", () => {
    loadMapReports();
  });
}
