const express = require("express");
const router = express.Router();
const { JWT_SECRET } = process.env;
const jwt = require("jsonwebtoken");
const { requireUser } = require("./utilities");
const { getUserById } = require("../db/users");
const cors = require("cors");
require("dotenv").config();

// set `req.user` if possible
router.use(async (req, res, next) => {
    const prefix = 'Bearer ';
    const auth = req.header('Authorization');
  
    if (!auth) {
      // nothing to see here
      next();
    } else if (auth.startsWith(prefix)) {
      const token = auth.slice(prefix.length);
  
      try {
        const parsedToken = jwt.verify(token, JWT_SECRET);
        const id = parsedToken && parsedToken.id
  
        if (id) {
          req.user = await getUserById(id);
          next();

        } 
      } catch(error) {
          next(error);
        }
    } else {
      next({
        name: 'AuthorizationHeaderError',
        message: `Authorization token must start with ${prefix}`,
      });
    }
  });
  

// ROUTER: /api/users
const usersRouter = require('./users');
router.use('/users', usersRouter);

// ROUTER: /api/shopcart
const shopcartRouter = require('./shopcart');
router.use('/shopcart', shopcartRouter);

// ROUTER: /api/products
const productsRouter = require('./products');
router.use('/products', productsRouter);

router.use((error, req, res, next) => {
  res.send({
    name: error.name,
    message: error.message
  })
});


module.exports = router