const express = require('express');
const router = express.Router();
const shopcartRouter = express.Router();
const {createShopCart, updatedShopCart, updateCart }= require('../db/shopcart')
const { requireUser } = require("./utilities")

// GET /api/shopcart/:shopcartId/products

// GET /api/shopcart

// POST /api/shopcart

// PATCH /api/shopcart/:shopcartId


shopcartRouter.get('/:shopcartId/products', async (req, res, next) => {
    try {
        const id = req.params;
        const product = await getProductsByCartId(id);
        if (product.length === 0)
          res.send({
            name: 'Order not Found',
            message: `Order ${id} not found`
        });
            res.send({product});
        } catch ({name, message}) {
            next({name, message});
        }
    });

// shopcartRouter.get('/', async (req, res) => {
//         const shopcart = await getAllShopCart();
//         res.send({ shopcart });
//       });
      

shopcartRouter.post('/', requireUser, async (req, res, next) => {
        const { userId } = req.body;
        
        try {
            const shopcart = await createShopCart({userId});
            res.send(shopcart);
          } catch (error) {
            next(error);
          }
      });
               
shopcartRouter.patch('/:shopcartId', async (req, res, next) => {
  const { shopcartId } = req.params;
  const { cartStatus } = req.body;
    try {
      if (req.user) {
        const updatedShopCart = await /*PlaceholderFunc-updateShopCart*/(shopcartId, cartStatus);
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

// Set route to change quantity in cartitems, (quantity, productId, cartId)
shopcartRouter.patch('/:shopcartId/itemQuantity'), async(req, res, next) =>{
  const { cartId }= req.params
  const { productId, quantity } = req.body
  try {
    const updatedProductCount = await updateCart(quantity, productId, cartId)
    res.send({product: updatedProductCount})
  } catch (error) {
    console.log(error)
  }
}
     
module.exports = shopcartRouter;