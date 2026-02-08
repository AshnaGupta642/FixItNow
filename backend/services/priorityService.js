const calculatePriority = (issueType, userUrgency) => {
  const type = (issueType || "").toLowerCase();
  const urgency = (userUrgency || "MAINTENANCE").toUpperCase();

  // High Priority Triggers
  if (urgency === 'IMMEDIATE' || type === 'water' || type === 'structural_damage') {
    return "HIGH";
  }

  // Medium Priority Triggers
  if (urgency === 'MAINTENANCE' || type === 'pothole') {
    return "MEDIUM";
  }

  return "LOW";
};

module.exports = calculatePriority;