const express = require('express');
const { getAllUsers, getUserByUsername, getUser, createUser, getUserById, toggleAdmin, deleteUser } = require('../db/users');
const { getShopCartByUserId } = require('../db/shopcart')
const usersRouter = express.Router();
const jwt = require('jsonwebtoken');
const { requireUser, requireAdmin } = require('./utilities');
const { JWT_SECRET } = process.env;

// USE /api/users

// POST /api/users/login

// POST /api/users/register

// GET /api/users/me

// GET /api/users/:username/shopcart

usersRouter.use((req, res, next) => {
  console.log("A request is being made to /users");

  next(); // THIS IS DIFFERENT
});

// const { getUserByUsername } = require('../db');

// UPDATE
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
    console.log("this is my user obj", user);

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
  } catch (error) {
    console.log(error);
    next(error);
  }
});

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
  } catch (error) {
    console.log(error)
  }
});

// usersRouter.post('/me', requireUser, async (req, res, next) =>{

//   const {userId} = req.body;

//   try {
//     if(req.user.id === userId) {
//       const userData = await getUserById(userId)
//       res.send({userData})
//     } else {
//       next({
//         name: "Unauthorized user error",
//         message: "You are not authorized to view this user's details"
//       })
//     }
//   } catch (error) {
//     console.log(error)
//   }
// })

usersRouter.get("/me", requireUser, async (req, res, next) => {
  try {
    const response = req.user
    res.send(response)
  } catch ({ name, message }) {
    next({ name, message })
  }
});

// usersRouter.get('/users', async (req, res, next) => {
//     try {
//       const token = jwt.sign({username}, process.env.JWT_SECRET, {expiresIn:'1w'});
//       const currentUser = await getAllUsers({username,token});
//         if(!token) {
//           next({
//             message: "Invalid credentials"
//           })
//           res.send({currentUser})
//         } 
//       } catch (error) {
//           next(error);
//         }
//   });

usersRouter.get('/orders', async (req, res, next) => {
  const { userId } = req.body
  try {
    const userShopCart = await getShopCartByUserId(userId);
    if (!userShopCart) {
      next({
        name: "Order does not exist",
        message: "There is no shopcart for this user"
      });
    }
    res.send(userShopCart)
  } catch ({ name, message }) {
    next({ name, message })
  }
});

usersRouter.patch('/setAdmin', requireAdmin, async (req, res, next) => {
  const { username } = req.body;

  try {
    const adminResults = await toggleAdmin(username)
    res.send(adminResults)
  } catch (error) {
    console.log(error)
  }
})

usersRouter.patch('/deactivate', requireUser, async (req, res, next) => {
  const { username } = req.body
  try {
    const deactUser = await deleteUser(username)
    res.send(deactUser)
  } catch (error) {
    console.error
  }
})

module.exports = usersRouter;