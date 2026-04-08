const Match = require("../models/Match");
const Question = require("../models/Question");
const Submission = require("../models/Submission");
const { ScoringStrategyResolver } = require("../patterns/strategy/ScoringStrategy");
const { BattleSubject, LeaderboardObserver } = require("../patterns/observer/LeaderboardObserver");
const ConfigManager = require("../config/ConfigManager");

/**
 * GameEngine Service
 * OOP: Encapsulation - all battle logic hidden inside this class
 * OOP: Abstraction - complex game flow exposed via simple methods
 * SOLID: SRP - only manages game state and flow
 * Uses Strategy Pattern for scoring, Observer Pattern for real-time updates
 */
class GameEngine {
  constructor(io) {
    this.io = io;
    this.activeMatches = new Map(); // matchId -> battle state
  }

  async initializeBattle(matchId) {
    const match = await Match.findById(matchId).populate("questions");
    if (!match) throw new Error("Match not found");

    const strategy = ScoringStrategyResolver.resolve(match.scoringStrategy);

    // Observer Pattern: create subject and attach observers
    const battleSubject = new BattleSubject();
    const leaderboardObs = new LeaderboardObserver(this.io, matchId);
    battleSubject.subscribe(leaderboardObs);

    // Store active match state in memory
    const state = {
      match,
      strategy,
      battleSubject,
      leaderboardObs,
      currentQuestionIndex: 0,
      startTime: Date.now(),
      playerScores: {},
    };
    this.activeMatches.set(matchId.toString(), state);

    match.status = "IN_PROGRESS";
    match.startedAt = new Date();
    await match.save();

    state.startTime = match.startedAt.getTime();

    console.log(`Battle ${matchId} initialized with strategy: ${strategy.getName()}`);
    return match;
  }

  async submitAnswer(matchId, userId, userName, questionId, answer, timeTaken) {
    const state = this.activeMatches.get(matchId.toString());
    if (!state) throw new Error("Battle not active");

    // Check if match has already ended
    const elapsed = (Date.now() - state.startTime) / 1000 / 60;
    if (elapsed > state.match.duration) {
      throw new Error("Battle time has expired");
    }

    const question = await Question.findById(questionId);
    if (!question) throw new Error("Question not found");

    // Use Factory-created object to validate answer
    const { QuestionFactory } = require("../patterns/factory/QuestionFactory");
    const questionObj = QuestionFactory.create(question.type, question.toObject());
    const isCorrect = questionObj.validate(answer);

    // Use Strategy Pattern to calculate score
    const score = state.strategy.calculate(isCorrect, timeTaken, question.difficulty);

    // Save submission to DB
    await Submission.create({ matchId, userId, questionId, answer, isCorrect, scoreAwarded: score, timeTaken });

    // Update player score in state
    if (!state.playerScores[userId]) state.playerScores[userId] = 0;
    state.playerScores[userId] += score;

    // Notify all observers (leaderboard + analytics)
    state.battleSubject.notify("ANSWER_SUBMITTED", {
      userId,
      userName,
      score,
      isCorrect,
      timeTaken,
      topic: question.topic,
    });

    return { isCorrect, score, totalScore: state.playerScores[userId] };
  }

  async endBattle(matchId) {
    const state = this.activeMatches.get(matchId.toString());
    if (!state) return;

    // Determine winner
    let winnerId = null;
    let maxScore = -Infinity;
    for (const [userId, score] of Object.entries(state.playerScores)) {
      if (score > maxScore) {
        maxScore = score;
        winnerId = userId;
      }
    }

    await Match.findByIdAndUpdate(matchId, {
      status: "COMPLETED",
      endedAt: new Date(),
      winnerId,
      "players.$[].score": 0,
    });

    // Notify observers battle ended
    state.battleSubject.notify("BATTLE_ENDED", { winnerId, scores: state.playerScores });

    // Broadcast to room
    this.io.to(matchId.toString()).emit("battle_ended", {
      winnerId,
      finalScores: state.playerScores,
      leaderboard: state.leaderboardObs.getRankedLeaderboard(),
    });

    this.activeMatches.delete(matchId.toString());
    console.log(`Battle ${matchId} ended. Winner: ${winnerId}`);
    return { winnerId, scores: state.playerScores };
  }

  getBattleState(matchId) {
    return this.activeMatches.get(matchId.toString()) || null;
  }
}

module.exports = GameEngine;
