const { createUser,getUsers } = require('../services/user.service');

const registerUser = (req,res) => {
    const { username,email } = req.body;

    if(!username || !email){
        return res.status(400).json({error : 'username and email are required'});
    }

    const newUser = createUser(username,email);

    if(!newUser){
        return res.status(409).json({
            error : "User already exists"
        });
    }

    return res.status(201).json({
        message : "user registered successfully",
        user : newUser,
    });

};

const getAllUsers = (req,res) => {
    const users = getUsers();
    res.send(users);
}

module.exports = {
    registerUser,
    getAllUsers,
}