const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema(
  {
    workerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    employerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    score: {
      type: Number,
      required: [true, "Rating score is required"],
      min: 1,
      max: 5,
    },
    review: {
      type: String,
      trim: true,
      default: "",
      maxlength: 500,
    },
  },
  { timestamps: true }
);

// One employer can only rate a worker once
ratingSchema.index({ workerId: 1, employerId: 1 }, { unique: true });
ratingSchema.index({ workerId: 1 });

module.exports = mongoose.model("Rating", ratingSchema);
