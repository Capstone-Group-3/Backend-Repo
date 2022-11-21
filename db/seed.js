const { client } = require('./client')

async function dropTables(){
    try {
        await client.query(`
            DROP TABLE IF EXISTS "shopCart";
            DROP TABLE IF EXISTS products;
            DROP TABLE IF EXISTS users;
        `);
    } catch (error) {
        console.log(error)
    }
}

async function createTables(){
    try {
        await client.query(`
            CREATE TABLE users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                "isAdmin" BOOLEAN DEFAULT FALSE
            );
            CREATE TABLE products (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) UNIQUE NOT NULL,
                description VARCHAR(255),
                price NUMBER NOT NULL
            );
            CREATE TABLE "shopCart" (
                id SERIAL PRIMARY KEY,
                "userId" INTEGER REFERENCE users(id),
                "productId" INTEGER REFERENCE products(id),
                count INTEGER NOT NULL,
                price NUMBER NOT NULL,
                "orderHistory BOOLEAN DEFAULT false
            );
        `)
    } catch (error) {
        console.log(error)
    }
}

async function createInitialUsers(){
    try {
        
    } catch (error) {
        console.log(error)
    }
}

async function resetDB(){
    try {
        client.connect();

        await dropTables();
        await createTables();
        // await 
        client.end();
    } catch (error){
        console.log(error)
    }
}

resetDB();