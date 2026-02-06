function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showMap, showError);
  } else {
    document.getElementById("map").innerText = "Geolocation not supported";
  }
}

function showMap(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;

  document.getElementById("map").innerHTML = `
    <iframe
      width="100%"
      height="100%"
      style="border:0"
      src="https://maps.google.com/maps?q=${lat},${lon}&z=15&output=embed">
    </iframe>
  `;
}

function showError() {
  document.getElementById("map").innerText = "Location permission denied";
}

getLocation();
