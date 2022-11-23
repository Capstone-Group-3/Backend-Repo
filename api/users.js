const express = require('express');
const router = express.Router();
const { getAllUsers, getUserByUsername, getUser, createUser } = require('../db/users');
const usersRouter = express.Router();
const jwt = require('jsonwebtoken');
const {JWT_SECRET} = process.env;

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
      const token = jwt.sign({ username: username, id: user.id}
        , JWT_SECRET,{
        expiresIn:"1w"})

        req.user = user;
        res.send({ message: "you're logged in!", token: token });
      } else {
        next({ 
          name: 'IncorrectCredentialsError', 
          message: 'Username or password is incorrect'
        });
      }
    } catch(error) {
      console.log(error);
      next(error);
    }
  });

  usersRouter.post('/register', async (req, res, next) => {
    const { username, password} = req.body;
  
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

      usersRouter.get('/:username/shopcart', async (req, res, next) => {
        const {username} = req.params;
        try{
          const userShopCart = await getShopCartByUser(username);
          if(!username) {
            next({
              username: "username does not exist",
              shopcart: "shopcart dose not exist",
              message: "There is no shopcart for this user"
            });
            res.send(userShopCart)
          }
        } catch ({message}) {
          return (username)
        }
      });
 

module.exports = usersRouter;