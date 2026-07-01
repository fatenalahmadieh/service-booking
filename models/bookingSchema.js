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
        /* doesn't allow having different seats in one booking
        seatNumber: {
            type: String,
            required: true
        },*/
        // array of passengers booked under this request
        seatsBooked: [{
            passengerName: { type: String, required: true },
            seatNumber: { type: String, required: true },
            ticketClass: {
                type: String,
                enum: ['Economy', 'Premium Economy', 'Business Class', 'First Class'],
                required: true
            },
            mealType: { 
                type: String, 
                default: 'Standard' 
            },
            seatPrice: { 
                type: Number, 
                required: true 
            },
            baggageWeightKg: { type: Number, default: 0 },
            extraBaggageKg: { type: Number, default: 0 },
            extraBaggageFee: { type: Number, default: 0 }
        }],
        totalPrice: {
            type: Number,
            required: true
        },
        bookingStatus: {
            type: String,
            enum: ["pending", "confirmed", "cancelled"],
            default: "pending"
        },
        payment:{
            amount: {
                type: Number,
                required: true
            },
            paymentMethod: {
                type: String,
                enum: ["cash", "card"]
            },
            paymentStatus: {
                type: String,
                enum: ["pending", "paid", "failed"],
                default: "pending"
            },
            transactionId: {
                type: String
            },
            paidAt: {
                type: Date,
            },
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
