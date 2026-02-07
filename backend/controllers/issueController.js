// const Issue = require("../models/Issue");
// const checkDuplicate = require("../services/duplicateService");

// const cloudinary = require("../config/cloudinary");
// const fs = require("fs");

// /**
//  * Auto department routing based on issue type
//  */
// const getDepartment = (issueType) => {
//   const map = {
//     garbage: "Sanitation",
//     pothole: "Roads",
//     streetlight: "Electricity",
//     water: "Water Supply",
//   };
//   return map[issueType] || "General";
// };

// exports.createIssue = async (req, res) => {
//   try {
//     // 1️⃣ Upload image to Cloudinary
//     let imageUrl = "";
//     if (req.file) {
//       const result = await cloudinary.uploader.upload(req.file.path);
//       imageUrl = result.secure_url;
//       fs.unlinkSync(req.file.path); // delete temp file
//     }

//     // 2️⃣ Extract data from request
//     const {
//       issueType,
//       latitude,
//       longitude,
//       street,
//       ward,
//       city,
//       priority,
//     } = req.body;

//     // 3️⃣ Create issue document
//     const duplicate = await checkDuplicate(
//   req.body.issueType,
//   req.body.latitude,
//   req.body.longitude
// );

// if (duplicate) {
//   duplicate.upvotes += 1;
//   await duplicate.save();

//   return res.status(200).json({
//     success: true,
//     message: "Issue already reported. Priority strengthened.",
//     issue: duplicate,
//   });
// }

//     const issue = await Issue.create({
//       imageUrl,
//       issueType,
//       location: {
//         latitude,
//         longitude,
//       },
//       address: {
//         street,
//         ward,
//         city,
//       },
//       priority: priority || "HIGH",
//       status: "Submitted",
//       department: getDepartment(issueType),
//     });

//     // 4️⃣ Response
//     res.status(201).json({
//       success: true,
//       message: "Issue created successfully",
//       issue,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

const Issue = require("../models/Issue");
const checkDuplicate = require("../services/duplicateService");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");
const detectIssue = require("../ai/detectIssue"); // Node wrapper for Python ML

// Map issue type to department
const getDepartment = (issueType) => {
  const map = {
    pothole: "Roads",
    streetlight: "Electricity",
    waterleak: "Water Supply",
    roadcrack: "Roads",
    garbage: "Sanitation",
  };
  return map[issueType] || "General";
};

exports.createIssue = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No image uploaded" });
    }

    const localPath = req.file.path;

    // 1️⃣ Predict issue type using ML model
    let predictedType = "";
    try {
      predictedType = await detectIssue(localPath);
      console.log("Predicted Type:", predictedType);
    } catch (err) {
      console.error("ML prediction failed:", err);
      return res.status(500).json({ success: false, message: "ML prediction failed" });
    }

    // 2️⃣ Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(localPath);
    const imageUrl = result.secure_url;

    // 3️⃣ Delete local temp file
    fs.unlinkSync(localPath);

    // 4️⃣ Extract other data
    const { latitude, longitude, street, ward, city, priority } = req.body;

    // 5️⃣ Check for duplicate
    const duplicate = await checkDuplicate(predictedType, latitude, longitude);
    if (duplicate) {
      duplicate.upvotes += 1;
      await duplicate.save();
      return res.status(200).json({
        success: true,
        message: "Issue already reported. Priority strengthened.",
        issue: duplicate,
      });
    }

    // 6️⃣ Create new issue
    const issue = await Issue.create({
      imageUrl,
      issueType: predictedType,
      location: { latitude, longitude },
      address: { street, ward, city },
      priority: priority || "HIGH",
      status: "Submitted",
      department: getDepartment(predictedType),
    });

    res.status(201).json({
      success: true,
      message: "Issue created successfully",
      issue,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
