const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
      required: false,
    },

    issueType: {
      type: String,
      enum: ["garbage", "pothole", "streetlight", "water"],
      required: true,
    },

    location: {
      latitude: Number,
      longitude: Number,
    },

    address: {
      street: String,
      ward: String,
      city: String,
    },

    priority: {
      type: String,
      enum: ["HIGH", "MEDIUM", "LOW"],
      default: "LOW",
    },

    status: {
      type: String,
      enum: ["Submitted", "In-Progress", "Resolved"],
      default: "Submitted",
    },

    department: {
      type: String,
    },

    upvotes: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Issue", issueSchema);
