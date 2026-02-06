const Issue = require("../models/Issue");
const checkDuplicate = require("../services/duplicateService");

const cloudinary = require("../config/cloudinary");
const fs = require("fs");

/**
 * Auto department routing based on issue type
 */
const getDepartment = (issueType) => {
  const map = {
    garbage: "Sanitation",
    pothole: "Roads",
    streetlight: "Electricity",
    water: "Water Supply",
  };
  return map[issueType] || "General";
};

exports.createIssue = async (req, res) => {
  try {
    // 1️⃣ Upload image to Cloudinary
    let imageUrl = "";
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      imageUrl = result.secure_url;
      fs.unlinkSync(req.file.path); // delete temp file
    }

    // 2️⃣ Extract data from request
    const {
      issueType,
      latitude,
      longitude,
      street,
      ward,
      city,
      priority,
    } = req.body;

    // 3️⃣ Create issue document
    const duplicate = await checkDuplicate(
  req.body.issueType,
  req.body.latitude,
  req.body.longitude
);

if (duplicate) {
  duplicate.upvotes += 1;
  await duplicate.save();

  return res.status(200).json({
    success: true,
    message: "Issue already reported. Priority strengthened.",
    issue: duplicate,
  });
}

    const issue = await Issue.create({
      imageUrl,
      issueType,
      location: {
        latitude,
        longitude,
      },
      address: {
        street,
        ward,
        city,
      },
      priority: priority || "HIGH",
      status: "Submitted",
      department: getDepartment(issueType),
    });

    // 4️⃣ Response
    res.status(201).json({
      success: true,
      message: "Issue created successfully",
      issue,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
