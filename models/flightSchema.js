const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const flightSchema=new Schema({
    flightNumber:{
        type:String,
        required:true,
    },
    airline:{
        type:String,
        required:true,
    },
    departureAirport:{
        type:String,
        required:true,
    },
    arrivalAirport: {
        type:String,
        required:true,
    },
    departureTime: {
        type:Date,
        required:true,
    },
    arrivalTime:{
        type:Date,
        required:true,
    },
    seats: [{
        seatNumber: { 
            type: String, 
            required: true ,
        },
        ticketClass: {
            type: String,
            enum: ['Economy', 'Premium Economy', 'Business Class', 'First Class'],
            required: true,
        },
        price: { 
            type: Number, 
            required: true ,
        },
        status: {
            type: String,
            enum: ['available', 'reserved', 'booked'],
            default: 'available',
        },
    }],
    baggageAllowanceKg: {
        type: Number,
        default: 20
    },
    overweightFeePerKg: {
        type: Number,
        default: 10
    },
    airport:{
        name:{
            type: String,
            required: true
        },
        code: {
            type: String,
            required: true,
            unique: true
        },
        city: {
            type: String,
            required: true,
        },
        country: {
            type: String,
            required: true, 
        }
    },
    status: {
        type: String,
        enum: ["scheduled", "delayed", "cancelled"],
        default: "scheduled"
    }
},
{timestamps:true},
);
module.exports=mongoose.model('Flight',flightSchema);
