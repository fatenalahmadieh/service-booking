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
            }
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
