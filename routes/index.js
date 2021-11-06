const express = require('express');
const Sequelize = require('sequelize');
const router = express.Router();
const { User } = require('../models/index');
const { asyncHandler } = require('../middleware/async-handler');
const { authenticateUser } = require('../middleware/auth-user');

// Get currently logged in user
router.get('/', authenticateUser, asyncHandler(async (req, res) => {
    const user = {
        id: req.currentUser.id,
        firstName: req.currentUser.firstName,
        lastName: req.currentUser.lastName,
        emailAddress: req.currentUser.emailAddress
    };
    console.log(user)
    res.status(200).json(user);
}));

// Create a user -> body not being sent with postman
router.post('/', asyncHandler(async (req, res) => {
    try {
        await User.create(req.body);
        res.json(201).location('/').json();
    } catch (error) {
        if ( 
             error.name === 'SequelizeValidationError' ||
             error.name === 'SequelizeUniqueConstraintError'
        ) {
            const errors = error.errors.map((err) => err.message);
            res.status(400).json({errors});
        } else {
            throw error;
        }
    }
}));

module.exports = router;