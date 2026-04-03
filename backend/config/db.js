const mongoose = require("mongoose");

// Singleton Pattern: Only one DB connection instance throughout the app
class Database {
  constructor() {
    if (Database.instance) {
      return Database.instance;
    }
    this.connection = null;
    Database.instance = this;
  }

  async connect() {
    if (this.connection) {
      console.log("DB already connected (Singleton)");
      return this.connection;
    }
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI);
      this.connection = conn;
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return conn;
    } catch (error) {
      console.error(`DB Connection Error: ${error.message}`);
      process.exit(1);
    }
  }
}

module.exports = new Database();
