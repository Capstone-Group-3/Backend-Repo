const express = require('express');
const router = express.Router();
const shopcartRouter = express.Router();
const {createShopCart, updateCart, updateCartStatus, removeProductFromCart, getProductsByCartId }= require('../db/shopcart')
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
               
shopcartRouter.patch('/:shopcartId/status', requireUser, async (req, res, next) => {
  const { cartId } = req.params;
  const { cartStatus } = req.body;
    try {
      if (req.user) {
        const updatedShopCart = await updateCartStatus({cartStatus, cartId});
        res.send({ shopcart: updatedShopCart });
      } else {
        next({
          name: "User Not Logged In",
          message: "Login to update activity",
        });
      }
    } catch ({ name, description }) {
      next({ name, description });
    }
});

// Set route to change quantity in cartitems, (quantity, productId, cartId)
shopcartRouter.patch('/:shopcartId/items/quantity'), requireUser, async(req, res, next) =>{
  const { cartId }= req.params
  const { productId, quantity } = req.body
  try {
    const updatedProductCount = await updateCart(quantity, productId, cartId)
    res.send({product: updatedProductCount})
  } catch (error) {
    console.error
  }
}

shopcartRouter.delete('/:shopcartId/items/remove'), requireUser, async(req, res, next) =>{
  const { cartId } = req.params
  const {productId} = req.body
  try {
    const removedItem = await removeProductFromCart({productId, cartId})
    res.send(removedItem)
  } catch (error) {
    console.error
  }
}
     
module.exports = shopcartRouter;