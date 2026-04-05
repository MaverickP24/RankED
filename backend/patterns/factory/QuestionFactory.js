/**
 * Factory Pattern Implementation
 * OOP: Abstraction - QuestionFactory hides which class to instantiate
 * OOP: Polymorphism - all question types share the same interface
 * SOLID: OCP - new question types added without modifying existing code
 * SOLID: DIP - callers depend on factory abstraction, not concrete classes
 */

class MCQQuestion {
  constructor(data) {
    this.type = "MCQ";
    this.content = data.content;
    this.options = data.options; // array of 4 strings
    this.correctOption = data.correctOption; // index 0-3
    this.topic = data.topic;
    this.subject = data.subject;
    this.difficulty = data.difficulty;
    this.marks = data.marks || 4;
  }

  validate(answer) {
    return parseInt(answer) === this.correctOption;
  }

  getType() {
    return "MCQ";
  }

  getSummary() {
    return `MCQ | ${this.subject} | ${this.topic} | Difficulty: ${this.difficulty}`;
  }
}

class IntegerTypeQuestion {
  constructor(data) {
    this.type = "INTEGER";
    this.content = data.content;
    this.correctAnswer = data.correctAnswer; // numeric value
    this.topic = data.topic;
    this.subject = data.subject;
    this.difficulty = data.difficulty;
    this.marks = data.marks || 4;
  }

  validate(answer) {
    return parseInt(answer) === this.correctAnswer;
  }

  getType() {
    return "INTEGER";
  }

  getSummary() {
    return `Integer | ${this.subject} | ${this.topic} | Difficulty: ${this.difficulty}`;
  }
}

class MultipleCorrectQuestion {
  constructor(data) {
    this.type = "MULTIPLE_CORRECT";
    this.content = data.content;
    this.options = data.options;
    this.correctOptions = data.correctOptions; // array of correct indices
    this.topic = data.topic;
    this.subject = data.subject;
    this.difficulty = data.difficulty;
    this.marks = data.marks || 4;
  }

  validate(answer) {
    if (!Array.isArray(answer)) return false;
    const selected = answer.map(Number).sort();
    const correct = [...this.correctOptions].sort();
    return JSON.stringify(selected) === JSON.stringify(correct);
  }

  getType() {
    return "MULTIPLE_CORRECT";
  }

  getSummary() {
    return `MultiCorrect | ${this.subject} | ${this.topic} | Difficulty: ${this.difficulty}`;
  }
}

// Factory class - single entry point for creating any question type
class QuestionFactory {
  static create(type, data) {
    switch (type.toUpperCase()) {
      case "MCQ":
        return new MCQQuestion(data);
      case "INTEGER":
        return new IntegerTypeQuestion(data);
      case "MULTIPLE_CORRECT":
        return new MultipleCorrectQuestion(data);
      default:
        throw new Error(`Unknown question type: ${type}`);
    }
  }

  static getSupportedTypes() {
    return ["MCQ", "INTEGER", "MULTIPLE_CORRECT"];
  }
}

module.exports = { QuestionFactory, MCQQuestion, IntegerTypeQuestion, MultipleCorrectQuestion };
