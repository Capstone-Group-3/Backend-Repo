const pg = require("pg");
const red = '\x1b[31m%s\x1b[0m';
require("dotenv");
const client = new pg.Client(process.env.DB_URL || `postgres://localhost:5432/capstone`)

module.exports = {client, red}