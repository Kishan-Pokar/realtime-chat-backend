const { users } = require('../data/users.store');
const bcrypt = require('bcrypt');


const createUser = async (username,email,password) => {
    const existingUser = users.find(
        (user) => user.email === email
    );

    if(existingUser){
        return null;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
        id: users.length + 1,
        username,
        email,
        password : hashedPassword,
    };

    users.push(newUser);
    return newUser;
};

const getUsers = () => {
    return users.map(({ password,...user }) => user);
};

const findUserbyEmail = (email) => {
    return users.find((user) => user.email === email);
}

module.exports = {
    createUser,
    getUsers,
    findUserbyEmail,
}