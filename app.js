const express = require("express");
const app = express();
const cookieParser = require('cookie-parser');

if(process.env.NODE_ENV !== "production"){
    require("dotenv").config({path: "config/config.env"});
}
// Using middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:true}));

const athlete = require("./routes/athlete");
const coach = require("./routes/coach");
const sport = require("./routes/sport");
const reviewRoutes = require('./routes/review');
const chatRoutes = require('./routes/chat');
const walletRoutes = require('./routes/wallet');
const session = require('./routes/session');
// const auth = require("./middlewares/auth");

app.use("/api/v1", athlete);
app.use("/api/v1", coach);
app.use("/api/v1", sport);
app.use('/api/v1', reviewRoutes);
app.use('/api/v1', chatRoutes);
app.use('/api/v1', walletRoutes);
app.use('/api/v1', session);
// app.use('/api/v1', auth); 

module.exports = app;