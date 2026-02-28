const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    sets: { type: Number, required: true },
    reps: { type: String, required: true }, // e.g., "8-12" or "10"
    rest: { type: String, required: true }, // e.g., "60s"
    notes: { type: String }
});

const dailyWorkoutSchema = new mongoose.Schema({
    day: { type: String, required: true }, // e.g., "Day 1 - Push", "Monday"
    exercises: [exerciseSchema],
    duration: { type: Number }, // in minutes
    difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'] },
    isCompleted: { type: Boolean, default: false }
});

const workoutPlanSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    programType: {
        type: String,
        required: true,
        enum: ['Push/Pull/Legs', 'Full Body', 'Upper/Lower', 'Home Workout', 'HIIT']
    },
    days: [dailyWorkoutSchema],
    isActive: { type: Boolean, default: true },
    lastUpdated: { type: Date, default: Date.now }
}, { timestamps: true });

const WorkoutPlan = mongoose.model('WorkoutPlan', workoutPlanSchema);
module.exports = WorkoutPlan;
