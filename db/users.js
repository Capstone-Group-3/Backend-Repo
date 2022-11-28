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
            SELECT id, username, "isAdmin"
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
   
    async function getUserByEmail(
        email,
    ){
        console.log("gettingUserByEmail...")
        try{
            if (!email){
                return null
            }
            const { rows: [ user ] } = await client.query(`
                SELECT * FROM users WHERE email=${email}
                `);
            return user;
        } catch(error){
        console.log("error getting user by email");
        }
    }
}

// update user
async function updateUser(id, fields={}) {
    const keys = Object.keys(fields);
    const values = Object.values(fields);

    const setString = keys.map(
        (key, index) => `"${ key }"=$${ index + 1 }`
      ).join(', ');
    
      if (setString.length === 0) {
        return
      };

      try {
        const { rows: [result] } = await client.query(`
            UPDATE users
            SET ${ setString }
            WHERE id=${id}
            RETURNING *;
        `, values);

        return result
      } catch (error) {
        console.error
      }
}

async function deleteUser({username, password}) {
    try {
        const fetchedUser = await getUser({username, password})
        
        await client.query(`
            DELETE FROM users
            WHERE username=$1;
        `, [fetchedUser.username]);

        console.log(`User ${fetchedUser.username} successfully deleted`);
    } catch (error) {
        console.error
    }
}

module.exports = { createUser, getUser, getUserById, getUserByUsername, toggleAdmin, updateUser, deleteUser }