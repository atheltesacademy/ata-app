const express = require("express");
const app = express();
const cookieParser = require('cookie-parser');


if(process.env.NODE_ENV !=="production"){
require("dotenv").config({path: "backend/config/config.env"});
}

//using middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:true}));

// //importing routes here
// const auth = require("./middlewares/auth");
// const auth = require('../middleware/auth');
// const { updatePassword } = require('../controllers/userController');
// const walletRoutes = require('./routes/wallet');

const user = require("./routes/user");
const athlete = require("./routes/athlete");
const coach =require("./routes/coach");
const sport =require("./routes/sport");
const reviewRoutes = require('./routes/review');
const coacheslist =require("./routes/coacheslist");
// const chat = require('./routes/chat');
const chatHistoryRoutes = require('./routes/chatHistory');
const walletRoutes = require('./routes/wallet');
//  const auth = require('./middlewares/auth');



// //using routes
app.use("/api/v1",user);
app.use("/api/v1",athlete);
app.use("/api/v1",coach);
app.use("/api/v1",sport);
// app.use("/api/v1",review);
app.use('/api/v1', reviewRoutes);
app.use("/api/v1",coacheslist);
// app.use("/api/v1",chat)
app.use('/api/v1', chatHistoryRoutes);

app.use('/api/v1', walletRoutes);
// app.use(auth.authenticateUser);


// Error handling middleware
// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).send('Something went wrong!');
// });


module.exports = app;