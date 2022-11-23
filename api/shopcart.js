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
     
module.exports = shopcartRouter;