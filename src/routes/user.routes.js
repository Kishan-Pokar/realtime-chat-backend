const express = require('express');

const router = express.Router();

const { registerUser,getAllUsers } = require('../controllers/user.controller');


router.post('/register',registerUser);

router.get('/',getAllUsers);

module.exports = router;