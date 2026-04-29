require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const Database = require("./config/db");
const SocketManager = require("./services/SocketManager");

const app = express();
const server = http.createServer(app);

// CORS: support comma-separated origins in FRONTEND_URL (e.g. "https://app.vercel.app,http://localhost:3000")
const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:3000")
  .split(",")
  .map((o) => o.trim());

const corsOptions = {
  origin: allowedOrigins.length === 1 ? allowedOrigins[0] : allowedOrigins,
  methods: ["GET", "POST"],
  credentials: true,
};

// Socket.IO setup
const io = new Server(server, { cors: corsOptions });

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Health check
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "RankED API is running", timestamp: new Date() });
});

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/questions", require("./routes/questions"));
app.use("/api/battle", require("./routes/battle"));

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Internal server error" });
});

// Initialize WebSocket
const socketManager = new SocketManager(io);
socketManager.initialize();

// Connect DB and start server
const PORT = process.env.PORT || 5000;
Database.connect().then(() => {
  server.listen(PORT, () => {
    console.log(`🚀 RankED server running on port ${PORT}`);
    console.log(`📡 WebSocket server ready`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
  });
});
