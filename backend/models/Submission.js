const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
  {
    matchId: { type: mongoose.Schema.Types.ObjectId, ref: "Match", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question", required: true },
    answer: { type: mongoose.Schema.Types.Mixed }, // can be number, string, or array
    isCorrect: { type: Boolean },
    scoreAwarded: { type: Number, default: 0 },
    timeTaken: { type: Number }, // seconds
  },
  { timestamps: true }
);

module.exports = mongoose.model("Submission", submissionSchema);
