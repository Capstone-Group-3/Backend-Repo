const { client } = require('.client')

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