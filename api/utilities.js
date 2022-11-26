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
    console.log("require admin: ", req.user.isAdmin)
    if (!req.user.isAdmin) {
        next({
            name: "Missing Admin Error",
            message: "You must be an admin to perform this action"
        });
    }
    next();
}

module.exports = { requireUser, requireAdmin }