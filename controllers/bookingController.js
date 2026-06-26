const Booking = require('../models/bookingSchema');
const Flight = require('../models/flightSchema');
const User = require('../models/userSchema');

// POST /api/bookings
// create booking
exports.createBooking = async (req, res) => {
    try{
        const { flightId, seatsBooked, totalPrice, payment } = req.body;
        
        // 1. Fetch flight to check capacity
        const flight = await Flight.findById(flightId);
        if (!flight) {
            return res.status(404).json({ message: "Flight not found" });
        }

        if (flight.availableSeats < seatsBooked.length) {
            return res.status(400).json({ message: `Not enough available seats. Only ${flight.availableSeats} left.` });
        }

        // 2. Extract just the seat numbers to check availability
        const requestedSeatNumbers = seatsBooked.map(s => s.seatNumber);
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
            userId: req.user.id, // Grabbed securely from authController.protect
            flightId,
            seatsBooked, // Stores the array of names and seats
            totalPrice,
            bookingStatus: req.body.bookingStatus || "pending",
            payment: {
                amount: payment.amount,
                paymentMethod: payment.paymentMethod,
                paymentStatus: payment.paymentStatus,
                transactionId: payment.transactionId
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

            const booking = await Booking.findById(req.params.id);
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
// PUT /api/bookings/:bookingId/changeSeat
// change seat booking by Id
exports.changeSeat = async (req, res) => {
    try{
        const { oldSeat , newSeat } = req.body;
        const booking = await Booking.findById(req.params.id);
        if(!booking){
                return res
                .status(404)
                .json({message: "booking is not found"});
        };
        // check if the old seat equal to the new seat
        if(booking.seatNumber !== oldSeat){
            return res
            .status(404)
            .json({message: "You are reserved the same seat"});
        };
        // check if the seat is available 
        const seatReserved = await Booking.findOne({
            flightId: booking.flightId,
            seatNumber: newSeat,
            bookingStatus: { $ne:"cancelled" },
        });
        if(seatReserved){
            return res
            .status(404)
            .json({message: "The new seat is already reserved"});
        };
        // send the new booking 
        booking.seatNumber = newSeat;
        await booking.save();

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
