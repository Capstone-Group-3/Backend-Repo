const express = require("express");
const shopcartRouter = express.Router();
const {
  createShopCart,
  updateCart,
  updateCartStatus,
  removeProductFromCart,
  getProductsByCartId,
  addProductToCart,
  getMyProductsByCartStatus,
  getShopCartById,
  getShopCartIdByStatus,
} = require("../db/shopcart");
const { requireUser } = require("./utilities");

// gets a user's standby shopcart id, their current shop cart
shopcartRouter.post("/", requireUser, async (req, res, next) => {
  const { userId } = req.body;

  try {
    const fetchedCart = await getShopCartIdByStatus(userId);

    // REQUIRE OWNER FEATURE
    if (fetchedCart.userId == req.user.id || req.user.isAdmin) {
      res.send(fetchedCart);
    } else if (!fetchedCart) {
      next({
        name: "Access Error",
        message: `Shopcart with id ${id} not found`,
      });
    } else {
      next({
        name: "Unauthorized Access Error",
        message:
          "You must be the owner of the account or an admin to perform this function",
      });
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// Get every product from an order
// GET /api/shopcart/:shopcartId/
shopcartRouter.get("/:shopcartId", requireUser, async (req, res, next) => {
  const { shopcartId } = req.params;

  try {
    const product = await getProductsByCartId(shopcartId);
    const fetchedCart = await getShopCartById(shopcartId);

    // REQUIRE OWNER FEATURE
    if (fetchedCart.userId == req.user.id || req.user.isAdmin) {
      res.send(product);
    } else if (product.length === 0) {
      next({
        name: "Order not Found",
        message: `Order ${shopcartId} not found`,
      });
    } else {
      next({
        name: "Unauthorized Access Error",
        message:
          "You must be the owner of the account or an admin to perform this function",
      });
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// get an order by its status- either "standby" or "processed"
// This route is for returning either placed orders for a user to display on their profile = "processed"
// or returning a open order, a shopping cart, for the user to see on the shopping cart page = "standby"
// GET /api/shopcart/:userId/status
shopcartRouter.post("/:userId/status", requireUser, async (req, res, next) => {
  const { userId } = req.params;
  const { cartStatus } = req.body;

  try {
    // problem with promises in db function? all shopcartitems gets returned
    // no return statement at the bottom, and when it's added all promises are pending. Problem with await statements?
    // SOLVED! :)

    // REQUIRE OWNER FEATURE
    if (userId == req.user.id || req.user.isAdmin) {
      const cartByStatus = await getMyProductsByCartStatus(cartStatus, userId);
      res.send(cartByStatus);
    } else {
      next({
        name: "Unauthorized Access Error",
        message:
          "You must be the owner of the account or an admin to perform this function",
      });
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// make a new cart
// POST /api/shopcart
shopcartRouter.post("/newcart", requireUser, async (req, res, next) => {
  const { userId } = req.body;
  console.log("req.body: ", req.body);

  try {
    // REQUIRE OWNER FEATURE
    if (userId == req.user.id || req.user.isAdmin) {
      const shopcart = await createShopCart(userId);
      res.send(shopcart);
    } else {
      next({
        name: "Unauthorized Access Error",
        message:
          "You must be the owner of the account or an admin to perform this function",
      });
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// add an item to a shopping cart -- admins can't do this
// PATCH /api/shopcart/:shopCartId/add
shopcartRouter.patch(
  "/:shopCartId/add",
  requireUser,
  async (req, res, next) => {
    const { shopCartId } = req.params;
    const { productId, quantity } = req.body;

    try {
      const fetchedCart = await getShopCartById(shopCartId);

      // REQUIRE OWNER FEATURE
      if (fetchedCart.userId === req.user.id) {
        const addProductResult = await addProductToCart(
          shopCartId,
          productId,
          quantity
        );

        if (addProductResult != null) {
          res.send({
            message: `Successfully added product ${productId} to cart number ${shopCartId}`,
          });
        } else {
          next({
            name: "Out of stock error",
            message: "That item is out of stock",
          });
        }
      } else {
        next({
          name: "Unauthorized Access Error",
          message:
            "You must be the owner of the account to perform this function",
        });
      }
    } catch ({ name, message }) {
      next({ name, message });
    }
  }
);

// changes status of order (processed or standby) then creates a new cart with status of "standby"
// basically for placing an order
// PATCH /api/shopcart/:shopcartId/status
shopcartRouter.patch(
  "/:shopCartId/status",
  requireUser,
  async (req, res, next) => {
    const { shopCartId } = req.params;
    const { cartStatus } = req.body;
    const userId = req.user.id;

    try {
      const fetchedCart = await getShopCartById(shopCartId);

      // REQUIRE OWNER FUNCTION
      if (fetchedCart.userId === userId) {
        const updatedShopCart = await updateCartStatus(cartStatus, shopCartId);
        const newCart = await createShopCart(userId);
        res.send({ success: `successful checkout for card ${shopCartId}` });
      } else {
        next({
          name: "Unauthorized Access Error",
          message:
            "You must be the owner of the account to perform this function",
        });
      }
    } catch ({ name, message }) {
      next({ name, message });
    }
  }
);

// Set route to change quantity in cartitems, (quantity, productId, cartId)
// PATCH /api/shopcart/:shopcartId/quantity
shopcartRouter.patch(
  "/:shopCartId/quantity",
  requireUser,
  async (req, res, next) => {
    const { shopCartId } = req.params;
    const { productId, quantity } = req.body;
    try {
      const fetchedCart = await getShopCartById(shopCartId);

      // REQUIRE OWNER FUNCTION
      if (fetchedCart.userId === req.user.id) {
        const updatedProductCount = await updateCart(
          quantity,
          productId,
          shopCartId
        );
        res.send(updatedProductCount);
      } else {
        next({
          name: "Unauthorized Access Error",
          message:
            "You must be the owner of the account to perform this function",
        });
      }
    } catch ({ name, message }) {
      next({ name, message });
    }
  }
);

// remove a product from an order
// DELETE /api/shopcart/:shopcartId/remove
shopcartRouter.delete(
  "/:shopCartId/remove",
  requireUser,
  async (req, res, next) => {
    const { shopCartId } = req.params;
    const { productId } = req.body;
    try {
      const fetchedCart = await getShopCartById(shopCartId);

      // REQUIRE OWNER FUNCTION
      if (fetchedCart.userId === req.user.id) {
        const removedItem = await removeProductFromCart(productId, shopCartId);
        res.send({
          message: `Successfully deleted product ${removedItem} from cart`,
        });
      } else {
        next({
          name: "Unauthorized Access Error",
          message:
            "You must be the owner of the account or an admin to perform this function",
        });
      }
    } catch ({ name, message }) {
      next({ name, message });
    }
  }
);

module.exports = shopcartRouter;
