const Issue = require("../models/Issue");

const checkDuplicate = async (issueType, latitude, longitude) => {
  // Convert to numbers
  const lat = parseFloat(latitude);
  const lon = parseFloat(longitude);

  if (isNaN(lat) || isNaN(lon)) {
    throw new Error("Invalid latitude or longitude");
  }

  // Check for nearby unresolved issues
  const nearbyIssue = await Issue.findOne({
    issueType,
    "location.latitude": { $gte: lat - 0.001, $lte: lat + 0.001 },
    "location.longitude": { $gte: lon - 0.001, $lte: lon + 0.001 },
    status: { $ne: "Resolved" },
  });

  return nearbyIssue;
};

module.exports = checkDuplicate;
