const express = require('express');
const { getAllProducts, createProduct, getProductById, updateProduct } = require('../db/products');
const productsRouter = express.Router();
const { requireUser } = require("./utilities")

// GET /api/products
productsRouter.get("/", async (req, res, next) => {
    const allProducts = await getAllProducts();

    res.send(allProducts);
});

// POST /api/products
productsRouter.post("/", async (req, res, next) => {
    // REQ ADMIN
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
productsRouter.patch("/:productId", async (req, res, next) => {
    // REQ ADMIN
    
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

// DELETE /api/products/:productId

module.exports = productsRouter;


