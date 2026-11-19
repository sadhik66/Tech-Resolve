const router = require("express").Router();
const auth = require("../middleware/auth");
const Progress = require("../models/Progress");

router.get("/", auth, async (req, res) => {
  try {
    const progress = await Progress.findOne({ user: req.user._id });
    res.json({ success: true, progress: progress || { completedModules: [], quizBestScore: 0 } });
  } catch {
    res.status(500).json({ success: false, message: "Could not load progress." });
  }
});

router.put("/", auth, async (req, res) => {
  try {
    const completedModules = Array.isArray(req.body.completedModules)
      ? [...new Set(req.body.completedModules.map(String).slice(0, 30))]
      : [];
    const quizBestScore = Math.max(0, Math.min(100, Number(req.body.quizBestScore) || 0));
    const progress = await Progress.findOneAndUpdate(
      { user: req.user._id },
      { $addToSet: { completedModules: { $each: completedModules } }, $max: { quizBestScore } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    res.json({ success: true, progress });
  } catch {
    res.status(500).json({ success: false, message: "Could not save progress." });
  }
});

module.exports = router;
