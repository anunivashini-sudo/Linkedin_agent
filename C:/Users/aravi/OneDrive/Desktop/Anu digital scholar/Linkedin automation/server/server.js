const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./db");
const apiRouter = require("./routes/api");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Log incoming requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Register Api routes
app.use("/api", apiRouter);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "healthy", database: db.isConnected ? "connected" : "disconnected" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled Server Error:", err);
  res.status(500).json({ error: "Internal Server Error", message: err.message });
});

// Start Express server
const server = app.listen(PORT, () => {
  console.log(`LinkedFlow AI Backend listening on port ${PORT}`);
  
  // Proactively initialize database pools and tables
  db.initializeDatabase().catch(err => {
    console.error("Critical: Database initialization failed during startup:", err);
  });
});

module.exports = server;
