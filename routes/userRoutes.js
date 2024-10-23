const express = require('express');
const { getAllUsers, getUserById } = require('../controllers/userController');
const router = express.Router();


// Route to get all users
router.get('/users',getAllUsers);

// Route to get user by ID
router.get('/users/:id',getUserById);

module.exports = router;