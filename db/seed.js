const { client } = require('./client')
const { createUser, getUserByUsername, getUserById, toggleAdmin } = require('./users')

async function dropTables(){
    try {
        console.log("dropping tables...")
        await client.query(`
            DROP TABLE IF EXISTS "cartItems";
            DROP TABLE IF EXISTS shopcart;
            DROP TABLE IF EXISTS products;
            DROP TABLE IF EXISTS users;
        `);
    } catch (error) {
        console.log(error)
    }
}

async function createTables(){
    try {
        console.log('creating tables...')
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
                price NUMERIC NOT NULL,
                quantity INTEGER NOT NULL
            );
            CREATE TABLE shopcart (
                id SERIAL PRIMARY KEY,
                "userId" INTEGER REFERENCES users(id),
                "cartStatus" VARCHAR(255) NOT NULL
            );
            CREATE TABLE "cartItems" (
                id SERIAL PRIMARY KEY,
                "cartId" INTEGER REFERENCES shopcart(id),
                "productId" INTEGER REFERENCES products(id),
                "priceBoughtAt" NUMERIC NOT NULL,
                quantity INTEGER NOT NULL
            );
        `)
    } catch (error) {
        console.log(error)
    }
}

async function createInitialUsers(){
    try {
        console.log('creating begining users...')
        await createUser({username: "Prestest", password: "Prespass"})
        await toggleAdmin("Prestest")
        await createUser({username: "Nicktest", password: "Nickpass"})
        await createUser({username: "Emirtest", password: "Emirpass"})
    } catch (error) {
        console.log(error)
    }
}



async function resetDB(){
    try {
        client.connect();

        await dropTables();
        await createTables();
        await createInitialUsers();
        client.end();
    } catch (error){
        console.log(error)
    }
}

resetDB();
