const mongoose = require("mongoose");

/**
 * Match Model - represents a battle session
 */
const matchSchema = new mongoose.Schema(
  {
    mode: {
      type: String,
      enum: ["QUICK_BATTLE", "PRIVATE_ROOM"],
      required: true,
    },
    status: {
      type: String,
      enum: ["WAITING", "IN_PROGRESS", "COMPLETED", "ABANDONED"],
      default: "WAITING",
    },
    players: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        name: String,
        score: { type: Number, default: 0 },
        isReady: { type: Boolean, default: false },
      },
    ],
    questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
    scoringStrategy: {
      type: String,
      enum: ["JEE_MAIN", "JEE_ADVANCED", "SPEED_BASED", "DIFFICULTY_WEIGHTED"],
      default: "JEE_MAIN",
    },
    subject: { type: String },
    topic: { type: String },
    roomCode: { type: String, unique: true, sparse: true },
    startedAt: { type: Date },
    endedAt: { type: Date },
    duration: { type: Number, default: 10 }, // minutes
    winnerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Match", matchSchema);
