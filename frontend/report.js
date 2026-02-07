// report.js


// const fakeReport = {...}

const reportId = "CN-8902"; // abhi static, baad me URL se bhi le sakte ho

async function loadReport() {
  try {
    const res = await fetch(`http://localhost:5000/api/reports/${reportId}`);
    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Report not found");
      return;
    }

    // 🔹 HEADER
    document.querySelector("h1").innerHTML = `
      ${data.title}
      <span class="status">${data.status}</span>
    `;

    document.querySelector(".sub").innerText =
      `Submitted on ${new Date(data.createdAt).toDateString()} · ${data.category}`;

    // 🔹 TIMELINE
    const timeline = document.querySelector(".timeline");
    timeline.innerHTML = "";

    data.timeline.forEach(step => {
      timeline.innerHTML += `
        <div class="step ${step.state}">
          <b>${step.title}</b>
          <span>${step.time}</span>
          <p>${step.description}</p>
        </div>
      `;
    });

    // 🔹 IMAGE
    document.querySelector(".img").src = data.image;

    // 🔹 LOCATION
    document.querySelector(".small").innerText = "📍 " + data.address;

    // 🔹 SUMMARY
    const summary = document.querySelector(".summary");
    summary.innerHTML = `
      <h3>Report Summary</h3>
      <div><span>Tracking ID</span><b>${data.trackingId}</b></div>
      <div><span>Priority</span><b>${data.priority}</b></div>
      <div><span>Estimated Fix</span><b>${data.estimatedFix}</b></div>
      <div><span>Views</span><b>${data.views} people</b></div>
      <button class="btn white">Share Update</button>
    `;

  } catch (err) {
    console.error(err);
    alert("Backend not connected ❌");
  }
}

loadReport();
