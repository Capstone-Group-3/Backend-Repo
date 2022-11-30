const { client } = require('./client')
const { red } = require('./client')
const { createUser, getUserByUsername, getUserById, toggleAdmin, getUser } = require('./users')
const { createProduct, getProductById, deleteProduct } = require('./products')
const {addProductToCart} = require('./shopcart')


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
        console.log(red,`${error}`);
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
                email VARCHAR(255) UNIQUE,
                "isAdmin" BOOLEAN DEFAULT FALSE,
                "isActive" BOOLEAN DEFAULT TRUE
            );
            CREATE TABLE products (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) UNIQUE NOT NULL,
                description VARCHAR(255),
                price NUMERIC NOT NULL,
                quantity INTEGER NOT NULL,
                "isActive" BOOLEAN DEFAULT TRUE
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
        console.log(red,`${error}`);
    }
}

async function createInitialUsers(){
    try {
        console.log('creating begining users...')
        await createUser({username: "Prestest", password: "Prespass"})
        await toggleAdmin("Prestest")
        await createUser({username: "Nicktest", password: "Nickpass"})
        await toggleAdmin("Nicktest")
        await createUser({username: "Emirtest", password: "Emirpass"})
        await toggleAdmin("Emirtest")
    } catch (error) {
        console.log(red,`${error}`);
    }
}

async function createInitialProducts(){
    console.log('creating initial products...')
    try {
        await createProduct( { name: "holey pants", description: "Yeah I stole this from the set of Fresh Prince, what about it?", price: 11000.55, quantity: 1 } )
        await createProduct( { name: "T-shirt with the pope's face", description: "As title says. I thought these would sell better,", price: 5.99, quantity: 50 } )
        await createProduct( { name: "JNKO jeans", description: "uncovered in a time capsule beneath Washington High School, they'll be popular soon probably", price: 19.85, quantity: 20 } )
    } catch (error) {
        console.log(red,`${error}`);
    }
}

async function initialProdAdds(){
    try {
        await addProductToCart({cartId: 1, productId:1})
    } catch (error) {
        console.log(red,`${error}`);
    }
}

async function resetDB(){
    try {
        client.connect();

        await dropTables();
        await createTables();
        await createInitialUsers();
        await createInitialProducts();
        await initialProdAdds();
        console.log("Database reset successful")
        client.end();
    } catch (error){
        console.log(red,`${error}`);
    }
}

resetDB();
