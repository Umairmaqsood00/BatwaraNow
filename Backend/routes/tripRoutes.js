const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { createTrip, getTrips, getTrip, deleteTrip } = require('../controllers/tripController');

router.use(protect);

// Map routes to controller functions
router.route('/')
    .post(createTrip)
    .get(getTrips);

router.route('/:id')
    .get(getTrip)
    .delete(deleteTrip);

module.exports = router;
