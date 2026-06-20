const express = require('express');
const router = express.Router();
const bookingController = require("../controllers/bookingController");


router.post("/bookings", bookingController.createBooking);      
router.get("/bookings", bookingController.getAllBookings);
router.get("/bookings/:id", bookingController.getBookingById);
router.get("/users/:id/bookings", bookingController.getUserBookings);
router.put("/bookings/:id/cancel", bookingController.cancelBooking);

module.exports = router;