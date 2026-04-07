const express = require("express");
const Match = require("../models/Match");
const Question = require("../models/Question");
const { protect } = require("../middleware/auth");
const ConfigManager = require("../config/ConfigManager");

const router = express.Router();

// POST /api/battle/create - create a new battle room
router.post("/create", protect, async (req, res) => {
  try {
    const { mode, subject, topic, scoringStrategy } = req.body;

    // For Quick Battle, check if there's an existing room waiting
    if (mode === "QUICK_BATTLE") {
      const existingMatch = await Match.findOne({
        mode: "QUICK_BATTLE",
        status: "WAITING",
      });

      if (existingMatch) {
        return res.status(200).json({ success: true, matchId: existingMatch._id, match: existingMatch });
      }
    }

    const config = ConfigManager.get(
      mode === "QUICK_BATTLE" ? "quickBattle" : "privateRoom"
    );

    // Fetch questions for the battle
    const filter = { isActive: true };
    if (subject) filter.subject = subject;
    if (topic) filter.topic = topic;
    const questions = await Question.getRandomQuestions(filter, config?.questions || 15);

    if (questions.length < 5) {
      return res.status(400).json({ success: false, message: "Not enough questions for this topic" });
    }

    const match = await Match.create({
      mode,
      subject,
      topic,
      scoringStrategy: scoringStrategy || "JEE_MAIN",
      questions: questions.map((q) => q._id),
      duration: config?.duration || 10,
      players: [{ userId: req.user._id, name: req.user.name, isReady: true }],
    });

    res.status(201).json({ success: true, matchId: match._id, match });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/battle/join/:matchId - join an existing battle
router.post("/join/:matchId", protect, async (req, res) => {
  try {
    const match = await Match.findById(req.params.matchId);
    if (!match) return res.status(404).json({ success: false, message: "Battle not found" });

    // Allow joining mid-battle only for QUICK_BATTLE
    if (match.mode !== "QUICK_BATTLE") {
      if (match.status !== "WAITING") {
        return res.status(400).json({ success: false, message: "Battle already started or ended" });
      }
      if (match.players.length >= 2) {
        return res.status(400).json({ success: false, message: "Battle room is full" });
      }
    } else {
      // For QUICK_BATTLE, still check if it's completed
      if (match.status === "COMPLETED" || match.status === "ABANDONED") {
        return res.status(400).json({ success: false, message: "Battle has already ended" });
      }
    }

    const alreadyIn = match.players.find((p) => p.userId.toString() === req.user._id.toString());
    if (alreadyIn) return res.status(400).json({ success: false, message: "Already in this battle" });

    match.players.push({ userId: req.user._id, name: req.user.name, isReady: true });
    await match.save();

    res.json({ success: true, matchId: match._id, match });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/battle/:matchId - get battle info
router.get("/:matchId", protect, async (req, res) => {
  try {
    const match = await Match.findById(req.params.matchId).populate("questions");
    if (!match) return res.status(404).json({ success: false, message: "Battle not found" });
    res.json({ success: true, match });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/battle/user/history - get user's battle history
router.get("/user/history", protect, async (req, res) => {
  try {
    const matches = await Match.find({
      "players.userId": req.user._id,
      status: "COMPLETED",
    })
      .sort({ createdAt: -1 })
      .limit(20);
    res.json({ success: true, count: matches.length, matches });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
