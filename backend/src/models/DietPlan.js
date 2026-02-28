const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
    name: { type: String, required: true }, // e.g., "Breakfast"
    foodItems: [{
        name: { type: String, required: true },
        portion: { type: String, required: true }, // e.g., "100g"
        calories: { type: Number, required: true },
        protein: { type: Number, required: true },
        carbs: { type: Number, required: true },
        fats: { type: Number, required: true }
    }],
    totalCalories: { type: Number },
    totalProtein: { type: Number },
    totalCarbs: { type: Number },
    totalFats: { type: Number }
});

const dietPlanSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    dailyTarget: {
        calories: { type: Number, required: true },
        protein: { type: Number, required: true }, // in grams
        carbs: { type: Number, required: true },   // in grams
        fats: { type: Number, required: true }     // in grams
    },
    meals: [mealSchema],
    budgetRange: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Medium'
    },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

const DietPlan = mongoose.model('DietPlan', dietPlanSchema);
module.exports = DietPlan;
