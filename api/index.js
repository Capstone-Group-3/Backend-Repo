const express = require("express");
const router = express.Router();
const { JWT_SECRET } = process.env;
const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = router;