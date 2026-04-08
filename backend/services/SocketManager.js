const GameEngine = require("./GameEngine");
const Match = require("../models/Match");

/**
 * SocketManager - handles all WebSocket events
 * Observer Pattern: socket events trigger observer notifications
 * SOLID: SRP - only manages socket event handling
 */
class SocketManager {
  constructor(io) {
    this.io = io;
    this.gameEngine = new GameEngine(io);
    this.connectedUsers = new Map(); // socketId -> userId
  }

  initialize() {
    this.io.on("connection", (socket) => {
      console.log(`Socket connected: ${socket.id}`);

      // User identifies themselves
      socket.on("authenticate", (userId) => {
        this.connectedUsers.set(socket.id, userId);
        console.log(`User ${userId} authenticated via socket`);
      });

      // Join battle room
      socket.on("join_battle", async ({ matchId, userId, userName }) => {
        socket.join(matchId);
        this.connectedUsers.set(socket.id, userId);
        console.log(`User ${userName} joined battle room ${matchId}`);

        // Notify others in room
        socket.to(matchId).emit("player_joined", { userId, userName });

        // Auto-start for Quick Battle when 2 players are present
        try {
          const match = await Match.findById(matchId);
          if (match && match.mode === "QUICK_BATTLE" && match.status === "WAITING" && match.players.length >= 2) {
            console.log(`Auto-starting quick battle ${matchId}`);
            const updatedMatch = await this.gameEngine.initializeBattle(matchId);
            this.io.to(matchId).emit("battle_started", {
              matchId,
              questions: updatedMatch.questions,
              duration: updatedMatch.duration,
              startTime: updatedMatch.startedAt,
            });
          }
        } catch (err) {
          console.error("Auto-start error:", err);
        }
      });

      // Start battle (when both players ready)
      socket.on("start_battle", async ({ matchId }) => {
        try {
          const match = await this.gameEngine.initializeBattle(matchId);
          this.io.to(matchId).emit("battle_started", {
            matchId,
            questions: match.questions,
            duration: match.duration,
            startTime: match.startedAt,
          });
        } catch (err) {
          socket.emit("error", { message: err.message });
        }
      });

      // Submit answer
      socket.on("submit_answer", async ({ matchId, userId, userName, questionId, answer, timeTaken }) => {
        try {
          const result = await this.gameEngine.submitAnswer(
            matchId, userId, userName, questionId, answer, timeTaken
          );
          // Send result to the submitting player only
          socket.emit("answer_result", { questionId, ...result });
        } catch (err) {
          socket.emit("error", { message: err.message });
        }
      });

      // End battle manually
      socket.on("end_battle", async ({ matchId }) => {
        try {
          const result = await this.gameEngine.endBattle(matchId);
          // io.to already called inside endBattle
        } catch (err) {
          socket.emit("error", { message: err.message });
        }
      });

      // Player disconnects
      socket.on("disconnect", () => {
        const userId = this.connectedUsers.get(socket.id);
        this.connectedUsers.delete(socket.id);
        console.log(`Socket disconnected: ${socket.id}, user: ${userId}`);
      });
    });

    console.log("SocketManager initialized");
  }
}

module.exports = SocketManager;
