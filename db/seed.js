const { client } = require('./client')
const { red } = require('./client')
const { createUser, getUserByUsername, getUserById, toggleAdmin, getUser } = require('./users')
const { createProduct, getProductById, deleteProduct } = require('./products')
const { addProductToCart } = require('./shopcart')


async function dropTables() {
    try {
        console.log("dropping tables...")
        await client.query(`
            DROP TABLE IF EXISTS "cartItems";
            DROP TABLE IF EXISTS shopcart;
            DROP TABLE IF EXISTS products;
            DROP TABLE IF EXISTS users;
        `);
    } catch (error) {
        console.log(red, `${error}`);
    }
}

async function createTables() {
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
        console.log(red, `${error}`);
    }
}

async function createInitialUsers() {
    try {
        console.log('creating begining users...')
        await createUser({ username: "Prestest", password: "Prespass" })
        await toggleAdmin("Prestest")
        await createUser({ username: "Nicktest", password: "Nickpass" })
        await toggleAdmin("Nicktest")
        await createUser({ username: "Emirtest", password: "Emirpass" })
        await toggleAdmin("Emirtest")
        await createUser({ usernmae: "Greg", password: "Notgreg" })
        await createUser({ username: "Sam", password: "Notsam" })
        await createUser({ username: "Dylan", password: "Notdylan" })
        await createUser({ username: "Bill", password: "NotBill" })
        await createUser({ username: "Izzy", password: "NotIzzy" })
        await createUser({ username: "Ethan", password: "Notethan" })
        await createUser({ username: "Ben", password: "Notben" })

    } catch (error) {
        console.log(red, `${error}`);
    }
}

async function createInitialProducts() {
    console.log('creating initial products...')
    try {
        await createProduct({ name: "holey pants", description: "Yeah I stole this from the set of Fresh Prince, what about it?", price: 11000.55, quantity: 1 })
        await createProduct({ name: "T-shirt with the pope's face", description: "As title says. I thought these would sell better,", price: 5.99, quantity: 50 })
        await createProduct({ name: "JNKO jeans", description: "uncovered in a time capsule beneath Washington High School, they'll be popular soon probably", price: 19.85, quantity: 20 })
        await createProduct({ name: "Goku Watch", description: "The new swag, made for cool people only.", price: 49.99, quantity: 72 })
        await createProduct({ name: "Pikachu backpack", description: "Bright shinning yellow pikachu!", price: 1337.00, quantity: 22 })
        await createProduct({ name: "John Cena T-Shirt", description: "A shirt with absolutely nothing on it!", price: 1300.59 , quantity: 10 })
        await createProduct({ name: "McLovin T-Shirt", description: "the man, the myth, the legend Fogell!", price: 184.32 , quantity: 50 })
        await createProduct({ name: "Grinch Shorts", description: "Yup! Exactly what the name says.", price: 67.21, quantity: 32 })
        await createProduct({ name: "Spiderman Socks", description: "Red and Blue socks with minor webs.", price: 33.33, quantity: 100 })
        await createProduct({ name: "Green T-Shirt", description: "Just a shirt that's green.", price: 47.24, quantity: 400 })
        await createProduct({ name: "Nike Joggers", description: "Joggers with a high quality check.", price: 233.22, quantity: 100 })
        await createProduct({ name: "Gucci BackPack", description: "The most exquisite item we have", price: 15000.32, quantity:5 })
        await createProduct({ name: "Zebra Shorts", description: "One of a kind type of pattern!", price: 500.99 , quantity:60 })
        await createProduct({ name: "Yellow Socks", description: "Bright yellow socks to match the sun.", price: 421.73, quantity:200 })
        await createProduct({ name: "Rolex Watch", description: "A watch that is ahead of its time.", price: 10000.99 , quantity:10 })
        await createProduct({ name: "Levi Jeans", description: "Basic nice quality jeans!", price: 139.99 , quantity:100 })
        await createProduct({ name: "Special T-Shirt", description: "This is not a regular T-Shirt it has some magic to it.", price: 1000.99 , quantity:25 })
        await createProduct({ name: "Drake & Josh T", description: "Yup, just the greatest show on a T-Shirt.", price: 500.99 , quantity:500 })
        await createProduct({ name: "Kevin Malone T-Shirt", description: "The smartest person on a T-Shirt", price: 249.99 , quantity:50 })
        await createProduct({ name: "Chicago Bulls Pants", description: "Rep your favorite team!", price: 699.99, quantity:70 })
        await createProduct({ name: "Ninja T-Shirt", description: "get your favorite fortnite star T-Shirt", price: 149.99 , quantity:100 })
    } catch (error) {
        console.log(red, `${error}`);
    }
}

async function initialProdAdds() {
    try {
        await addProductToCart(1, 1, 1)
        await addProductToCart(1, 2, 1)
        await addProductToCart(1, 2, 1)
        await addProductToCart(2, 2, 5)
        await addProductToCart(2, 3, 1)
    } catch (error) {
        console.log(red, `${error}`);
    }
}

async function resetDB() {
    try {
        client.connect();

        await dropTables();
        await createTables();
        await createInitialUsers();
        await createInitialProducts();
        await initialProdAdds();
        console.log("Database reset successful")
        client.end();
    } catch (error) {
        console.log(red, `${error}`);
    }
}

resetDB();