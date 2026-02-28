// @desc    Get rule-based contextual chat response
// @route   POST /api/chat
// @access  Private
const Progress = require('../models/Progress');
const User = require('../models/User');
const DietPlan = require('../models/DietPlan');
const WorkoutPlan = require('../models/WorkoutPlan');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const getChatResponse = async (req, res) => {
    try {
        const { message } = req.body;
        const userId = req.user.id;
        const lowerMessage = message.toLowerCase();

        let reply = "I'm your FitForge System Coach. I can parse commands to log your weight, check your streak, or answer fitness queries.";

        // --- 1. SYSTEM ACTIONS: Log Weight ---
        // Matches "log weight 75" or "log my weight as 75.5"
        const weightMatch = lowerMessage.match(/log.*weight.*?(\d+(\.\d+)?)/);
        if (weightMatch) {
            const weightValue = Number(weightMatch[1]);
            let progress = await Progress.findOne({ user: userId });

            if (!progress) {
                progress = await Progress.create({ user: userId, weightHistory: [{ weight: weightValue, date: new Date() }] });
            } else {
                progress.weightHistory.push({ weight: weightValue, date: new Date() });
                await progress.save();
            }

            await User.findByIdAndUpdate(userId, { weight: weightValue });
            return res.json({ reply: `Command executed. I've logged your current mass as ${weightValue}kg and updated your telemetry.` });
        }

        // --- 2. GEMINI AI INTEGRATION (Context-Aware Conversational Coaching) ---
        // Fetch all user context
        const user = await User.findById(userId);
        const progress = await Progress.findOne({ user: userId });
        const diet = await DietPlan.findOne({ userId, isActive: true });
        const workout = await WorkoutPlan.findOne({ userId, isActive: true });

        // Build Telemetry String
        let contextParts = [];
        contextParts.push(`User Name: ${user?.name || 'Athlete'}`);
        contextParts.push(`Current Weight: ${user?.weight || 'Unknown'} kg`);
        contextParts.push(`Primary Goal: ${user?.goals?.primary || 'General Fitness'}`);
        if (progress) {
            contextParts.push(`Current Streak: ${progress.streak || 0} days`);
            contextParts.push(`Adherence Score: ${progress.consistencyScore || 0}%`);
        }
        if (diet) {
            const d = diet.dailyTarget;
            contextParts.push(`Diet Targets: ${d.calories} Cals (${d.protein}g Protein, ${d.carbs}g Carbs, ${d.fats}g Fats)`);
        } else {
            contextParts.push(`Diet Targets: Not yet generated/active.`);
        }

        if (workout) {
            const incomplete = workout.days.filter(d => !d.isCompleted).length;
            contextParts.push(`Active Workout Plan: Yes. ${incomplete} out of ${workout.days.length} modules remaining this week.`);
        } else {
            contextParts.push(`Active Workout Plan: None currently deployed.`);
        }

        const systemInstruction = `You are the FitForge System Coach, an elite, highly analytical, no-nonsense AI fitness assistant designed to help this specific user reach their goals.
Your tone is professional, direct, futuristic, and encouraging, similar to a sci-fi protocol interface. 
You provide concrete fitness, nutrition, and protocol advice.
Here is the user's live telemetry from our database:
${contextParts.join('\n')}

Based on this telemetry, answer the user's prompt intelligently. Keep answers concise (under 4 sentences if possible) and highly relevant to their current state. Format the response cleanly in plain text (avoid excessive markdown wrapping if unnecessary).`;

        // Initialize Gemini
        require('dotenv').config({ override: true }); // Hot-reload .env memory
        if (!process.env.GEMINI_API_KEY) {
            return res.json({ reply: "System Error: Gemini API key is missing from the environment modules. Proceed with manual overrides." });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: systemInstruction }],
                },
                {
                    role: "model",
                    parts: [{ text: "Understood. I have securely synced with the user's telemetry. I am ready to calculate optimal pathways and provide protocol advice." }],
                },
            ]
        });

        // Send User Message
        const result = await chat.sendMessage(message);
        const geminiReply = result.response.text();

        return res.json({ reply: geminiReply });

    } catch (error) {
        console.error('Gemini Coach Error:', error);
        res.status(400).json({ message: "System override error or API failure. " + error.message });
    }
};

module.exports = {
    getChatResponse
};
