function requireUser(req, res, next) {
    if (!req.user) {
        next({
            name: "Missing User Error",
            message: "You must be logged in to perform this action"
        });
    }
    next();
};

// function requireAdmin(req, res, next) {
//     //add isadmin to return user by id
//     // talk to jeremy, is adding "isadmin" to getuser by id && req.user a security issue?
//     if(req.user)
// }

module.exports = { requireUser }