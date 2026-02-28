const User = require('../models/User');
const WorkoutPlan = require('../models/WorkoutPlan');
const DietPlan = require('../models/DietPlan');
const { generateDietPlan, generateWorkoutPlan } = require('../services/planService');

// @desc    Generate or Re-generate Plans for User
// @route   POST /api/plans/generate
// @access  Private
const generatePlans = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }

        // Mark old plans as inactive (Optional based on requirements)
        await DietPlan.updateMany({ userId: user._id }, { isActive: false });
        await WorkoutPlan.updateMany({ userId: user._id }, { isActive: false });

        const newDietPlan = await generateDietPlan(user);
        const newWorkoutPlan = await generateWorkoutPlan(user);

        res.status(201).json({
            dietPlan: newDietPlan,
            workoutPlan: newWorkoutPlan
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get Current Plans
// @route   GET /api/plans
// @access  Private
const getPlans = async (req, res) => {
    try {
        const dietPlan = await DietPlan.findOne({ userId: req.user._id, isActive: true }).sort({ createdAt: -1 });
        const workoutPlan = await WorkoutPlan.findOne({ userId: req.user._id, isActive: true }).sort({ createdAt: -1 });

        res.json({
            dietPlan,
            workoutPlan
        });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

module.exports = {
    generatePlans,
    getPlans
};
