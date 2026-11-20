
const router = require("express").Router();
const mongoose = require("mongoose");

const Lesson = require("../models/Lesson");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

// All CMS routes require administrator authentication
router.use(auth, admin);

// Get all lessons, including drafts
router.get("/", async (req, res) => {
  try {
    const lessons = await Lesson.find()
      .sort({ createdAt: -1 });

    res.json({ success: true, lessons });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Could not load lessons."
    });
  }
});

// Create a new lesson
router.post("/", async (req, res) => {
  try {
    const lesson = await Lesson.create({
      ...req.body,
      createdBy: req.user._id
    });

    res.status(201).json({
      success: true,
      message: "Lesson created successfully.",
      lesson
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.code === 11000
        ? "This lesson slug already exists."
        : "Could not create lesson. Check the submitted data."
    });
  }
});

// Update an existing lesson
router.patch("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid lesson ID."
      });
    }

    const updates = { ...req.body };

    // Never allow ownership or internal identifiers to be changed
    delete updates._id;
    delete updates.createdBy;
    delete updates.__v;

    const lesson = await Lesson.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found."
      });
    }

    res.json({
      success: true,
      message: "Lesson updated successfully.",
      lesson
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Could not update lesson."
    });
  }
});

// Delete a lesson
router.delete("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid lesson ID."
      });
    }

    const lesson = await Lesson.findByIdAndDelete(req.params.id);

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found."
      });
    }

    res.json({
      success: true,
      message: "Lesson deleted successfully."
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Could not delete lesson."
    });
  }
});

module.exports = router;
