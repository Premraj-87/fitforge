const express = require('express');
const router = express.Router();
const { generatePlans, getPlans } = require('../controllers/planController');
const { protect } = require('../middleware/authMiddleware');

router.post('/generate', protect, generatePlans);
router.get('/', protect, getPlans);

module.exports = router;
