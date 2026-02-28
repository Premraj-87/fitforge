const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    age: { type: Number, required: true },
    weight: { type: Number, required: true }, // Current weight in kg
    height: { type: Number, required: true }, // Height in cm
    gender: { type: String, enum: ['male', 'female'], required: true },
    goal: {
        type: String,
        enum: ['Fat Loss', 'Muscle Gain', 'Maintenance'],
        required: true
    },
    activityLevel: {
        type: Number,
        enum: [1.2, 1.375, 1.55, 1.725, 1.9], // Multipliers for TDEE
        required: true
    },
    equipment: {
        type: String,
        enum: ['None', 'Basic Home', 'Full Gym'],
        default: 'None'
    },
    experienceLevel: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced'],
        default: 'Beginner'
    }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
