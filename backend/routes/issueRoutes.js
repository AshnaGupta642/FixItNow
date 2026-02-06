const express = require("express");
const { createIssue } = require("../controllers/issueController");
const Issue = require("../models/Issue");


const router = express.Router();
const upload = require("../config/multer");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");

router.post("/upload-test", upload.single("image"), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path);
    fs.unlinkSync(req.file.path); // delete temp file

    res.json({
      success: true,
      imageUrl: result.secure_url,
    });
  } catch (error) {
    res.status(500).json({ error: "Image upload failed" });
  }
});
router.post("/create",  upload.single("image"), createIssue);
router.get("/", async (req, res) => {
  try {
    const issues = await Issue.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      issues,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 🔹 Track single issue by ID
router.get("/:id", async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: "Issue not found",
      });
    }

    res.status(200).json({
      success: true,
      issue,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 🔹 Map / Heatmap data
router.get("/map/data", async (req, res) => {
  try {
    const issues = await Issue.find({}, {
      "location.latitude": 1,
      "location.longitude": 1,
      priority: 1,
      _id: 0,
    });

    res.status(200).json({
      success: true,
      data: issues,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;

