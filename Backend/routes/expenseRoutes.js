const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { addExpense } = require('../controllers/expenseController');

router.use(protect);

// Map routes to controller functions
router.route('/')
    .post(addExpense);

module.exports = router;
