/**
 * Strategy Pattern Implementation
 * OOP: Polymorphism - different scoring algorithms behind same interface
 * SOLID: OCP - new strategy added without changing GameEngine
 * SOLID: SRP - each strategy handles only its own scoring logic
 */

// Interface (base class enforcing contract)
class IScoringStrategy {
  calculate(isCorrect, timeTakenSeconds, difficulty) {
    throw new Error("calculate() must be implemented by subclass");
  }

  getName() {
    throw new Error("getName() must be implemented by subclass");
  }
}

// JEE Main standard scoring: +4 / -1
class JEEMainStrategy extends IScoringStrategy {
  calculate(isCorrect, timeTakenSeconds, difficulty) {
    if (isCorrect === null || isCorrect === undefined) return 0; // unattempted
    return isCorrect ? 4 : -1;
  }

  getName() {
    return "JEE_MAIN";
  }
}

// JEE Advanced: partial marking for multiple correct
class JEEAdvancedStrategy extends IScoringStrategy {
  calculate(isCorrect, timeTakenSeconds, difficulty, partialScore = 0) {
    if (isCorrect === null) return 0;
    if (isCorrect) return 3;
    if (partialScore > 0) return partialScore; // partial credit
    return -1;
  }

  getName() {
    return "JEE_ADVANCED";
  }
}

// Speed-based: bonus marks for answering quickly
class SpeedBasedStrategy extends IScoringStrategy {
  calculate(isCorrect, timeTakenSeconds, difficulty) {
    if (!isCorrect) return isCorrect === false ? -1 : 0;
    const baseScore = 4;
    // Bonus up to +2 for answering within 30 seconds
    const speedBonus = timeTakenSeconds < 30 ? 2 : timeTakenSeconds < 60 ? 1 : 0;
    return baseScore + speedBonus;
  }

  getName() {
    return "SPEED_BASED";
  }
}

// Difficulty-weighted: harder questions give more marks
class DifficultyWeightedStrategy extends IScoringStrategy {
  calculate(isCorrect, timeTakenSeconds, difficulty) {
    if (!isCorrect) return isCorrect === false ? -1 : 0;
    const weights = { easy: 2, medium: 4, hard: 6 };
    return weights[difficulty] || 4;
  }

  getName() {
    return "DIFFICULTY_WEIGHTED";
  }
}

// Strategy resolver - returns correct strategy by name
class ScoringStrategyResolver {
  static resolve(strategyName) {
    switch (strategyName) {
      case "JEE_MAIN":
        return new JEEMainStrategy();
      case "JEE_ADVANCED":
        return new JEEAdvancedStrategy();
      case "SPEED_BASED":
        return new SpeedBasedStrategy();
      case "DIFFICULTY_WEIGHTED":
        return new DifficultyWeightedStrategy();
      default:
        return new JEEMainStrategy(); // default
    }
  }
}

module.exports = {
  IScoringStrategy,
  JEEMainStrategy,
  JEEAdvancedStrategy,
  SpeedBasedStrategy,
  DifficultyWeightedStrategy,
  ScoringStrategyResolver,
};
