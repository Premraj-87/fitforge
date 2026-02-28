const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    dateEarned: { type: Date, default: Date.now },
    icon: { type: String } // e.g., Lucide icon string like "Trophy"
});

const leaderboardSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    totalPoints: { type: Number, default: 0 },
    rank: { type: Number, default: 0 },
    tier: {
        type: String,
        enum: ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'],
        default: 'Bronze'
    },
    achievements: [achievementSchema] // E.g. "7-Day Streak", "Goal Reached"
}, { timestamps: true });

const Leaderboard = mongoose.model('Leaderboard', leaderboardSchema);
module.exports = Leaderboard;
