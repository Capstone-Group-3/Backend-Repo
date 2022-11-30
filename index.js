const express = require("express");
const morgan = require("morgan");/*remove for main branch push*/
const jwt = require("jsonwebtoken");
const { client } = require("./db/client");
require("dotenv").config();
const app = express(); 
const cors = require("cors");
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));/*remove for main branch push*/


const router = require("./api");
app.use("/api", router)

app.get("/", (req, res, next) => {
    res.send(`<h1>Welcome to the homepage!</h1>`);
});

client.connect();

const PORT = process.env.PORT || 3030;

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`)
});