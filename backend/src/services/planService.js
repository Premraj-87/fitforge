const { calculateBMR, calculateTDEE, adjustCaloriesForGoal, calculateMacros } = require('../utils/calculations');
const WorkoutPlan = require('../models/WorkoutPlan');
const DietPlan = require('../models/DietPlan');
const exercisesData = require('../data/exercises.json');

// Helper to filter exercises
function getExercisesForMuscle(muscle, equipment, count = 2) {
    let filtered = exercisesData.filter(ex => ex.targetMuscle === muscle);

    if (equipment === 'None') {
        filtered = filtered.filter(ex => ex.equipment === 'Bodyweight');
    } else if (equipment === 'Basic Home') {
        filtered = filtered.filter(ex => ['Dumbbell', 'Bodyweight', 'Bands'].includes(ex.equipment));
    }

    // Shuffle and pick top count
    filtered = filtered.sort(() => 0.5 - Math.random());

    // Fallbacks if no exact match
    if (filtered.length === 0) {
        return [{ name: `${muscle} Bodyweight Exercise`, sets: 3, reps: '15', rest: '60s' }];
    }

    return filtered.slice(0, count).map(ex => ({
        name: ex.name,
        sets: ex.defaultSets,
        reps: ex.defaultReps,
        rest: ex.rest
    }));
}

const generateDietPlan = async (user) => {
    const bmr = calculateBMR(user.gender, user.weight, user.height, user.age);
    const tdee = calculateTDEE(bmr, user.activityLevel);
    const targetCalories = adjustCaloriesForGoal(tdee, user.goal);
    const macros = calculateMacros(targetCalories, user.weight);

    // Simplified meal generation for demonstration (In a real app, fetch from food DB)
    const meals = [
        {
            name: 'Breakfast',
            foodItems: [{ name: 'Oats with Whey and Almonds', portion: '1 bowl', calories: 400, protein: 30, carbs: 45, fats: 10 }]
        },
        {
            name: 'Lunch',
            foodItems: [{ name: 'Chicken Breast with Rice and Veggies', portion: '1 plate', calories: 600, protein: 45, carbs: 60, fats: 15 }]
        },
        {
            name: 'Dinner',
            foodItems: [{ name: 'Salmon with Quinoa', portion: '1 plate', calories: 500, protein: 40, carbs: 40, fats: 20 }]
        }
        // Totals approach ~1500 but dynamically we would proportion this
    ];

    const newDietPlan = await DietPlan.create({
        userId: user._id,
        dailyTarget: macros,
        meals: meals,
        budgetRange: 'Medium',
        isActive: true
    });

    return newDietPlan;
};

const generateWorkoutPlan = async (user) => {
    let programType = 'Full Body';

    // Allocate 6-Day PPL split to users with Full Gym access (regardless of goal)
    if (user.equipment === 'Full Gym') {
        programType = 'Push/Pull/Legs';
    } else if (user.equipment === 'None') {
        programType = 'Home Workout';
    }

    let days = [];

    if (programType === 'Push/Pull/Legs') {
        const pushExercises = () => [
            ...getExercisesForMuscle('Chest', user.equipment, 3),
            ...getExercisesForMuscle('Shoulders', user.equipment, 2),
            ...getExercisesForMuscle('Arms', user.equipment, 1) // Triceps
        ];

        const pullExercises = () => [
            ...getExercisesForMuscle('Back', user.equipment, 3),
            ...getExercisesForMuscle('Arms', user.equipment, 2) // Biceps
        ];

        const legExercises = () => [
            ...getExercisesForMuscle('Legs', user.equipment, 4),
            ...getExercisesForMuscle('Core', user.equipment, 2)
        ];

        days = [
            { day: 'Day 1 - Push Heavy', exercises: pushExercises(), duration: 60, difficulty: user.experienceLevel },
            { day: 'Day 2 - Pull Heavy', exercises: pullExercises(), duration: 60, difficulty: user.experienceLevel },
            { day: 'Day 3 - Legs Heavy', exercises: legExercises(), duration: 60, difficulty: user.experienceLevel },
            { day: 'Day 4 - Push Volume', exercises: pushExercises(), duration: 60, difficulty: user.experienceLevel },
            { day: 'Day 5 - Pull Volume', exercises: pullExercises(), duration: 60, difficulty: user.experienceLevel },
            { day: 'Day 6 - Legs Volume', exercises: legExercises(), duration: 60, difficulty: user.experienceLevel }
        ];
    } else {
        // Full Body or Home Workout - 6 Day Cycle (3 On, 3 Active Recovery)
        const fullBodyA = () => [
            ...getExercisesForMuscle('Chest', user.equipment, 1),
            ...getExercisesForMuscle('Back', user.equipment, 1),
            ...getExercisesForMuscle('Legs', user.equipment, 2),
            ...getExercisesForMuscle('Shoulders', user.equipment, 1),
            ...getExercisesForMuscle('Core', user.equipment, 1)
        ];

        const fullBodyB = () => [
            ...getExercisesForMuscle('Legs', user.equipment, 1),
            ...getExercisesForMuscle('Chest', user.equipment, 1),
            ...getExercisesForMuscle('Back', user.equipment, 1),
            ...getExercisesForMuscle('Arms', user.equipment, 2),
            ...getExercisesForMuscle('Core', user.equipment, 1)
        ];

        days = [
            { day: 'Day 1 - Full Body Core Focus', exercises: fullBodyA(), duration: 45, difficulty: user.experienceLevel },
            { day: 'Day 2 - Full Body Arm Focus', exercises: fullBodyB(), duration: 45, difficulty: user.experienceLevel },
            { day: 'Day 3 - Active Recovery (Cardio)', exercises: getExercisesForMuscle('Core', user.equipment, 3), duration: 30, difficulty: 'Beginner' },
            { day: 'Day 4 - Full Body Core Focus', exercises: fullBodyA(), duration: 45, difficulty: user.experienceLevel },
            { day: 'Day 5 - Full Body Arm Focus', exercises: fullBodyB(), duration: 45, difficulty: user.experienceLevel },
            { day: 'Day 6 - Active Recovery (Mobility)', exercises: getExercisesForMuscle('Core', user.equipment, 3), duration: 30, difficulty: 'Beginner' }
        ];
    }

    const newWorkoutPlan = await WorkoutPlan.create({
        userId: user._id,
        programType,
        days,
        isActive: true
    });

    return newWorkoutPlan;
};

module.exports = {
    generateDietPlan,
    generateWorkoutPlan
};
