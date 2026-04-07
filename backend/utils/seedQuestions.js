require("dotenv").config();
const mongoose = require("mongoose");
const Question = require("../models/Question");

const seedQuestions = [
  // Physics MCQs
  { type: "MCQ", subject: "Physics", topic: "Kinematics", difficulty: "easy", content: "A car accelerates from rest at 2 m/s². What is its velocity after 5 seconds?", options: ["5 m/s", "10 m/s", "15 m/s", "20 m/s"], correctOption: 1, marks: 4 },
  { type: "MCQ", subject: "Physics", topic: "Laws of Motion", difficulty: "medium", content: "A 5 kg block is pushed with a force of 20 N. If friction is 5 N, what is the acceleration?", options: ["2 m/s²", "3 m/s²", "4 m/s²", "5 m/s²"], correctOption: 1, marks: 4 },
  { type: "MCQ", subject: "Physics", topic: "Work Energy Power", difficulty: "medium", content: "A body of mass 2 kg moving at 4 m/s has kinetic energy of:", options: ["4 J", "8 J", "16 J", "32 J"], correctOption: 2, marks: 4 },
  { type: "INTEGER", subject: "Physics", topic: "Kinematics", difficulty: "hard", content: "A ball is thrown upward with 20 m/s. Find max height (g=10 m/s²) in metres:", correctAnswer: 20, marks: 4 },
  { type: "MCQ", subject: "Physics", topic: "Gravitation", difficulty: "easy", content: "The acceleration due to gravity on the moon is approximately:", options: ["1.6 m/s²", "3.2 m/s²", "6.4 m/s²", "9.8 m/s²"], correctOption: 0, marks: 4 },

  // Chemistry MCQs
  { type: "MCQ", subject: "Chemistry", topic: "Atomic Structure", difficulty: "easy", content: "The number of electrons in the outermost shell of Na is:", options: ["1", "2", "3", "8"], correctOption: 0, marks: 4 },
  { type: "MCQ", subject: "Chemistry", topic: "Chemical Bonding", difficulty: "medium", content: "Which of the following has maximum covalent character?", options: ["NaCl", "MgCl₂", "AlCl₃", "SiCl₄"], correctOption: 3, marks: 4 },
  { type: "MCQ", subject: "Chemistry", topic: "Thermodynamics", difficulty: "hard", content: "For a spontaneous process at constant T and P:", options: ["ΔG > 0", "ΔG = 0", "ΔG < 0", "ΔH < 0"], correctOption: 2, marks: 4 },
  { type: "INTEGER", subject: "Chemistry", topic: "Mole Concept", difficulty: "medium", content: "Number of moles in 44 g of CO₂ (mol. wt = 44):", correctAnswer: 1, marks: 4 },
  { type: "MCQ", subject: "Chemistry", topic: "Equilibrium", difficulty: "medium", content: "Le Chatelier's principle deals with:", options: ["Rate of reaction", "Effect of catalyst", "Equilibrium shift on stress", "Activation energy"], correctOption: 2, marks: 4 },

  // Mathematics MCQs
  { type: "MCQ", subject: "Mathematics", topic: "Limits", difficulty: "easy", content: "lim(x→0) (sin x)/x equals:", options: ["0", "1", "∞", "undefined"], correctOption: 1, marks: 4 },
  { type: "MCQ", subject: "Mathematics", topic: "Differentiation", difficulty: "medium", content: "If f(x) = x³ + 2x, then f'(x) is:", options: ["3x² + 2", "3x²", "x² + 2", "3x + 2"], correctOption: 0, marks: 4 },
  { type: "INTEGER", subject: "Mathematics", topic: "Integration", difficulty: "hard", content: "∫₀¹ x dx equals (multiply answer by 2):", correctAnswer: 1, marks: 4 },
  { type: "MCQ", subject: "Mathematics", topic: "Probability", difficulty: "medium", content: "Two dice are rolled. Probability of getting sum 7 is:", options: ["1/6", "1/12", "7/36", "1/9"], correctOption: 0, marks: 4 },
  { type: "MULTIPLE_CORRECT", subject: "Mathematics", topic: "Sets", difficulty: "medium", content: "Which of the following are subsets of {1,2,3,4}?", options: ["{1,2}", "{1,5}", "{}", "{2,3,4}"], correctOptions: [0, 2, 3], marks: 4 },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/ranked");
  await Question.deleteMany({});
  await Question.insertMany(seedQuestions);
  console.log(`✅ Seeded ${seedQuestions.length} questions`);
  process.exit(0);
}

seed().catch((err) => { console.error(err); process.exit(1); });
