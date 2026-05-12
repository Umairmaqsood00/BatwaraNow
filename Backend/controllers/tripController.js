const Trip = require('../models/Trip');
const Expense = require('../models/Expense');
const {
  tripOwnedByUser,
  buildTripOwnerQuery,
  ownerObjectIdForCreate,
} = require('../utils/tripAccess');

// @desc    Create new trip
// @route   POST /api/trips
exports.createTrip = async (req, res) => {
    try {
        const trip = await Trip.create({
            name: req.body.name,
            participants: req.body.participants,
            userId: ownerObjectIdForCreate(req.user),
        });
        res.status(201).json({ success: true, data: trip });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Get all trips for the logged-in user
// @route   GET /api/trips
exports.getTrips = async (req, res) => {
    try {
        const trips = await Trip.find(buildTripOwnerQuery(req.user)).sort({ createdAt: -1 });
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
        if (!tripOwnedByUser(trip, req.user)) {
            return res.status(403).json({ success: false, error: 'Not authorized to view this trip' });
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

// @desc    Delete trip and its expenses
// @route   DELETE /api/trips/:id
exports.deleteTrip = async (req, res) => {
    try {
        const { id } = req.params;
        const trip = await Trip.findById(id);
        if (!trip) {
            return res.status(404).json({ success: false, error: 'Trip not found' });
        }
        if (!tripOwnedByUser(trip, req.user)) {
            return res.status(403).json({ success: false, error: 'Not authorized to delete this trip' });
        }
        await Expense.deleteMany({ tripId: id });
        await Trip.findByIdAndDelete(id);
        res.status(200).json({ success: true, data: null });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};
