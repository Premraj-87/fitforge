const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register a new user
// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
    try {
        const { name, email, password, age, weight, height, gender, goal, activityLevel, equipment, experienceLevel } = req.body;

        const userExists = await User.findOne({ email });

        if (userExists) {
            res.status(400);
            throw new Error('User already exists');
        }

        const user = await User.create({
            name,
            email,
            password,
            age,
            weight,
            height,
            gender,
            goal,
            activityLevel,
            equipment,
            experienceLevel
        });

        if (user) {
            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                age: user.age,
                weight: user.weight,
                height: user.height,
                gender: user.gender,
                goal: user.goal,
                activityLevel: user.activityLevel,
                equipment: user.equipment,
                experienceLevel: user.experienceLevel,
                token: generateToken(user._id),
            });
        } else {
            res.status(400);
            throw new Error('Invalid user data');
        }
    } catch (error) {
        if (next) {
            next(error);
        } else {
            res.status(400).json({ message: error.message });
        }
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                age: user.age,
                weight: user.weight,
                height: user.height,
                gender: user.gender,
                goal: user.goal,
                activityLevel: user.activityLevel,
                equipment: user.equipment,
                experienceLevel: user.experienceLevel,
                token: generateToken(user._id),
            });
        } else {
            res.status(401);
            throw new Error('Invalid email or password');
        }
    } catch (error) {
        if (next) {
            next(error);
        } else {
            res.status(401).json({ message: error.message });
        }
    }
};

// @desc    Get user profile
// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                age: user.age,
                weight: user.weight,
                height: user.height,
                gender: user.gender,
                goal: user.goal,
                activityLevel: user.activityLevel,
                equipment: user.equipment,
                experienceLevel: user.experienceLevel
            });
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        if (next) {
            next(error);
        } else {
            res.status(404).json({ message: error.message });
        }
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
};
