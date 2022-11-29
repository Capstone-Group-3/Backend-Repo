const express = require('express');
const shopcartRouter = express.Router();
const {createShopCart, updateCart, updateCartStatus, removeProductFromCart, getProductsByCartId }= require('../db/shopcart')
const { requireUser } = require("./utilities")

// GET /api/shopcart/:shopcartId/products

// GET /api/shopcart

// POST /api/shopcart

// PATCH /api/shopcart/:shopcartId

// what does each of these routers do?

// Get every product from an order
shopcartRouter.get('/:shopcartId', async (req, res, next) => { 
    const { shopcartId } = req.params;

    try {
        const product = await getProductsByCartId(shopcartId);
        console.log("product: ", product)
        if (product.length === 0)
          res.send({
            name: 'Order not Found',
            message: `Order ${shopcartId} not found`
        });
            res.send(product);
        } catch ({name, message}) {
            next({name, message});
        }
    });

// shopcartRouter.get('/', async (req, res) => {
//         const shopcart = await getAllShopCart();
//         res.send({ shopcart });
//       });
      
// make a new cart
shopcartRouter.post('/', requireUser, async (req, res, next) => {
        const { userId } = req.body; // edit this later to also req user
        
        try {
            const shopcart = await createShopCart({userId});
            res.send(shopcart);
          } catch (error) {
            next(error);
          }
      });
    
// changes status of order      
shopcartRouter.patch('/:shopCartId/status', requireUser, async (req, res, next) => {
  const { shopCartId } = req.params;
  const { cartStatus } = req.body;
    try {
      if (req.user) {
        const updatedShopCart = await updateCartStatus(cartStatus, shopCartId);
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
shopcartRouter.patch('/:shopCartId/quantity', requireUser, async(req, res, next) =>{
  const { shopCartId }= req.params
  const { productId, quantity } = req.body
  try {
    console.log("params: ", shopCartId);
    const updatedProductCount = await updateCart(quantity, productId, shopCartId)
    res.send(updatedProductCount)
  } catch (error) {
    console.error
  }
});

// remove a product from an order
shopcartRouter.delete('/:shopCartId/remove', requireUser, async(req, res, next) =>{
  const { shopCartId } = req.params
  const {productId} = req.body
  try {
    const removedItem = await removeProductFromCart({productId, shopCartId})
    res.send(removedItem)
  } catch (error) {
    console.error
  }
});
     
module.exports = shopcartRouter;