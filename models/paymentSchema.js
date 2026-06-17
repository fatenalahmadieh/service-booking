const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
    {
        bookingID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Booking",
            required: true
        },
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
    },
    { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);