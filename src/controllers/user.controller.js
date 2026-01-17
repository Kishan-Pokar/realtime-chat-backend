const { createUser,getUsers,findUserbyEmail } = require('../services/user.service');
const bcrypt = require('bcrypt');


const registerUser = async (req,res) => {
    const { username,email,password } = req.body;

    if(!username || !email || !password){
        return res.status(400).json({error : 'username,email and password are required'});
    }

    const newUser = await createUser(username,email,password);

    if(!newUser){
        return res.status(409).json({
            error : "User already exists"
        });
    }

    return res.status(201).json({
        message : "user registered successfully",
        user : {
            id : newUser.id,
            username : newUser.username,
            email : newUser.email,
        },
    });

};


const loginUser = async (req,res) => {
    const { email,password } = req.body;

    if(!email || !password){
        return res.status(400).json({
            error : "email and password are required"
        });
    }
    const user = await findUserbyEmail(email);

    if(!user){
        return res.status(401).json({
            error : "Invalid Credentials"
        })
    }
    const isMatch = await bcrypt.compare(password,user.password_hash);

    if(!isMatch){
        return res.status(401).json({
            error : "Invalid Credentials"
        });
    }

    return res.json({
        message : "login successful",
        user : {
            id : user.id,
            username : user.username,
            email : user.email
        },
    });
}

// const getAllUsers = (req,res) => {
//     const users = getUsers();
//     res.send(users);
// }

module.exports = {
    registerUser,
    loginUser,
}