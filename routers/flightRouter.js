const express = require("express");

const {
    createFlight,
    getAllFlight,
    getFlightById,
    updateFlightById,
    deleteFlight,
} = require('../controllers/flightController');

const router = express.Router();

router.route('/').get(getAllFlight).post(createFlight);
router.route('/:id').get(getFlightById).put(updateFlightById).delete(deleteFlight);

module.exports = router;