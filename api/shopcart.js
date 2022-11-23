const express = require('express');
const router = express.Router();
const shopcartRouter = express.Router();

// GET /api/shopcart/:shopcartId/products

// GET /api/shopcart

// POST /api/shopcart

// PATCH /api/shopcart/:shopcartId


shopcartRouter.get('/:shopcartId/products', async (req, res, next) => {
    try {
        const id = req.params;
        const product = await getProductShopCartById(id);
        if (product.length === 0)
          res.send({
            message: `ShopCart ${id} not found`,
            name: 'ShopCart not found Error',
            error: 'ShopCart dose not  exist',
        });
            res.send({product});
        } catch (error) {
            next(error);
        }
    });

shopcartRouter.get('/', async (req, res) => {
        const shopcart = await getAllShopCart();
        res.send({ shopcart });
      });
      

    shopcartRouter.post('/', requireUser, async (req, res, next) => {
        const { name, description, } = req.body;
        const shopcart = await createShopCart(shopcartData);
          
        const shopcartData = { name, description };
        try {
        if  (!shopcart) {
          next({
            name: "ErrorGettingShopCart",
            message: "ShopCart does not exist",
          });
        }
            res.send(shopcart);
          } catch (error) {
            next(error);
          }
      });
               
    shopcartRouter.patch('/:shopcartId', async (req, res, next) => {
            const { shopcartId } = req.params;
            const { name, description } = req.body;
            
            const updateFields = {};
      
            if (name) {
              updateFields.name = name;
            }
            
            if (description) {
              updateFields.description = description;
            }
            try {
              if (req.user) {
                const updatedShopCart = await updateShopCart(shopcartId, updateFields);
                res.send({ shopcart: updatedShopCart });
              } else {
                next({
                  name: "UserNotLoggedIn",
                  message: "Login to update activity",
                });
              }
            } catch ({ name, description }) {
              next({ name, description });
            }
          });
     
module.exports = shopcartRouter;