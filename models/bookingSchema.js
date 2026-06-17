const mongoose=require('mongoose');

const bookingSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        flightId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Flight"
        },
        passengerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Passenger"
        },
        seatNumber: {
            type: String
        },
        totalPrice: {
            type: Number,
            required: true
        },
        bookingStatus: {
            type: String,
            enum: ["pending", "confirmed", "cancelled"],
            default: "pending"
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);