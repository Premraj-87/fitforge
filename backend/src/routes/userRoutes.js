const express = require('express');
const router = express.Router();
const { updateUserProfile, resetUserAccount, deleteUserAccount } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.put('/profile', protect, updateUserProfile);
router.delete('/profile', protect, deleteUserAccount);
router.post('/reset', protect, resetUserAccount);

module.exports = router;
