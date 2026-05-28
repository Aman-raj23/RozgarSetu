const express = require("express");
const router = express.Router();
const {
  getWorkers,
  getWorkerById,
  hireWorker,
  rateWorker,
} = require("../controllers/workerController");
const auth = require("../middleware/auth");

// Public routes
router.get("/", getWorkers);
router.get("/:id", getWorkerById);

// Protected routes (require authentication)
router.post("/:id/hire", auth, hireWorker);
router.post("/:id/rate", auth, rateWorker);

module.exports = router;
