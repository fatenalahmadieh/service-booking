const Booking = require("../models/bookingSchema");
const Flight = require("../models/flightSchema");

exports.createBooking = async (req, res) => {
        res.status(201).json({ message: "" });
};

exports.getAllBookings = async (req, res) => {
    res.status(200).json({ message: "" });
};

exports.getBookingById = async (req, res) => {
    res.status(200).json({ message: "" });
};

exports.getUserBookings = async (req, res) => {
    res.status(200).json({ message: "" });
};

exports.cancelBooking = async (req, res) => {
    res.status(200).json({ message: "" });
};