const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

/**
 * User Model
 * OOP: Encapsulation - password hashing hidden inside model
 * OOP: Abstraction - comparePassword abstracts bcrypt complexity
 */
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false, // never returned by default
    },
    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
    },
    targetExam: {
      type: String,
      enum: ["JEE_MAIN", "JEE_ADVANCED"],
      default: "JEE_MAIN",
    },
    weakTopics: [{ type: String }],
  },
  { timestamps: true }
);

// Encapsulation: hash password before save (internals hidden)
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Abstraction: expose simple comparePassword method
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.getPublicProfile = function () {
  return {
    _id: this._id,
    name: this.name,
    email: this.email,
    role: this.role,
    targetExam: this.targetExam,
  };
};

module.exports = mongoose.model("User", userSchema);
