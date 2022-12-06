const { client, red } = require('./client')
const { createUser, getUserByUsername, getUserById, toggleAdmin, getUser, createProduct, getProductById, deleteProduct, addProductToCart } = require('./index')


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
                "isActive" BOOLEAN DEFAULT TRUE,
                image VARCHAR(255)  
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
        await createUser({ username: "Greg", password: "Notgreg" })
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
        await createProduct({ name: "holey pants", description: "Yeah I stole this from the set of Fresh Prince, what about it?", price: 11000.55, quantity: 1, image: "https://s1.r29static.com/bin/entry/a14/960xbm,70/1870172/image.jpg" })
        await createProduct({ name: "T-shirt with the pope's face", description: "As title says. I thought these would sell better,", price: 5.99, quantity: 50, image: "https://d1w8c6s6gmwlek.cloudfront.net/teesbybee.com/products/167/073/16707380.png" })
        await createProduct({ name: "JNKO jeans", description: "uncovered in a time capsule beneath Washington High School, they'll be popular soon probably", price: 19.85, quantity: 20, image: "https://media.gq.com/photos/587e7c7c57b572032fe7f482/1:1/w_744,h_744,c_limit/jnco-jean-comeback-tout.jpg" })
        await createProduct({ name: "Goku Watch", description: "The new swag, made for cool people only.", price: 49.99, quantity: 72, image: "https://image-cdn.hypb.st/https%3A%2F%2Fhypebeast.com%2Fimage%2F2022%2F08%2Fswatch-dragon-ball-z-watch-collaboration-collection-info-01.jpg?q=75&w=800&cbr=1&fit=max" })
        await createProduct({ name: "Pikachu backpack", description: "Bright shinning yellow pikachu!", price: 1337.00, quantity: 22, image: "https://i5.walmartimages.com/asr/70638c05-a861-486c-b4a3-dad53a96da49_1.b19981fc4bb9e0aa40f1527afb76a921.jpeg" })
        await createProduct({ name: "John Cena T-Shirt", description: "A shirt with absolutely nothing on it!", price: 1300.59 , quantity: 10, image: "https://images.cubebik.com/2021/06/070621-034430-CubeBik-Image-934-768x768.jpg" })
        await createProduct({ name: "McLovin T-Shirt", description: "the man, the myth, the legend Fogell!", price: 184.32 , quantity: 50, image: "https://i.etsystatic.com/24858060/r/il/d4a068/3972332822/il_570xN.3972332822_gqbd.jpg" })
        await createProduct({ name: "Grinch Shorts", description: "Yup! Exactly what the name says.", price: 67.21, quantity: 32, image: "https://ae01.alicdn.com/kf/H85e53d72a7b742e9a471228ad79c3fe2p.jpg" })
        await createProduct({ name: "Spiderman Socks", description: "Red and Blue socks with minor webs.", price: 33.33, quantity: 100, image: "https://m.media-amazon.com/images/I/614zOxCmGLL._AC_UY1000_.jpg" })
        await createProduct({ name: "Green T-Shirt", description: "Just a shirt that's green.", price: 47.24, quantity: 400, image: "https://i.pinimg.com/originals/0e/a6/26/0ea626e5a9fdc7173ac150a68b618892.jpg" })
        await createProduct({ name: "Nike Joggers", description: "Joggers with a high quality check.", price: 233.22, quantity: 100, image: "https://static.nike.com/a/images/t_default/825748e2-e276-4083-8aaa-cfb99146103f/sportswear-club-fleece-joggers-KflRdQ.png" })
        await createProduct({ name: "Gucci BackPack", description: "The most exquisite item we have", price: 15000.32, quantity:5, image: "https://images.vestiairecollective.com/cdn-cgi/image/w=500,h=500,q=80,f=auto,/produit/black-leather-gucci-backpack-19856004-1_4.jpg" })
        await createProduct({ name: "Zebra Shorts", description: "One of a kind type of pattern!", price: 500.99 , quantity:60, image: "https://www.baumsdancewear.com/wp-content/uploads/2017/01/zshorts.jpg" })
        await createProduct({ name: "Yellow Socks", description: "Bright yellow socks to match the sun.", price: 421.73, quantity:200, image: "https://i.etsystatic.com/30829937/r/il/0ea22e/3500455793/il_fullxfull.3500455793_7fx2.jpg" })
        await createProduct({ name: "Rolex Watch", description: "A watch that is ahead of its time.", price: 10000.99 , quantity:10, image: "https://cdn2.chrono24.com/images/uhren/24814180-881dknnpcncvw093k4qsaekh-ExtraLarge.jpg" })
        await createProduct({ name: "Levi Jeans", description: "Basic nice quality jeans!", price: 139.99 , quantity:100, image: "https://hips.hearstapps.com/vader-prod.s3.amazonaws.com/1631802925-levi-jeans-502-1631801280.jpg" })
        await createProduct({ name: "Special T-Shirt", description: "This is not a regular T-Shirt it has some magic to it.", price: 1000.99 , quantity:25, image: "https://www.darklandsberlin.com/wp-content/uploads/2020/12/2020-AW_0285-scaled.jpg" })
        await createProduct({ name: "Drake & Josh T", description: "Yup, just the greatest show on a T-Shirt.", price: 500.99 , quantity:500, image: "https://i.etsystatic.com/22756672/r/il/98d0e9/2324076619/il_570xN.2324076619_net1.jpg" })
        await createProduct({ name: "Kevin Malone T-Shirt", description: "The smartest person on a T-Shirt", price: 249.99 , quantity:50, image: "https://i.etsystatic.com/26267173/r/il/b35ec2/3249425316/il_570xN.3249425316_plt8.jpg" })
        await createProduct({ name: "Chicago Bulls Pants", description: "Rep your favorite team!", price: 699.99, quantity:70, image: "https://pa.namshicdn.com/product/48/0113/v1/1-zoom-desktop.jpg" })
        await createProduct({ name: "Ninja T-Shirt", description: "get your favorite fortnite star T-Shirt", price: 149.99 , quantity:100, image: "https://i.ebayimg.com/images/g/t4QAAOSw50Jh3ets/s-l500.jpg" })
    } catch (error) {
        console.log(red, `${error}`);
    }
}

async function initialProdAdds() {
    try {
        await addProductToCart(1, 1, 1)
        await addProductToCart(1, 2, 1)
        await addProductToCart(1, 3, 1)
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