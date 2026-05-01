const Expense = require('../models/Expense');

// @desc    Add expense to a trip
// @route   POST /api/expenses
exports.addExpense = async (req, res) => {
    try {
        const expense = await Expense.create(req.body);
        res.status(201).json({ success: true, data: expense });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};
