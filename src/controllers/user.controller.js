const { users } = require('../data/users.store');

const registerUser = (req,res) => {
    const { username,email } = req.body;

    if(!username || !email){
        return res.status(400).json({error : 'username and email are required'});
    }

    const existingUser = users.find(
        (user) => user.email === email
    );

    if(existingUser){
        return res.status(409).json({error : "User already exists"});
    }


    const newUser = {
        id : users.length +1,
        username,
        email,
    };

    users.push(newUser);

    return res.status(201).json({
        message : "user registered successfully",
        user : newUser,
    });

};

const getAllUsers = (req,res) => {
    res.json(users)
}

module.exports = {
    registerUser,
    getAllUsers,
}