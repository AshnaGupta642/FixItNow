const express = require("express");
const {
  getAllIssues,
  updateIssueStatus,
} = require("../controllers/adminController");

const router = express.Router();

// View all complaints (filters supported)
router.get("/issues", getAllIssues);

// Update issue status
router.patch("/update/:id", updateIssueStatus);

module.exports = router;
