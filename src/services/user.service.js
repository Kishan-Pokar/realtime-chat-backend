const bcrypt = require('bcrypt');
const { findUser,insertUser } = require('../repositories/user.repo');
const { v4:uuidv4 } = require('uuid');

const createUser = async (username,email,password) => {
    const existingUser = await findUser(email);

    if(existingUser){
        return null;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
        id: uuidv4(),
        username,
        email,
        password_hash : hashedPassword,
    };
    await insertUser(newUser);
    delete newUser.password_hash
    return newUser;
};

const findUserbyEmail = async (email) => {
    const user =  await findUser(email);
    return user
}

module.exports = {
    createUser,
    findUserbyEmail,
}