const { client } = require('./client')

async function createProduct( { name, description, price, quantity } ) {
    try {
        const { rows: [ result ] } = await client.query(`
            INSERT INTO products(name, description, price, quantity)
            VALUES ($1,$2,$3,$4)
            RETURNING *;
        `, [ name, description, price, quantity ])

        return result
    } catch (error) {
        console.error
    }
}

async function getAllProducts (){
    try {
        const { rows } = await client.query(`
            SELECT * FROM products;
        `)

        return rows
    } catch (error) {
        console.error
    }
}

async function getProductById(id) {
    try {
        const {rows: [result]} = await client.query(`
            SELECT * FROM products
            WHERE id=$1;
        `, [id])
        return result
    } catch (error) {
        console.error
    }
}

async function getProductByName(name){
    try {
        const {rows: [products]} = await client.query(`
            SELECT * FROM products
            WHERE "name" =${name}
            RETURNING *
        `)
        return products
    } catch (error) {
        console.error
    }
}

async function updateProduct(id, fields={}){
    
    const setString = Object.keys(fields).map(
        (key, index) => `"${ key }"=$${ index + 1 }`
      ).join(', ');
    
      if (setString.length === 0) {
        return;
      }

    try {
        const {rows: [result]} = await client.query(`
            UPDATE products
            SET ${ setString }
            WHERE id=${id}
            RETURNING *;
            `, Object.values(fields));

        return result
    } catch (error) {
        console.error
    }
};

// this delete function
async function deleteProduct({id}){
    try {
        await client.query(`
            DELETE FROM "cartItems"
            WHERE "productId"=$1
            RETURNING *;
        `, [id]);
        await client.query(`
            DELETE FROM products
            WHERE id=$1;
        `, [id])
    } catch (error) {
        console.error
    }
};

module.exports = { createProduct, updateProduct, getAllProducts, getProductById, getProductByName, deleteProduct }