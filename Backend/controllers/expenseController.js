const Expense = require('../models/Expense');
const Trip = require('../models/Trip');
const { tripOwnedByUser } = require('../utils/tripAccess');

// @desc    Add expense to a trip (owner only)
// @route   POST /api/expenses
exports.addExpense = async (req, res) => {
    try {
        const { tripId } = req.body;
        if (!tripId) {
            return res.status(400).json({ success: false, error: 'tripId is required' });
        }
        const trip = await Trip.findById(tripId);
        if (!trip) {
            return res.status(404).json({ success: false, error: 'Trip not found' });
        }
        if (!tripOwnedByUser(trip, req.user)) {
            return res.status(403).json({ success: false, error: 'Not authorized to add expenses to this trip' });
        }
        const expense = await Expense.create(req.body);
        res.status(201).json({ success: true, data: expense });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};
