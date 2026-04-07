const express = require("express");
const Question = require("../models/Question");
const { protect, adminOnly } = require("../middleware/auth");
const { QuestionFactory } = require("../patterns/factory/QuestionFactory");

const router = express.Router();

// GET /api/questions - get questions with filters
router.get("/", protect, async (req, res) => {
  try {
    const { subject, topic, difficulty, type, limit = 10 } = req.query;
    const filter = { isActive: true };
    if (subject) filter.subject = subject;
    if (topic) filter.topic = topic;
    if (difficulty) filter.difficulty = difficulty;
    if (type) filter.type = type;

    const questions = await Question.find(filter).limit(parseInt(limit));
    res.json({ success: true, count: questions.length, questions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/questions/random - get random questions for a battle
router.get("/random", protect, async (req, res) => {
  try {
    const { subject, topic, count = 10 } = req.query;
    const filter = {};
    if (subject) filter.subject = subject;
    if (topic) filter.topic = topic;
    const questions = await Question.getRandomQuestions(filter, parseInt(count));
    res.json({ success: true, count: questions.length, questions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/questions/:id
router.get("/:id", protect, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ success: false, message: "Question not found" });
    res.json({ success: true, question });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/questions - admin only, uses Factory Pattern
router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const { type } = req.body;
    // Factory pattern validates and creates the question object
    const questionObj = QuestionFactory.create(type, req.body);
    const question = await Question.create(req.body);
    res.status(201).json({ success: true, question, summary: questionObj.getSummary() });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// PUT /api/questions/:id - admin only
router.put("/:id", protect, adminOnly, async (req, res) => {
  try {
    const question = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!question) return res.status(404).json({ success: false, message: "Question not found" });
    res.json({ success: true, question });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/questions/:id - admin only (soft delete)
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    await Question.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: "Question deactivated" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
