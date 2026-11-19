const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  completedModules: { type: [String], default: [] },
  quizBestScore: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model("Progress", progressSchema);
