const { client } = require('./client')
const { getProductById } = require('./products')

async function createShopCart({userId}) {
    try {
        const {rows: [shopcart]} = await client.query(`
        INSERT INTO shopcart ("userId", "cartStatus")
        VALUES ($1, $2)
        RETURNING *;
    `, [userId, "standby"]);

    return shopcart
    } catch (error) {
        console.error
    }
};

// get products by cart -select * from items where cartid=$1 cartid
async function getCartItemsById(cartId) {
    try {
        const { rows: [result] } = await client.query(`
            SELECT * FROM "cartItems"
            WHERE "cartId"=$1
            RETURNING *;
        `, [cartId]);

        return result
    } catch (error) {
        console.error
    }
}


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


// update cartitems quantity
async function updateCart({quantity, productId, cartId}) {
    try {
        const {rows: [result] } = await client.query(`
            UPDATE "cartItems"
            SET quantity=$1
            WHERE "productId"=$2
            AND "cartId"=$3
            RETURNING *;
        `, [quantity, productId, cartId]);

        return result
    } catch (error) {
        console.error
    }
}

async function updateCartStatus({cartStatus, cartId}) {

    try {
        const {rows: [result] } = await client.query(`
            UPDATE shopcart
            SET "cartStatus"=$1
            WHERE "cartId"=$2
            RETURNING *;
        `, [cartStatus, cartId]);

        return result
    } catch (error) {
        console.error
    }
}

// delete product from cart (cartitems) 
async function removeProductFromCart({productId, cartId}) {
    const addProd = await getProductById(productId)
    try {
        await client.query(`
            DELETE from "cartItems"
            WHERE "productId"=$1
            AND "cartId"=$2;
        `, [productId, cartId]);

        console.log(`Successfully deleted ${addProd.name} from cart`);
    } catch (error) {
        console.error
    }
}

module.exports = { addProductToCart, updateCart, removeProductFromCart, createShopCart, getCartItemsById, updateCartStatus }