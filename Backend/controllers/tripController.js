const Trip = require('../models/Trip');
const Expense = require('../models/Expense');

// @desc    Create new trip
// @route   POST /api/trips
exports.createTrip = async (req, res) => {
    try {
        const trip = await Trip.create(req.body);
        res.status(201).json({ success: true, data: trip });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Get all trips
// @route   GET /api/trips
exports.getTrips = async (req, res) => {
    try {
        const trips = await Trip.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: trips });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Get single trip with its expenses
// @route   GET /api/trips/:id
exports.getTrip = async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id);
        if (!trip) {
            return res.status(404).json({ success: false, error: 'Trip not found' });
        }

        // Find all expenses related to this trip
        const expenses = await Expense.find({ tripId: req.params.id });

        res.status(200).json({ 
            success: true, 
            data: {
                ...trip._doc,
                expenses
            }
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};
