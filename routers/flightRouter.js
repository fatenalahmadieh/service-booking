const express = require('express');
const router = express.Router();
const flightController = require("../controllers/flightController");
const authController = require("../controllers/authController");

router.post("/flights",authController.protect, 
    authController.restrictTo('Admin'), flightController.createFlight);
router.get("/flights", flightController.getAllFlight);
router.get("/flights/:id", flightController.getFlightById);
router.put("/flights/:id",authController.protect, 
    authController.restrictTo('Admin'), flightController.updateFlightById);
router.delete("/flights/:id", authController.protect, 
    authController.restrictTo('Admin'),flightController.deleteFlight);

module.exports = router;