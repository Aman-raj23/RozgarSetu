const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Job description is required"],
      trim: true,
    },
    skills: {
      type: [String],
      required: [true, "At least one skill is required"],
      validate: {
        validator: (v) => v.length > 0,
        message: "At least one skill is required",
      },
    },
    salary: {
      type: Number,
      required: [true, "Salary is required"],
      min: [0, "Salary cannot be negative"],
    },
    salaryPeriod: {
      type: String,
      enum: ["day", "month", "annum"],
      default: "day",
    },
    location: {
      lat: {
        type: Number,
        required: [true, "Location latitude is required"],
      },
      lng: {
        type: Number,
        required: [true, "Location longitude is required"],
      },
    },
    employerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    isSuspicious: {
      type: Boolean,
      default: false,
    },
    suspiciousReasons: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

// Index for efficient geospatial-like queries
jobSchema.index({ "location.lat": 1, "location.lng": 1 });
jobSchema.index({ skills: 1 });
jobSchema.index({ employerId: 1 });

module.exports = mongoose.model("Job", jobSchema);
