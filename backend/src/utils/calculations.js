/**
 * Calculate BMR (Mifflin-St Jeor)
 */
const calculateBMR = (gender, weight, height, age) => {
    if (gender === 'male') {
        return (10 * weight) + (6.25 * height) - (5 * age) + 5;
    } else {
        return (10 * weight) + (6.25 * height) - (5 * age) - 161;
    }
};

/**
 * Calculate TDEE
 */
const calculateTDEE = (bmr, activityMultiplier) => {
    return Math.round(bmr * activityMultiplier);
};

/**
 * Goal Adjustment
 */
const adjustCaloriesForGoal = (tdee, goal) => {
    if (goal === 'Fat Loss') return tdee - 500;
    if (goal === 'Muscle Gain') return tdee + 300;
    return tdee; // Maintenance
};

/**
 * Macro Logic
 * Protein = 2g × weight
 * Fats = 25% total calories
 * Carbs = remaining calories
 */
const calculateMacros = (targetCalories, weight) => {
    const proteinGrams = 2 * weight;
    const proteinCals = proteinGrams * 4;

    const fatsCals = targetCalories * 0.25;
    const fatsGrams = fatsCals / 9;

    const carbsCals = targetCalories - (proteinCals + fatsCals);
    const carbsGrams = carbsCals / 4;

    return {
        calories: Math.round(targetCalories),
        protein: Math.round(proteinGrams),
        fats: Math.round(fatsGrams),
        carbs: Math.round(carbsGrams)
    };
};

module.exports = {
    calculateBMR,
    calculateTDEE,
    adjustCaloriesForGoal,
    calculateMacros
};
