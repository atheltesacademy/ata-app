
const express=require("express");
const{ details } = require("../controllers/athlete");


const router =express.Router();
router.route("/details").post(details);

module.exports= router;