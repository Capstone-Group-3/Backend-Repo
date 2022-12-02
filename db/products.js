const { client } = require('./client')
const { red } = require('./client')


async function createProduct({ name, description, price, quantity }) {
    try {
        const { rows: [result] } = await client.query(`
            INSERT INTO products(name, description, price, quantity)
            VALUES ($1,$2,$3,$4)
            RETURNING *;
        `, [name, description, price, quantity])

        return result
    } catch (error) {
        console.log(red, `${error}`);
    }
}

async function getAllProducts() {
    try {
        const { rows } = await client.query(`
            SELECT * FROM products;
        `)

        return rows
    } catch (error) {
        console.log(red, `${error}`);
    }
}

async function getProductById(id) {
    try {
        const { rows: [result] } = await client.query(`
            SELECT * FROM products
            WHERE id=$1;
        `, [id])
        return result
    } catch (error) {
        console.log(red, `${error}`);
    }
}

async function getProductByName(name) {
    try {
        const { rows: [products] } = await client.query(`
            SELECT * FROM products
            WHERE "name" =${name}
            RETURNING *
        `)
        return products
    } catch (error) {
        console.log(red, `${error}`);
    }
}

async function updateProduct(id, fields = {}) {

    const setString = Object.keys(fields).map(
        (key, index) => `"${key}"=$${index + 1}`
    ).join(', ');

    if (setString.length === 0) {
        return;
    }

    try {
        const { rows: [result] } = await client.query(`
            UPDATE products
            SET ${setString}
            WHERE id=$2
            RETURNING *;
            `, [...Object.values(fields), Object.keys(fields).length + 1]);

        return result
    } catch (error) {
        console.log(red, `${error}`);
    }
};

// this delete function -- active/inactive status to aid with sales and tax purposes
// where prodid=$1 AND isactive=true   then delete to keep in old carts/orders already processed
// update from active true to false where id=$1
async function deleteProduct(id) {
    try {
        const { rows } = await client.query(`
            SELECT id FROM shopcart
            WHERE "cartStatus" = 'standby';
        `)
        const activeCarts = rows.map(element => {
            const indivCartId = element.id;
            const cartPromise = client.query(`
                DELETE FROM "cartItems"
                WHERE "cartId" = $1
                AND "productId" = $2
                RETURNING*;
            `, [indivCartId, id])
            return cartPromise
        })
        // const resolvedPromises = await Promise.all(activeCarts)
        await client.query(`
            UPDATE products
            SET "isActive"=false
            WHERE "id"=$1
            RETURNING *;
        `, [id])
        return rows
    } catch (error) {
        console.log(red, `${error}`);
    }
};

module.exports = { createProduct, updateProduct, getAllProducts, getProductById, getProductByName, deleteProduct }