const { getUserByUsername } = require("../db/users");

function requireUser(req, res, next) {
    if (!req.user) {
        next({
            name: "Missing User Error",
            message: "You must be logged in to perform this action"
        });
    }
    next();
};

function requireAdmin(req, res, next) {
    if (!req.user.isAdmin) {
        next({
            name: "Missing Admin Error",
            message: "You must be an admin to perform this action"
        });
    }
    next();
}

// function requireOwner(req, res, next) { // somehow put username in parameters
//     const thisUsername = req.user.username;

//     getUserByUsername(thisUsername);
//     if (!req.user.username === username) {
//         next({
//             name: "Account Authentication Error",
//             message: "You must be the owner of this account to perform this action"
//         })
//     }
//     next();
// }

module.exports = { requireUser, requireAdmin }