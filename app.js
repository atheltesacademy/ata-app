const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const app = express();
const server = http.createServer(app); // Create HTTP server first
const io = socketIO(server); // Initialize Socket.IO with the server

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: "config/config.env" });
}

// Middleware
app.use(express.json());
app.use(cors());

// Import routes
const Athlete = require("./routes/athlete");
const coach = require("./routes/coach");
const sport = require("./routes/sport");
const reviewRoutes = require("./routes/review");
const chatRoutes = require("./routes/chat");
const walletRoutes = require("./routes/wallet");
const session = require("./routes/session");
const auth = require("./middlewares/auth");

// Use routes
app.use("/api/v1", Athlete);
app.use("/api/v1", coach);
app.use("/api/v1", sport);
app.use("/api/v1", reviewRoutes);
app.use("/api/v1", chatRoutes);
app.use("/api/v1", walletRoutes);
app.use("/api/v1", session);
app.use("/api/v1", auth);

module.exports = { server, io, app };
