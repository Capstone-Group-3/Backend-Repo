const express = require('express');
const { getAllProducts, createProduct, getProductById, updateProduct, deleteProduct } = require('../db/products');
const productsRouter = express.Router();
const { requireAdmin, requireUser } = require("./utilities")

// GET /api/products
productsRouter.get("/", async (req, res, next) => {
    const allProducts = await getAllProducts();

    res.send(allProducts);
});

// POST /api/products
productsRouter.post("/",requireUser, requireAdmin, async (req, res, next) => {
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
productsRouter.patch("/:productId",requireUser, requireAdmin, async (req, res, next) => {
    
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
    const { productId } = req.params
    try {
        const deletedProduct = await deleteProduct(productId)
        console.log("deleted product: ", deletedProduct);
        res.send({message: "Successfully deleted"})
    } catch ({name, message}) {
        next({name, message})
    }
})

module.exports = productsRouter;


