const { users } = require('../data/users.store');


const createUser = (username,email) => {
    const existingUser = users.find(
        (user) => user.email === email
    );

    if(existingUser){
        return null;
    }

    const newUser = {
        id: users.length + 1,
        username,
        email,
    };

    users.push(newUser);
    return newUser;
};

const getUsers = () => {
    return users;
};

module.exports = {
    createUser,
    getUsers,
}