const express = require('express');
const router = express.Router();
const { addExpense } = require('../controllers/expenseController');

// Map routes to controller functions
router.route('/')
    .post(addExpense);

module.exports = router;
