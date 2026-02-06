const Issue = require("../models/Issue");

// 🔹 Get all issues (sorted by priority + time)
exports.getAllIssues = async (req, res) => {
  try {
    const { priority, department, status } = req.query;

    let filter = {};
    if (priority) filter.priority = priority;
    if (department) filter.department = department;
    if (status) filter.status = status;

    const issues = await Issue.find(filter).sort({
      priority: 1,        // HIGH first
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: issues.length,
      issues,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 🔹 Update issue status (Submitted → In-Progress → Resolved)
exports.updateIssueStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({
        success: false,
        message: "Issue not found",
      });
    }

    issue.status = status;
    await issue.save();

    res.status(200).json({
      success: true,
      message: "Issue status updated successfully",
      issue,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
