const router = require("express").Router();
const lessons = require("../data/lessons");
router.get("/", (req, res) => res.json({ success: true, lessons }));
router.get("/:id", (req, res) => {
  const lesson = lessons.find(item => item.id === req.params.id);
  if (!lesson) return res.status(404).json({ success: false, message: "Lesson not found." });
  res.json({ success: true, lesson });
});
module.exports = router;
