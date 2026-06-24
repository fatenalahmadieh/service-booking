const Booking = require('../models/bookingSchema');
const Flight = require('../models/flightSchema');
const User = require('../models/userSchema');

// POST /api/bookings
// create booking
exports.createBooking = async (req, res) => {
    try{
        const booking = await Booking.findOne(
            {flightId: req.body["flightId"],
            seatNumber: req.body["seatNumber"]}
    );
    if(booking){
            return res
            .status(409)
            .json({message: "booking is already found"});
    };
    const newBooking = await Booking.create({
            userId: req.body.userId,
            flightId: req.body.flightId,
            seatNumber: req.body.seatNumber,
            totalPrice: req.body.totalPrice,
            bookingStatus: req.body.bookingStatus,
            payment: {
                amount: req.body.payment.amount,
                paymentMethod: req.body.payment.paymentMethod,
                paymentStatus: req.body.payment.paymentStatus,
                transactionId: req.body.payment.transactionId
            }
    });
    return res.status(201).json({ data: newBooking,  message: "Booking created successfully" });
    }catch (err){
        console.log(err);
        res.status(500).json({message:err.message});
    }
};

// GET /api/bookings
// get all bookings
exports.getAllBooking = async (req, res) => {
    try{
        const bookings = await Booking.find({});
        return res.status(200).json({ results: bookings.length, data: bookings });
    }catch (err){
        console.log(err);
        res.status(500).json({message:err.message});
    }
};

// GET /api/bookings/:bookingId
// get booking by id

exports.getBookingById = async (req, res) => {
    try{
        const booking = await Booking.findById(req.params.id);
        if(!booking){
            return res
            .status(404)
            .json({message: "booking is not found"});
        }
        return res.status(200).json({ data: booking });
    }catch (err){
        console.log(err);
        res.status(500).json({message:err.message});
    }
};

// GET /api/bookings/:userId
// get booking by user id
exports.getUserBookings = async (req, res) => {
    try{
        const bookings = await Booking.find({ userId: req.params.userId });
        if(!bookings){
            return res
            .status(404)
            .json({message: "booking is not found"});
        }
        return res.status(200).json({ results: bookings.length, data: bookings });
    }catch (err){
        console.log(err);
        res.status(500).json({message:err.message});
    }
};

// PUT /api/bookings/:bookingId/cancel
// Cancel booking by Id 
exports.cancelBooking = async (req, res) => {
    try{
            const booking = await Booking.findById(req.params.id);
            const flight = await Flight.findById(booking.flightId);
            if(!booking){
                return res
                .status(404)
                .json({message: "booking is not found"});
            };
            if(booking.bookingStatus === 'cancelled'){
                return res
                .status(404)
                .json({message: "booking is allready cancelled"});
            }
            await Flight.findByIdAndUpdate(booking.flightId, {
                availableSeats: flight.availableSeats + 1
            });
            booking.bookingStatus ="cancelled";
            if(booking.payment.paymentStatus === 'paid'){
                booking.payment.paymentStatus = 'failed';
            }
            await booking.save();
            return res.status(200).json({ message: "Booking cancelled successfully", data: booking });
        }catch (err){
            console.log(err);
            res.status(500).json({message:err.message});
        }
};

// PUT /api/bookings/:bookingId/confirm
// confirm booking by Id 
exports.confirmBooking = async (req, res) => {
    try{

            const booking = await Booking.findById(req.params["bookingId"]);
            const flight = await Flight.findById(req.body.flightId);
            if(!booking){
                return res
                .status(404)
                .json({message: "booking is not found"});
            };
            booking.bookingStatus ="confirmed";
            booking.payment.paymentStatus = "paid";
            booking.payment.paidAt = new Date();
            await booking.save();
            await Flight.findByIdAndUpdate(booking.flightId, {
                availableSeats: flight.availableSeats - 1
            });
            return res.status(200).json({ message: "Booking confirmed successfully", data: booking });
        }catch (err){
            console.log(err);
            res.status(500).json({message:err.message});
        }
};

// exports.createBooking = async (req, res) => {
//         res.status(201).json({ message: "" });
// };

// exports.getAllBookings = async (req, res) => {
//     res.status(200).json({ message: "" });
// };

// exports.getBookingById = async (req, res) => {
//     res.status(200).json({ message: "" });
// };

// exports.getUserBookings = async (req, res) => {
//     res.status(200).json({ message: "" });
// };

// exports.cancelBooking = async (req, res) => {
//     res.status(200).json({ message: "" });
// };
