const mongoose = require('mongoose');

const historyEntrySchema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    value: { type: Number, required: true },
    notes: { type: String }
}, { _id: false });

const progressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    weightHistory: [historyEntrySchema],
    workoutHistory: [{
        date: { type: Date, default: Date.now },
        planId: { type: mongoose.Schema.Types.ObjectId, ref: 'WorkoutPlan' },
        completed: { type: Boolean, default: true }
    }],
    calorieHistory: [{
        date: { type: Date, default: Date.now },
        caloriesConsumed: { type: Number, required: true }
    }],
    streak: { type: Number, default: 0 },
    lastActive: { type: Date, default: Date.now },
    consistencyScore: { type: Number, default: 100 }, // 0 to 100%
    level: { type: Number, default: 1 }
}, { timestamps: true });

const Progress = mongoose.model('Progress', progressSchema);
module.exports = Progress;
