const User = require('../models/User');

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = req.body.name || user.name || 'User';
            user.age = req.body.age ? Number(req.body.age) : (user.age || 25);
            user.weight = req.body.weight ? Number(req.body.weight) : (user.weight || 70);
            user.height = req.body.height ? Number(req.body.height) : (user.height || 170);
            user.goal = req.body.goal || user.goal || 'Fat Loss';
            user.activityLevel = req.body.activityLevel ? Number(req.body.activityLevel) : (user.activityLevel || 1.2);
            user.equipment = req.body.equipment || user.equipment || 'None';
            user.experienceLevel = req.body.experienceLevel || user.experienceLevel || 'Beginner';
            user.gender = req.body.gender || user.gender || 'male';

            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser.id,
                name: updatedUser.name,
                email: updatedUser.email,
                goal: updatedUser.goal,
                age: updatedUser.age,
                weight: updatedUser.weight,
                height: updatedUser.height,
                activityLevel: updatedUser.activityLevel,
                equipment: updatedUser.equipment,
                experienceLevel: updatedUser.experienceLevel,
                gender: updatedUser.gender
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error("Profile Update Validation Error:", error);
        res.status(400).json({ message: error.message || 'Data validation failed' });
    }
};

module.exports = {
    updateUserProfile,
};
