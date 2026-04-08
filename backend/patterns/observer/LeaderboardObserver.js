/**
 * Observer Pattern Implementation
 * When a student submits an answer, all observers (leaderboard, analytics)
 * are automatically notified and updated.
 * SOLID: OCP - new observers added without changing the subject
 * SOLID: SRP - each observer handles its own update logic
 */

// Observer interface
class IObserver {
  update(event, data) {
    throw new Error("update() must be implemented by subclass");
  }
}

// Subject (Observable) - Battle Room
class BattleSubject {
  constructor() {
    this.observers = [];
  }

  subscribe(observer) {
    this.observers.push(observer);
    console.log(`Observer ${observer.constructor.name} subscribed`);
  }

  unsubscribe(observer) {
    this.observers = this.observers.filter((obs) => obs !== observer);
  }

  notify(event, data) {
    this.observers.forEach((observer) => {
      observer.update(event, data);
    });
  }
}

// Concrete Observer 1: Leaderboard updater
class LeaderboardObserver extends IObserver {
  constructor(socketIO, matchId) {
    super();
    this.io = socketIO;
    this.matchId = matchId;
    this.scores = {};
  }

  update(event, data) {
    if (event === "ANSWER_SUBMITTED") {
      const { userId, userName, score } = data;
      if (!this.scores[userId]) {
        this.scores[userId] = { userName, totalScore: 0, answers: 0 };
      }
      this.scores[userId].totalScore += score;
      this.scores[userId].answers += 1;

      // Broadcast updated leaderboard to all users in the room
      const leaderboard = this.getRankedLeaderboard();
      this.io.to(this.matchId).emit("leaderboard_update", { leaderboard });
      console.log(`Leaderboard updated for match ${this.matchId}`);
    }
  }

  getRankedLeaderboard() {
    return Object.entries(this.scores)
      .map(([userId, data]) => ({ userId, ...data }))
      .sort((a, b) => b.totalScore - a.totalScore)
      .map((entry, idx) => ({ rank: idx + 1, ...entry }));
  }
}

module.exports = { BattleSubject, LeaderboardObserver, IObserver };
