const { client } = require('./client')
const bcrypt = require('bcrypt')
const SALT_COUNT = 5

async function createUser( { username, password } ) {
    
    const hashWord= await bcrypt.hash(password, SALT_COUNT)
    
    try {
        const {rows: [user]} = await client.query(`
            INSERT INTO users (username, password)
            VALUES($1, $2)
            ON CONFLICT (username) DO NOTHING
            RETURNING *; 
        `, [username, hashWord])
        const {rows: [shopcart]} = await client.query(`
            INSERT INTO shopcart ("userId", "cartStatus")
            VALUES ($1, $2)
            RETURNING *;
        `, [user.id, "standby"])
        return user, shopcart
    } catch (error) {
        console.error
    }
};

async function getUser( { username, password } ) {
    try {
        if(!password){
            return console.log('pass input failure')
        }
        // has to return password because this function is a log in function,
        //it checks the user.password (below) against the input password
        const { rows: [ user ] } = await client.query(`
            SELECT * FROM users
            WHERE username =$1;
        `,[username])
        
        const passMatch = await bcrypt.compare(password, user.password)
        if (!passMatch) {
            return console.log('matching failure')
        }
        
        return user
    } catch (error) {
        console.error
    }
};

async function getUserById(id) {
    try {
        const { rows: [ user ] } = await client.query(`
            SELECT id, username
            FROM users
            WHERE id = ${id};
        `)
        return user
    } catch (error) {
        console.error
    }
};

async function getUserByUsername(username) {
    try {
        const { rows: [user] } = await client.query(`
            SELECT id, username, "isAdmin"
            FROM users
            WHERE username = $1;
        `,[username])
        return user
    } catch (error) {
        console.error
    }
};

async function toggleAdmin(username) {
    const currentUser=await getUserByUsername(username)
    const adminStatus = currentUser.isAdmin
    try {
        const { rows:[user] } = await client.query(`
            UPDATE users
            SET "isAdmin" = $1
            WHERE username = $2
            RETURNING *;
        `,[!adminStatus, username])
        return user
    } catch (error) {
        console.error
    }
    
};

module.exports = { createUser, getUser, getUserById, getUserByUsername, toggleAdmin }