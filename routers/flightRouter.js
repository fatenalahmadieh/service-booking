const express = require('express');
const router = express.Router();
const flightController = require("../controllers/flightController");

router.post("/flights", flightController.createFlight);
router.get("/flights", flightController.getAllFlight);
router.get("/flights/:id", flightController.getFlightById);
router.put("/flights/:id", flightController.updateFlightById);
router.delete("/flights/:id", flightController.deleteFlight);

module.exports = router;