const Leaderboard = require('../models/Leaderboard');

// @desc    Get global leaderboard
// @route   GET /api/leaderboard
// @access  Private
const getLeaderboard = async (req, res) => {
    try {
        const leaderboard = await Leaderboard.find()
            .populate('userId', 'name email')
            .sort({ totalPoints: -1 })
            .limit(50); // top 50

        res.json(leaderboard);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getLeaderboard
};
