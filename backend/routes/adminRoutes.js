const express = require("express");
const { adminLogin } = require("../controllers/adminAuthController");
const Issue = require("../models/Issue"); 
const { getAllIssues, updateIssueStatus } = require("../controllers/adminController");
const adminAuth = require("../middleware/adminAuth");

const router = express.Router();

// Login
router.post("/login", adminLogin);

// Protected routes
router.get("/issues", adminAuth, getAllIssues);
router.patch("/update/:id", adminAuth, updateIssueStatus);
router.put("/issues/:id", adminAuth, async (req, res) => {
  try {
    const { status } = req.body;

    await Issue.findByIdAndUpdate(req.params.id, { status });

    res.json({ success: true });
  } catch (error) {
    console.error("Status update error:", error);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
