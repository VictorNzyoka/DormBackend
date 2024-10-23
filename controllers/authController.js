// controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../models');
const { User, Sequelize } = db;

const generateAccessToken = (user) => {
    return jwt.sign({ id: user.id, role: user.role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '60m' });
};

const generateRefreshToken = (user) => {
    return jwt.sign({ id: user.id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
};

exports.signup = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    const defaultRole = 'user'; // Set the default role here

    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ 
            firstName, 
            lastName, 
            email, 
            password: hashedPassword, 
            role: defaultRole // Assign the default role
        });

        res.status(201).json({ 
            message: 'User created successfully', 
            user: { id: newUser.id, email, role: newUser.role } 
        });
    } catch (error) {
        console.error(error); 
        res.status(500).json({ message: 'Error signing up' });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    console.log("Login attempt with email:", email);

    try {
        const user = await User.findOne({ where: { email } }); 
        if (!user) {
            console.log("User not found");
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("Password does not match");
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        console.log(accessToken, refreshToken);
        res.json({ accessToken, refreshToken });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: 'Error logging in' });
    }
};