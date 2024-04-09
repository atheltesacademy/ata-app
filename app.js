const express = require("express");
const app = express();
const cors = require("cors");
const http = require("http"); 

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: "config/config.env" });
}
// Middleware
app.use(express.json());
app.use(cors());

const server = http.createServer(app);

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

module.exports = { server };
