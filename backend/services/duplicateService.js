const Issue = require("../models/Issue");

const checkDuplicate = async (issueType, latitude, longitude) => {
  const nearbyIssue = await Issue.findOne({
    issueType,
    "location.latitude": { $gte: latitude - 0.001, $lte: latitude + 0.001 },
    "location.longitude": { $gte: longitude - 0.001, $lte: longitude + 0.001 },
    status: { $ne: "Resolved" },
  });

  return nearbyIssue;
};

module.exports = checkDuplicate;
