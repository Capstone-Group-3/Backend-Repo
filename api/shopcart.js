const express = require('express');
const shopcartRouter = express.Router();
const { createShopCart, updateCart, updateCartStatus, removeProductFromCart, getProductsByCartId, addProductToCart } = require('../db/shopcart')
const { requireUser } = require("./utilities")

// All shop carts REQURIE OWNER

// Get every product from an order
// GET /api/shopcart/:shopcartId/
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
  } catch ({ name, message }) {
    next({ name, message });
  }
});


// make a new cart
// POST /api/shopcart
shopcartRouter.post('/', requireUser, async (req, res, next) => {
  const { userId } = req.body;

  try {
    const shopcart = await createShopCart({ userId });
    res.send(shopcart);
  } catch ({ name, message }) {
    next({ name, message })
  }
});

// add an item to a shopping cart
// PATCH /api/shopcart/:shopCartId/add
shopcartRouter.patch('/:shopCartId/add', requireUser, async (req, res, next) => {
  const { shopCartId } = req.params;
  const { productId } = req.body;

  try {
    const addedProduct = await addProductToCart(shopCartId, productId)
    
    res.send({ message: `Successfully added ${productId} to cart number ${shopCartId}` })
  } catch ({ name, message }) {
    next({ name, message })
  }
});

// changes status of order (processed or standby)
// PATCH /api/shopcart/:shopcartId/status
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
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// Set route to change quantity in cartitems, (quantity, productId, cartId)
// PATCH /api/shopcart/:shopcartId/quantity
shopcartRouter.patch('/:shopCartId/quantity', requireUser, async (req, res, next) => {
  const { shopCartId } = req.params
  const { productId, quantity } = req.body
  try {
    console.log("params: ", shopCartId);
    const updatedProductCount = await updateCart(quantity, productId, shopCartId)
    res.send(updatedProductCount)
  } catch ({ name, message }) {
    next({ name, message })
  }
});

// remove a product from an order
// DELETE /api/shopcart/:shopcartId/remove
shopcartRouter.delete('/:shopCartId/remove', requireUser, async (req, res, next) => {
  const { shopCartId } = req.params
  const { productId } = req.body
  try {
    const removedItem = await removeProductFromCart({ productId, shopCartId })
    res.send(removedItem)
  } catch ({ name, message }) {
    next({ name, message })
  }
});

module.exports = shopcartRouter;