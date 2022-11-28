const express = require('express');
const { getAllProducts, createProduct, getProductById, updateProduct } = require('../db/products');
const productsRouter = express.Router();
const { requireAdmin } = require("./utilities")

// GET /api/products
productsRouter.get("/", async (req, res, next) => {
    const allProducts = await getAllProducts();

    res.send(allProducts);
});

// POST /api/products
productsRouter.post("/", requireAdmin, async (req, res, next) => {
    const { name, description, price, quantity } = req.body;
    const productInfo = {};

    if (name) {
        productInfo.name = name
    };

    if (description) {
        productInfo.description = description
    };

    if (price) {
        productInfo.price = price
    };

    if (quantity) {
        productInfo.quantity = quantity
    };

    try {
        const newProduct = await createProduct(productInfo);

        res.send(newProduct);
    } catch ({name, message}) {
        next({name, message})
    }
});

// PATCH /api/products/:productId
productsRouter.patch("/:productId", requireAdmin, async (req, res, next) => {
    
    // Ask jeremy: should these be on an "admin" route? that way users 
    // wouldn't know what the route is/have access to it at all
    const { productId } = req.params
    const { name, description, price, quantity } = req.body;
    const productInfo = {};

    if (name) {
        productInfo.name = name
    };

    if (description) {
        productInfo.description = description
    };

    if (price) {
        productInfo.price = price
    };

    if (quantity) {
        productInfo.quantity = quantity
    };

    try {
        const updatedProduct = await updateProduct(productId, productInfo);

        res.send(updatedProduct);
    } catch ({name, message}) {
        next({name, message})
    }
})

productsRouter.delete('/:productId', requireAdmin, async(req, res, next)=>{
    const  id  = req.params
    try {
        const deleteProduct = await /*Placeholder Func*/(id)
        res.send({product: deleteProduct})
    } catch (error) {
        console.log(error)
    }
})

module.exports = productsRouter;


