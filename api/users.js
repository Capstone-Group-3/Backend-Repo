const express = require('express');
const router = express.Router();
const { JWT_SECRET } = process.env;

// POST /api/users/login

// POST /api/users/register

// GET /api/users/me

// GET /api/users/:username/shopcart

usersRouter.use((req, res, next) => {
    console.log("A request is being made to /users");
  
    next(); // THIS IS DIFFERENT
  });
  
  const { getUserByUsername } = require('../db');
  
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
        const user = await getUserByUsername(username);
    
        if (user && user.password == password) {
          // create token & return to user
          res.send({ message: "you're logged in!" });
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
      const { username, password, name, location } = req.body;
    
      try {
        const _user = await getUserByUsername(username);
    
        if (_user) {
          next({
            name: 'UserExistsError',
            message: 'A user by that username already exists'
          });
        }
    
        const user = await createUser({
          username,
          password,
          name,
          location,
        });
    
        const token = jwt.sign({ 
          id: user.id, 
          username
        }, process.env.JWT_SECRET, {
          expiresIn: '1w'
        });
    
        res.send({ 
          message: "thank you for signing up",
          token 
        });
      } catch ({ name, message }) {
        next({ name, message })
      } 
    });

    usersRouter.get('/users', async (req, res, next) => {
        const { username } = req.params;
        try {
          const token = jwt.sign({username}, process.env.JWT_SECRET, {expiresIn:'1w'});
          const currentUser = await getAllUsers({username,token});
            if(!token) {
              next({
                message: "Invalid credentials"
              })
              res.send({currentUser})
            } 
          } catch (error) {
              next(error);
            }
      });

      usersRouter.get('/:username/shopcart', async (req, res, next) => {
        const {username} = req.params;
        try{
          const userShopCart = await getShopCartByUser(username);
          if(!username) {
            next({
              username: "username does not exist",
              routines: "shopcart dose not exist",
              message: "There are no shopcart for this user"
            });
            res.send(userShopCart)
          }
        } catch ({message}) {
          return (username)
        }
      });
 

module.exports = router;