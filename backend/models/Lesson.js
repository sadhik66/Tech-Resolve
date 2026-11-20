
const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },

  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },

  category: {
    type: String,
    required: true,
    enum: [
      "Networking Fundamentals",
      "Network Administration",
      "Cybersecurity",
      "Cloud Computing",
      "IT Troubleshooting",
      "IT Skills"
    ]
  },

  level: {
    type: String,
    enum: ["Beginner", "Intermediate", "Advanced"],
    default: "Beginner"
  },

  duration: {
    type: Number,
    default: 15
  },

  summary: {
    type: String,
    required: true
  },

  contentType: {
    type: String,
    enum: ["original", "curated", "hybrid"],
    default: "original"
  },

  access: {
    type: String,
    enum: ["free", "premium"],
    default: "free"
  },

  sections: [{
    heading: String,
    body: String
  }],

  resources: [{
    title: String,
    provider: String,
    url: String,
    resourceType: {
      type: String,
      enum: ["documentation", "video", "course", "article"],
      default: "documentation"
    }
  }],

  quiz: [{
    question: String,
    options: [String],
    correctAnswer: Number,
    explanation: String
  }],

  status: {
    type: String,
    enum: ["draft", "published"],
    default: "draft"
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }

}, { timestamps: true });

module.exports = mongoose.model("Lesson", lessonSchema);
