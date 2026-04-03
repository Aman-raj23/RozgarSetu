const express = require("express");
const router = express.Router();
const {
  createJob,
  getAllJobs,
  getNearbyJobs,
  getJobById,
  updateJob,
  deleteJob,
} = require("../controllers/jobController");
const auth = require("../middleware/auth");

// Public routes
router.get("/", getAllJobs);
router.get("/nearby", getNearbyJobs);
router.get("/:id", getJobById);

// Protected routes (require authentication)
router.post("/", auth, createJob);
router.put("/:id", auth, updateJob);
router.delete("/:id", auth, deleteJob);

module.exports = router;
