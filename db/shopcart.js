const { client } = require('./client')
const { getProductById } = require('./products')

async function addProductToCart({cartId, productId}){
    try {
        const addProd = await getProductById(productId)
        const { rows: [result] } = await client.query(`
            INSERT INTO "cartItems" ("cartId", "productId", "priceBoughtAt", quantity)
            VALUES ($1,$2,$3,$4)
            RETURNING *;
        `, [cartId, productId, addProd.price, addProd.quantity])
        return result
    } catch (error) {
        console.error
    }
};

// update quantity
// delete product from order

module.exports = { addProductToCart }