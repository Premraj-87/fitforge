const Progress = require('../models/Progress');
const Leaderboard = require('../models/Leaderboard');
const WorkoutPlan = require('../models/WorkoutPlan');

// @desc    Get user progress details
// @route   GET /api/progress
// @access  Private
const getProgress = async (req, res) => {
    try {
        let progress = await Progress.findOne({ userId: req.user._id });

        // Auto-create on first fetch if doesn't exist
        if (!progress) {
            progress = await Progress.create({ userId: req.user._id });
        }

        res.json(progress);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update weight history
// @route   POST /api/progress/weight
// @access  Private
const updateWeight = async (req, res) => {
    try {
        const { weight } = req.body;
        let progress = await Progress.findOne({ userId: req.user._id });

        if (!progress) {
            progress = await Progress.create({ userId: req.user._id });
        }

        progress.weightHistory.push({ value: weight });
        await progress.save();

        res.json(progress);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Complete a workout & give points
// @route   POST /api/progress/workout
// @access  Private
const completeWorkout = async (req, res) => {
    try {
        const { planId, dayIndex } = req.body;

        let progress = await Progress.findOne({ userId: req.user._id });
        if (!progress) progress = await Progress.create({ userId: req.user._id });

        // Update WorkoutPlan Completion
        let workoutPlan = await WorkoutPlan.findOne({ _id: planId, userId: req.user._id });
        if (workoutPlan && typeof dayIndex === 'number' && workoutPlan.days[dayIndex]) {
            if (workoutPlan.days[dayIndex].isCompleted) {
                return res.status(400).json({ message: "This module has already been executed." });
            }
            workoutPlan.days[dayIndex].isCompleted = true;
            await workoutPlan.save();
        }

        // Logic: Streak & Consistency
        const lastActive = new Date(progress.lastActive || Date.now() - 86400000 * 2);
        const today = new Date();
        const diffTime = Math.abs(today - lastActive);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays <= 1) {
            progress.streak += 1;
        } else {
            progress.streak = 1; // reset streak if missed a day
        }

        progress.workoutHistory.push({ planId, completed: true });
        progress.lastActive = Date.now();
        await progress.save();

        // Reward points on Leaderboard
        let leaderboard = await Leaderboard.findOne({ userId: req.user._id });
        if (!leaderboard) {
            leaderboard = await Leaderboard.create({ userId: req.user._id });
        }

        // 10 points for completion + 2 points per streak day
        const pointsEarned = 10 + (progress.streak * 2);
        leaderboard.totalPoints += pointsEarned;

        // Simple level up logic
        if (leaderboard.totalPoints > 100 && leaderboard.tier === 'Bronze') leaderboard.tier = 'Silver';
        if (leaderboard.totalPoints > 300 && leaderboard.tier === 'Silver') leaderboard.tier = 'Gold';

        await leaderboard.save();

        res.json({ progress, leaderboard, pointsEarned, workoutPlan });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getProgress,
    updateWeight,
    completeWorkout
};
