const Job = require("../models/Job");
const haversine = require("../utils/haversine");
const { rankJobs } = require("../utils/recommendation");
const { detectFraud } = require("../utils/fraudDetection");

// @desc    Create a new job
// @route   POST /api/jobs
const createJob = async (req, res) => {
  try {
    // Only employers can create jobs
    if (req.user.role !== "employer") {
      return res.status(403).json({ message: "Only employers can post jobs" });
    }

    const { title, description, skills, salary, salaryPeriod, location, phone } = req.body;

    // Validate required fields
    if (!title || !description || !skills || salary === undefined || !location || !phone) {
      return res.status(400).json({
        message: "All fields are required: title, description, skills, salary, location, phone",
      });
    }

    if (!location.lat || !location.lng) {
      return res.status(400).json({ message: "Location (lat, lng) is required" });
    }

    // Run fraud detection
    const fraudResult = detectFraud({ title, description, salary, salaryPeriod, phone });

    const job = await Job.create({
      title,
      description,
      skills: Array.isArray(skills) ? skills : [skills],
      salary: Number(salary),
      salaryPeriod: salaryPeriod || "day",
      location,
      employerId: req.user._id,
      phone,
      isSuspicious: fraudResult.isSuspicious,
      suspiciousReasons: fraudResult.suspiciousReasons,
    });

    res.status(201).json(job);
  } catch (error) {
    console.error("Create job error:", error.message);
    res.status(500).json({ message: "Server error while creating job" });
  }
};

// @desc    Get all jobs (with optional skill filter)
// @route   GET /api/jobs?skill=Driving
const getAllJobs = async (req, res) => {
  try {
    const { skill } = req.query;

    let query = {};
    if (skill) {
      const skillTerms = skill.split(",").map((s) => s.trim()).filter(Boolean);
      if (skillTerms.length > 0) {
        query.skills = {
          $in: skillTerms.map((s) => new RegExp(`^${s}$`, "i")),
        };
      }
    }

    const jobs = await Job.find(query)
      .populate("employerId", "name email phone")
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (error) {
    console.error("Get all jobs error:", error.message);
    res.status(500).json({ message: "Server error while fetching jobs" });
  }
};

// @desc    Get nearby jobs (filtered by skill + location + recommendation engine)
// @route   GET /api/jobs/nearby?lat=...&lng=...&skill=...&radius=10
const getNearbyJobs = async (req, res) => {
  try {
    const { lat, lng, skill, radius = 10 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ message: "Latitude and longitude are required" });
    }

    const userLat = parseFloat(lat);
    const userLng = parseFloat(lng);
    const maxRadius = parseFloat(radius);

    // Build skill filter
    let query = {};
    if (skill) {
      const skillTerms = skill.split(",").map((s) => s.trim()).filter(Boolean);
      if (skillTerms.length > 0) {
        query.skills = {
          $in: skillTerms.map((s) => new RegExp(s, "i")),
        };
      }
    }

    let jobs = await Job.find(query)
      .populate("employerId", "name email phone")
      .sort({ createdAt: -1 });

    // Filter by distance using Haversine
    jobs = jobs.filter((job) => {
      const distance = haversine(userLat, userLng, job.location.lat, job.location.lng);
      return distance <= maxRadius;
    });

    // Rank using recommendation engine
    const userSkills = skill ? skill.split(",").map((s) => s.trim()) : [];
    const rankedJobs = rankJobs(jobs, userLat, userLng, userSkills);

    res.json(rankedJobs);
  } catch (error) {
    console.error("Get nearby jobs error:", error.message);
    res.status(500).json({ message: "Server error while fetching nearby jobs" });
  }
};

// @desc    Get single job by ID
// @route   GET /api/jobs/:id
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      "employerId",
      "name email phone location"
    );

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json(job);
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).json({ message: "Job not found" });
    }
    console.error("Get job by ID error:", error.message);
    res.status(500).json({ message: "Server error while fetching job" });
  }
};

// @desc    Update a job
// @route   PUT /api/jobs/:id
const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Check ownership
    if (job.employerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this job" });
    }

    const { title, description, skills, salary, salaryPeriod, location, phone } = req.body;

    // Build update object
    const updates = {};
    if (title) updates.title = title;
    if (description) updates.description = description;
    if (skills) updates.skills = Array.isArray(skills) ? skills : [skills];
    if (salary !== undefined) updates.salary = Number(salary);
    if (salaryPeriod) updates.salaryPeriod = salaryPeriod;
    if (location) updates.location = location;
    if (phone) updates.phone = phone;

    // Re-run fraud detection on updated data
    const mergedData = {
      title: updates.title || job.title,
      description: updates.description || job.description,
      salary: updates.salary !== undefined ? updates.salary : job.salary,
      salaryPeriod: updates.salaryPeriod || job.salaryPeriod,
      phone: updates.phone || job.phone,
    };
    const fraudResult = detectFraud(mergedData);
    updates.isSuspicious = fraudResult.isSuspicious;
    updates.suspiciousReasons = fraudResult.suspiciousReasons;

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).populate("employerId", "name email phone");

    res.json(updatedJob);
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).json({ message: "Job not found" });
    }
    console.error("Update job error:", error.message);
    res.status(500).json({ message: "Server error while updating job" });
  }
};

// @desc    Delete a job
// @route   DELETE /api/jobs/:id
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Check ownership
    if (job.employerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this job" });
    }

    await Job.findByIdAndDelete(req.params.id);

    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).json({ message: "Job not found" });
    }
    console.error("Delete job error:", error.message);
    res.status(500).json({ message: "Server error while deleting job" });
  }
};

module.exports = {
  createJob,
  getAllJobs,
  getNearbyJobs,
  getJobById,
  updateJob,
  deleteJob,
};
