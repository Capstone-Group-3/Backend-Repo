const express = require('express');
const shopcartRouter = express.Router();
const { createShopCart, updateCart, updateCartStatus, removeProductFromCart, getProductsByCartId, addProductToCart, getMyProductsByCartStatus } = require('../db/shopcart')
const { requireUser } = require("./utilities")

// All shop carts REQURIE OWNER

// Get every product from an order
// GET /api/shopcart/:shopcartId/
shopcartRouter.get('/:shopcartId', async (req, res, next) => {
  const { shopcartId } = req.params;
//   const { userId } = req.body

//   if (req.user.id === userId) { 

//   } else {
//     next({
//       name: 'Unauthorized Access Error',
//       message: 'You cannot access a cart that is not yours'
//   })
// } 

// how will we access the shopcartId (cartId) params on the front end? What does that translate to? It references shopcart id but nothing w/ the user 
  try {
    const product = await getProductsByCartId(shopcartId);
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

// get an order by its status- either "standby" or "processed"
// This route is for returning either placed orders for a user to display on their profile = "processed"
// or returning a open order, a shopping cart, for the user to see on the shopping cart page = "standby"
// GET /api/shopcart/:userId/status
shopcartRouter.get('/:userId/status', async (req, res, next) => {
  const { userId } = req.params;
  const { cartStatus } = req.body;

  try {
    const cartByStatus = await getMyProductsByCartStatus(cartStatus, userId)
    // problem with promises in db function? all shopcartitems gets returned 
      // no return statement at the bottom, and when it's added all promises are pending. Problem with await statements?
      // SOLVED! :)
    res.send({ cartByStatus })
  } catch ({ name, message }) {
    next({ name, message });
  }
})

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
  const { productId, quantity } = req.body;

  try {
    await addProductToCart(shopCartId, productId, quantity)
    
    res.send({ message: `Successfully added product ${productId} to cart number ${shopCartId}` })
  } catch ({ name, message }) {
    next({ name, message })
  }
});


// changes status of order (processed or standby) then creates a new cart with status of "standby"
// basically for placing an order
// PATCH /api/shopcart/:shopcartId/status
shopcartRouter.patch('/:shopCartId/status', requireUser, async (req, res, next) => {
  const { shopCartId } = req.params;
  const { cartStatus } = req.body;
  const userId = req.user.id;

  try {
    if (req.user) {
      const updatedShopCart = await updateCartStatus(cartStatus, shopCartId);
      const newCart = await createShopCart({ userId }); // check if this needs to be destructured
      console.log("new cart created: ", newCart)
      res.send({ updatedShopCart });
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