const express = require('express');
const router = express.Router();
const { getProgress, updateWeight, completeWorkout } = require('../controllers/progressController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getProgress);
router.post('/weight', protect, updateWeight);
router.post('/workout', protect, completeWorkout);

module.exports = router;
