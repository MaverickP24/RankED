const mongoose = require("mongoose");

/**
 * Question Model
 * OOP: Abstraction - hides complex query logic
 * Works with QuestionFactory for object creation
 */
const questionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["MCQ", "INTEGER", "MULTIPLE_CORRECT"],
      required: true,
    },
    subject: {
      type: String,
      enum: ["Physics", "Chemistry", "Mathematics"],
      required: true,
    },
    topic: { type: String, required: true },
    content: { type: String, required: true },
    options: [{ type: String }], // for MCQ / MultipleCorrect
    correctOption: { type: Number }, // for MCQ (index)
    correctAnswer: { type: Number }, // for Integer type
    correctOptions: [{ type: Number }], // for MultipleCorrect
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },
    marks: { type: Number, default: 4 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Static method: get random questions by subject/topic
questionSchema.statics.getRandomQuestions = async function (filters, count) {
  return this.aggregate([
    { $match: { ...filters, isActive: true } },
    { $sample: { size: count } },
  ]);
};

module.exports = mongoose.model("Question", questionSchema);
