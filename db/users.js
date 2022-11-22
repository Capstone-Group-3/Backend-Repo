const { client } = require('./client')

async function createUser( { username, password } ) {
    try {
        const {rows: [user]} = await client.query(`
            INSERT INTO users (username, password)
            VALUES($1, $2)
            ON CONFLICT (username) DO NOTHING
            RETURNING *; 
        `, [username, password])
    } catch (error) {
        console.error
    }
};

async function getUser( { username, password } ) {
    try {
        if(!password){
            return null
        }

        const { rows: [ user ] } = await client.query(`
            SELECT * FROM users
            WHERE username = ${username};
        `)

        if (password!==user.password) {
            return null
        }

        return user
    } catch (error) {
        console.error
    }
}

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
}

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
    console.log(!adminStatus)
    try {
        const { rows:[user] } = await client.query(`
            UPDATE users
            SET "isAdmin" = ${!adminStatus}
            WHERE username = $1
            RETURNING *;
        `,[username])
        console.log('finished')
        return user
    } catch (error) {
        console.error
    }
    
}

module.exports = { createUser, getUser, getUserById, getUserByUsername, toggleAdmin }