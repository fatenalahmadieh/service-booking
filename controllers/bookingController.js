const Booking = require('../models/bookingSchema');
const Flight = require('../models/flightSchema');
const User = require('../models/userSchema');

const calculateBaggageCharges = (seatsBooked, flight) => {
    const allowance = flight.baggageAllowanceKg || 20;
    const feePerKg = flight.overweightFeePerKg || 10;
    let baggageFeeTotal = 0;
    const enrichedSeats = seatsBooked.map(seat => {
        const baggageWeightKg = Number(seat.baggageWeightKg || 0);
        const extraBaggageKg = Math.max(0, baggageWeightKg - allowance);
        const extraBaggageFee = extraBaggageKg * feePerKg;
        baggageFeeTotal += extraBaggageFee;
        return {
            ...seat,
            baggageWeightKg,
            extraBaggageKg,
            extraBaggageFee
        };
    });
    return { baggageFeeTotal, enrichedSeats };
};

// POST /api/bookings
// create group/single booking
exports.createBooking = async (req, res) => {
    try {
        const { flightId, seatsBooked, totalPrice, payment } = req.body;
        
        if (!Array.isArray(seatsBooked) || seatsBooked.length === 0) {
            return res.status(400).json({ message: "At least one passenger seat must be provided." });
        }

        // 1. Fetch flight to check capacity
        const flight = await Flight.findById(flightId);
        if (!flight) {
            return res.status(404).json({ message: "Flight not found" });
        }

        if (flight.availableSeats < seatsBooked.length) {
            return res.status(400).json({ message: `Not enough available seats. Only ${flight.availableSeats} left.` });
        }

        const { baggageFeeTotal, enrichedSeats } = calculateBaggageCharges(seatsBooked, flight);
        const computedTotalPrice = (flight.price * seatsBooked.length) + baggageFeeTotal;
        const finalTotalPrice = totalPrice !== undefined ? Number(totalPrice) : computedTotalPrice;

        if (finalTotalPrice < computedTotalPrice) {
            return res.status(400).json({
                message: `Total price must cover flight fare plus baggage fees. Minimum ${computedTotalPrice}.`
            });
        }

        // 2. Extract just the seat numbers to check availability
        const requestedSeatNumbers = seatsBooked.map(s => s.seatNumber);
        
        // 3. Search inside the array structure of seatsBooked to see if any are taken
        const existingBooking = await Booking.findOne({
            flightId,
            "seatsBooked.seatNumber": { $in: requestedSeatNumbers },
            bookingStatus: { $ne: "cancelled" }
        });

        if (existingBooking) {
            return res.status(409).json({ message: "One or more requested seats are already occupied." });
        }

        // 4. Create the group booking
        const newBooking = await Booking.create({
            userId: req.user.id, // Securely grabbed from authController.protect
            flightId,
            seatsBooked: enrichedSeats,
            totalPrice: finalTotalPrice,
            bookingStatus: req.body.bookingStatus || "pending",
            payment: {
                amount: payment.amount,
                paymentMethod: payment.paymentMethod,
                paymentStatus: payment.paymentStatus,
                transactionId: payment.transactionId
            }
        });

        return res.status(201).json({ data: newBooking, message: "Booking created successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};

// GET /api/bookings
exports.getAllBooking = async (req, res) => {
    try {
        const bookings = await Booking.find({});
        return res.status(200).json({ results: bookings.length, data: bookings });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};

// GET /api/bookings/:id
exports.getBookingById = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }
        return res.status(200).json({ data: booking });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};

// GET /api/bookings/:userId
exports.getUserBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ userId: req.params.userId });
        if (!bookings) {
            return res.status(404).json({ message: "Booking not found" });
        }
        return res.status(200).json({ results: bookings.length, data: bookings });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};

// PUT /api/bookings/:id/cancel
exports.cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }
        if (booking.bookingStatus === 'cancelled') {
            return res.status(400).json({ message: "Booking is already cancelled" });
        }

        const flight = await Flight.findById(booking.flightId);
        const seatsToRestore = booking.seatsBooked ? booking.seatsBooked.length : 1;

        await Flight.findByIdAndUpdate(booking.flightId, {
            availableSeats: flight.availableSeats + seatsToRestore
        });

        booking.bookingStatus = "cancelled";
        if (booking.payment.paymentStatus === 'paid') {
            booking.payment.paymentStatus = 'failed';
        }
        await booking.save();
        return res.status(200).json({ message: "Booking cancelled successfully", data: booking });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};

// PUT /api/bookings/:id/confirm
exports.confirmBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }
        if (booking.bookingStatus === 'confirmed') {
            return res.status(400).json({ message: "Booking is already confirmed" });
        }

        const flight = await Flight.findById(booking.flightId);
        if (!flight) {
            return res.status(404).json({ message: "Flight not found" });
        }

        booking.bookingStatus = "confirmed";
        booking.payment.paymentStatus = "paid";
        booking.payment.paidAt = new Date();
        await booking.save();

        // Fixed Math Error: Deduct exact number of seats in the array
        const seatsToDeduct = booking.seatsBooked ? booking.seatsBooked.length : 1;
        await Flight.findByIdAndUpdate(booking.flightId, {
            $inc: { availableSeats: -seatsToDeduct }
        });

        // Loyalty Rewards Calculation
        const user = await User.findById(booking.userId);
        if (user && user.userType === 'Passenger') {
            const pointsEarned = Math.round(booking.totalPrice * 0.10);
            user.passenger.loyaltyProgram.pointsBalance += pointsEarned;

            const currentPoints = user.passenger.loyaltyProgram.pointsBalance;
            if (currentPoints >= 1000) {
                user.passenger.loyaltyProgram.tier = 'Platinum';
            } else if (currentPoints >= 500) {
                user.passenger.loyaltyProgram.tier = 'Gold';
            } else if (currentPoints >= 200) {
                user.passenger.loyaltyProgram.tier = 'Silver';
            } else {
                user.passenger.loyaltyProgram.tier = 'Bronze';
            }
            user.markModified('passenger');
            await user.save();
        }

        return res.status(200).json({ message: "Booking confirmed successfully", data: booking });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};

// PUT /api/bookings/:id/purchase-baggage
exports.purchaseExtraBaggage = async (req, res) => {
    try {
        const { seatNumber, additionalKg } = req.body;
        if (!seatNumber || typeof additionalKg !== 'number' || additionalKg <= 0) {
            return res.status(400).json({ message: "seatNumber and positive additionalKg are required." });
        }

        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }
        if (booking.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: "You are not allowed to update this booking." });
        }
        if (booking.bookingStatus === 'cancelled') {
            return res.status(400).json({ message: "Cannot purchase baggage for a cancelled booking." });
        }

        const flight = await Flight.findById(booking.flightId);
        if (!flight) {
            return res.status(404).json({ message: "Flight not found" });
        }

        const seat = booking.seatsBooked.find(s => s.seatNumber === seatNumber);
        if (!seat) {
            return res.status(404).json({ message: "Passenger seat not found in booking." });
        }

        const allowance = flight.baggageAllowanceKg || 20;
        const feePerKg = flight.overweightFeePerKg || 10;
        const currentWeight = Number(seat.baggageWeightKg || 0);
        const newWeight = currentWeight + additionalKg;
        const newExtraBaggageKg = Math.max(0, newWeight - allowance);
        const newExtraBaggageFee = newExtraBaggageKg * feePerKg;
        const oldExtraBaggageFee = Number(seat.extraBaggageFee || 0);

        seat.baggageWeightKg = newWeight;
        seat.extraBaggageKg = newExtraBaggageKg;
        seat.extraBaggageFee = newExtraBaggageFee;

        booking.totalPrice = Number(booking.totalPrice) + (newExtraBaggageFee - oldExtraBaggageFee);

        await booking.save();
        return res.status(200).json({ message: "Extra baggage purchased successfully", data: booking });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};

// PUT /api/bookings/:id/changeSeat
exports.changeSeat = async (req, res) => {
    try {
        const { oldSeat, newSeat } = req.body;
        const booking = await Booking.findById(req.params.id);
        
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }
        if (booking.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: "You are not allowed to change this booking." });
        }
        if (oldSeat === newSeat) {
            return res.status(400).json({ message: "You have reserved the same seat" });
        }

        // Find the index of the seat being updated within the array
        const seatIndex = booking.seatsBooked.findIndex(s => s.seatNumber === oldSeat);
        if (seatIndex === -1) {
            return res.status(404).json({ message: "The original seat was not found in this booking" });
        }

        // Check if the requested new seat is available anywhere on this flight
        const seatReserved = await Booking.findOne({
            flightId: booking.flightId,
            "seatsBooked.seatNumber": newSeat,
            bookingStatus: { $ne: "cancelled" }
        });

        if (seatReserved) {
            return res.status(409).json({ message: "The new seat is already reserved" });
        }

        // Safely update the matching element inside the array configuration
        booking.seatsBooked[seatIndex].seatNumber = newSeat;
        await booking.save();

        return res.status(200).json({ message: "Seat changed successfully", data: booking });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};