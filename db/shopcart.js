const { client } = require('./client')
const { red } = require('./client')
const { getProductById } = require('./products')

async function createShopCart({ userId }) {
    try {
        const { rows: [shopcart] } = await client.query(`
        INSERT INTO shopcart ("userId", "cartStatus")
        VALUES ($1, $2)
        RETURNING *;
    `, [userId, "standby"]);

        return shopcart
    } catch (error) {
        console.log(red, `${error}`);
    }
};

// get products by cart -select * from items where cartid=$1 cartid
async function getMyProductsByCartStatus(cartStat, id){
    try {
        const {rows} = await client.query(`
            SELECT id FROM shopcart
            WHERE "cartStatus"=$1
            AND "userId" = $2;
        `, [cartStat, id])
        const cartPromises = rows.map(async element =>{
            const indivCartId = element.id;
            const {rows} = await client.query(`
                SELECT * FROM "cartItems"
                WHERE "cartId"=$1;
            `, [indivCartId])
            return rows
        })
        const [ statusCarts ] = await Promise.all(cartPromises)
        return statusCarts
    } catch (error) {
        console.log(red, `${error}`)
    }
}

async function getProductsByCartId(cartId) {
    try {
        const { rows } = await client.query(`
            SELECT * FROM "cartItems"
            WHERE "cartId"=$1;
        `, [cartId]);

        return rows
    } catch (error) {
        console.log(red, `${error}`);
    }
}


async function addProductToCart( cartId, productId ) {
    try {
        const addProd = await getProductById(productId)
        const { rows: [result] } = await client.query(`
            INSERT INTO "cartItems" ("cartId", "productId", "priceBoughtAt", quantity)
            VALUES ($1,$2,$3,$4)
            RETURNING *;
        `, [cartId, productId, addProd.price, addProd.quantity])
        return result
    } catch (error) {
        console.log(red, `${error}`);
    }
};


// update cartitems quantity
async function updateCart(quantity, productId, cartId) {
    try {
        const { rows: [result] } = await client.query(`
            UPDATE "cartItems"
            SET quantity=$1
            WHERE "productId"=$2
            AND "cartId"=$3
            RETURNING *;
        `, [quantity, productId, cartId]);

        return result
    } catch (error) {
        console.log(red, `${error}`);
    }
}

async function updateCartStatus(cartStatus, cartId) {

    try {
        console.log("starting update")
        const { rows: [result] } = await client.query(`
            UPDATE shopcart
            SET "cartStatus"=$1
            WHERE id=$2
            RETURNING *;
        `, [cartStatus, cartId]);

        console.log("result: ", result)
        return result
    } catch (error) {
        console.log(red, `${error}`);
    }
}

async function getShopCartByUserId(userId) {
    try {
        const { rows } = await client.query(`
            SELECT * FROM shopcart
            WHERE "userId"=${userId};
        `)

        return rows
    } catch (error) {
        console.log(red, `${error}`);
    }
}

// delete product from cart (cartitems) 
async function removeProductFromCart({ productId, cartId }) {
    const addProd = await getProductById(productId)
    try {
        await client.query(`
            DELETE from "cartItems"
            WHERE "productId"=$1
            AND "cartId"=$2;
        `, [productId, cartId]);

        console.log(`Successfully deleted ${addProd.name} from cart`);
    } catch (error) {
        console.log(red, `${error}`);
    }
}

module.exports = { getMyProductsByCartStatus, addProductToCart, updateCart, removeProductFromCart, createShopCart, getProductsByCartId, updateCartStatus, getShopCartByUserId }