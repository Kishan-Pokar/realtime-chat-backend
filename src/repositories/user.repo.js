const pool = require('../config/db');

const findUser = async (email) => {
    const query = `SELECT * FROM users
    WHERE email = $1`;

    const { rows } = await pool.query(query, [email]);

    return rows[0] || null;
};


const insertUser = async (user) => {
    const query = `INSERT INTO users (id, username, email, password_hash)
    values ($1, $2, $3, $4)`;
    await pool.query(query, [
        user.id,
        user.username,
        user.email,
        user.password_hash
    ]);
};


module.exports = {
    findUser,
    insertUser,
}