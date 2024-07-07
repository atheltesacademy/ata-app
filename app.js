const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: "config/config.env" });
}
// Using middlewares
const options = {
  origin: "http://localhost:3000",
};
app.use(cors(options));
app.use(express.json());
app.use(cookieParser());
app.get("/test-cookie", (req, res) => {
  console.log(req.cookies);
  res.send("Cookie parsed successfully!");
});
app.use(express.urlencoded({ extended: true }));

const Athlete = require("./routes/athlete");
const coach = require("./routes/coach");
const sport = require("./routes/sport");
const reviewRoutes = require("./routes/review");
const chatRoutes = require("./routes/chat");
const walletRoutes = require("./routes/wallet");
const session = require("./routes/session");
const surveyRoutes = require("./routes/survey");
// const auth = require("./middlewares/auth");

app.use("/api/v1", Athlete);
app.use("/api/v1", coach);
app.use("/api/v1", sport);
app.use("/api/v1", reviewRoutes);
app.use("/api/v1", chatRoutes);
app.use("/api/v1", walletRoutes);
app.use("/api/v1", session);
app.use('/api/v1', surveyRoutes);
// app.use("/api/v1", auth);

module.exports = app;
