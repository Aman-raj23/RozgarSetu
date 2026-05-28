const User = require("../models/User");
const Rating = require("../models/Rating");

// @desc    Get all workers (with optional skill filter)
// @route   GET /api/workers?skill=Electrician
const getWorkers = async (req, res) => {
  try {
    const { skill, search } = req.query;

    let query = { role: "worker" };

    // Skill filter
    if (skill) {
      const skillTerms = skill.split(",").map((s) => s.trim()).filter(Boolean);
      if (skillTerms.length > 0) {
        query.skills = {
          $in: skillTerms.map((s) => new RegExp(`^${s}$`, "i")),
        };
      }
    }

    // Text search on name or bio
    if (search) {
      const searchRegex = new RegExp(search, "i");
      query.$or = [
        { name: searchRegex },
        { bio: searchRegex },
        { skills: { $in: [searchRegex] } },
      ];
    }

    const workers = await User.find(query)
      .select("-password")
      .sort({ "rating.average": -1, createdAt: -1 });

    res.json(workers);
  } catch (error) {
    console.error("Get workers error:", error.message);
    res.status(500).json({ message: "Server error while fetching workers" });
  }
};

// @desc    Get single worker profile
// @route   GET /api/workers/:id
const getWorkerById = async (req, res) => {
  try {
    const worker = await User.findOne({
      _id: req.params.id,
      role: "worker",
    }).select("-password");

    if (!worker) {
      return res.status(404).json({ message: "Worker not found" });
    }

    // Fetch ratings for this worker
    const ratings = await Rating.find({ workerId: worker._id })
      .populate("employerId", "name avatarColor")
      .sort({ createdAt: -1 });

    res.json({ worker, ratings });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).json({ message: "Worker not found" });
    }
    console.error("Get worker by ID error:", error.message);
    res.status(500).json({ message: "Server error while fetching worker" });
  }
};

// @desc    Hire a worker (employer marks as hired)
// @route   POST /api/workers/:id/hire
const hireWorker = async (req, res) => {
  try {
    if (req.user.role !== "employer") {
      return res.status(403).json({ message: "Only employers can hire workers" });
    }

    const worker = await User.findOne({
      _id: req.params.id,
      role: "worker",
    });

    if (!worker) {
      return res.status(404).json({ message: "Worker not found" });
    }

    // Check if already hired by this employer
    if (worker.hiredBy.includes(req.user._id)) {
      return res.status(400).json({ message: "You have already hired this worker" });
    }

    worker.hiredBy.push(req.user._id);
    
    // Send notification to worker
    worker.notifications.push({
      message: `${req.user.name} has shown interest in your profile and hired you. Please check your contact details or expect a call soon.`
    });

    await worker.save();

    res.json({ message: "Thanks for your interest, I will connect to you in some time." });
  } catch (error) {
    console.error("Hire worker error:", error.message);
    res.status(500).json({ message: "Server error while hiring worker" });
  }
};

// @desc    Rate a worker (1-5 stars + optional review)
// @route   POST /api/workers/:id/rate
const rateWorker = async (req, res) => {
  try {
    if (req.user.role !== "employer") {
      return res.status(403).json({ message: "Only employers can rate workers" });
    }

    const { score, review } = req.body;

    if (!score || score < 1 || score > 5) {
      return res.status(400).json({ message: "Rating score must be between 1 and 5" });
    }

    const worker = await User.findOne({
      _id: req.params.id,
      role: "worker",
    });

    if (!worker) {
      return res.status(404).json({ message: "Worker not found" });
    }

    // Check if employer has hired this worker
    if (!worker.hiredBy.includes(req.user._id)) {
      return res.status(403).json({ message: "You must hire this worker before rating" });
    }

    // Create or update rating
    const existingRating = await Rating.findOne({
      workerId: worker._id,
      employerId: req.user._id,
    });

    if (existingRating) {
      existingRating.score = score;
      existingRating.review = review || "";
      await existingRating.save();
    } else {
      await Rating.create({
        workerId: worker._id,
        employerId: req.user._id,
        score,
        review: review || "",
      });
    }

    // Recalculate average rating
    const allRatings = await Rating.find({ workerId: worker._id });
    const totalScore = allRatings.reduce((sum, r) => sum + r.score, 0);
    const averageRating = allRatings.length > 0 ? totalScore / allRatings.length : 0;

    worker.rating.average = Math.round(averageRating * 10) / 10;
    worker.rating.count = allRatings.length;
    await worker.save();

    res.json({
      message: existingRating ? "Rating updated" : "Rating submitted",
      rating: worker.rating,
    });
  } catch (error) {
    console.error("Rate worker error:", error.message);
    res.status(500).json({ message: "Server error while rating worker" });
  }
};

module.exports = { getWorkers, getWorkerById, hireWorker, rateWorker };
