const express = require('express');
const { getNonAdminUsers, getUserByUsername, getUser, createUser, getUserById, toggleAdmin, deleteUser } = require('../db/users');
const { getShopCartByUserId } = require('../db/shopcart')
const usersRouter = express.Router();
const jwt = require('jsonwebtoken');
const { requireUser, requireAdmin } = require('./utilities');
require("dotenv").config();
const { JWT_SECRET } = process.env;

// USE /api/users
usersRouter.use((req, res, next) => {
  console.log("A request is being made to /users");

  next();
});

// POST /api/users/login
usersRouter.post('/login', async (req, res, next) => {
  const { username, password } = req.body;

  // request must have both
  if (!username || !password) {
    next({
      name: "MissingCredentialsError",
      message: "Please supply both a username and password"
    });
  }
  try {
    const user = await getUser({ username, password });

    if (user) {
      const token = jwt.sign({ username: username, id: user.id }
        , JWT_SECRET, {
        expiresIn: "1w"
      })

      req.user = user;
      res.send({ message: "you're logged in!", token: token, user: user });
    } else {
      next({
        name: 'IncorrectCredentialsError',
        message: 'Username or password is incorrect'
      });
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// POST /api/users/register
usersRouter.post('/register', async (req, res, next) => {
  const { username, password } = req.body;

  try {

    const user = await createUser({
      username: username,
      password: password
    });
    console.log("the user: ", user);
    const token = jwt.sign({
      id: user.id,
      username
    }, process.env.JWT_SECRET, {
      expiresIn: '1w'
    });
    console.log("the token: ", token);
    res.send({
      message: "thank you for signing up",
      token
    });
  } catch ({ name, message }) {
    next({ name, message })
  }
});

// GET /api/users/me
usersRouter.get("/me", requireUser, async (req, res, next) => {
  try {
    const response = req.user
    res.send(response)
  } catch ({ name, message }) {
    next({ name, message })
  }
});


usersRouter.get('/nonAdmin', async(req,res,next)=>{
  try {
    const regUsers = await getNonAdminUsers()
    res.send(regUsers)
  } catch (error) {
    console.error
  }
})

// POST /api/users/orders
usersRouter.post('/orders', async (req, res, next) => {
  const { userId } = req.body
  try {
    const fetchedUser = await getUserById(userId);
    const userShopCart = await getShopCartByUserId(userId);

    if (fetchedUser.id === req.user.id || req.user.isAdmin) {
      res.send(userShopCart)
    } else if (!userShopCart) {
      next({
        name: "Order does not exist",
        message: "There is no shopcart for this user"
      });
    } else {
      next({
        name: 'Unauthorized Access Error',
        message: 'You must be the owner of the account or an admin to perform this function'
      })
    }
  } catch ({ name, message }) {
    next({ name, message })
  }
});

// PATCH /api/users/setAdmin
usersRouter.patch('/setAdmin', requireAdmin, async (req, res, next) => {
  const { username } = req.body;

  try {
    const adminResults = await toggleAdmin(username)
    res.send(adminResults)
  } catch ({ name, message }) {
    next({ name, message })
  }
})

// PATCH /api/users/deactivate
usersRouter.patch('/deactivate', requireUser, async (req, res, next) => {
  const { username } = req.body
  try {
    const fetchedUser = await getUserByUsername(username)

    if (fetchedUser.id === req.user.id || req.user.isAdmin) {
      const deactUser = await deleteUser(username)
      res.send(deactUser)
    } else {
      next({
        name: 'Unauthorized Access Error',
        message: 'You must be the owner of the account or an admin to perform this function'
      })
    }
  } catch ({ name, message }) {
    next({ name, message })
  }
})

module.exports = usersRouter;