const express = require('express');
const router = express.Router();
const { createTrip, getTrips, getTrip } = require('../controllers/tripController');

// Map routes to controller functions
router.route('/')
    .post(createTrip)
    .get(getTrips);

router.route('/:id')
    .get(getTrip);

module.exports = router;
