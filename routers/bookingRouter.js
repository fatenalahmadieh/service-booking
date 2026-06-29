const express = require('express');
const router = express.Router();
const bookingController = require("../controllers/bookingController");
const authController = require("../controllers/authController");

router.post("/bookings",authController.protect, 
    authController.restrictTo('Passenger','Admin'), bookingController.createBooking);      
router.get("/bookings", authController.protect, 
    authController.restrictTo('Admin'),bookingController.getAllBooking);  
router.get("/bookings/:id", authController.protect, 
    authController.restrictTo('Admin'),bookingController.getBookingById);
router.get("/users/:id/bookings",authController.protect, 
    authController.restrictTo('Passenger'), bookingController.getUserBookings);
router.put("/bookings/:id/cancel", authController.protect, 
    authController.restrictTo('Passenger'),bookingController.cancelBooking);
router.put("/bookings/:id/confirm", authController.protect, 
    authController.restrictTo('Passenger'),bookingController.confirmBooking);
router.put("/bookings/:id/purchase-baggage", authController.protect, 
    authController.restrictTo('Passenger'), bookingController.purchaseExtraBaggage);
router.put("/bookings/:id/changeSeat", authController.protect, 
    authController.restrictTo('Passenger','Admin'),bookingController.changeSeat);

module.exports = router;
