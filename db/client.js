const pg = require("pg");
const red = '\x1b[31m%s\x1b[0m';
require("dotenv");
const client = new pg.Client({
    connectionString: process.env.DB_URL || `postgres://localhost:5432/capstone`,
    host: process.env.DB_HOST || "localhost",
    username: process.env.DB_USERNAME || undefined,
    password: process.env.DB_PASSWORD || undefined,
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || "capstone"
});

module.exports = { client, red }