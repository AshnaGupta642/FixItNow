const calculatePriority = (issueType, upvotes = 1) => {
  if (issueType === "water") return "HIGH";
  if (issueType === "pothole" && upvotes >= 3) return "HIGH";
  if (issueType === "garbage") return "MEDIUM";
  return "LOW";
};

module.exports = calculatePriority;
