const express = require('express');

const router = express.Router();

const { registerUser, loginUser, getAllUsers } = require('../controllers/user.controller');


router.post('/register', registerUser);

router.post('/login', loginUser);

router.get('/', getAllUsers);




module.exports = router;