const express = require("express");
const morgan = require("morgan");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const app = express(); 

app.use(express.json());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
    console.log("This is the body of the request ", req.body);
    next();
});

app.get("/", (req, res, next) => {
    res.send(`<h1>Welcome to the homepage!</h1>`);
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`)
});