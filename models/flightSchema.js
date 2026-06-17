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
        type: mongoose.Schema.Types.ObjectId,
        ref: "Airport"
    },
    arrivalAirport: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Airport"
    },
    departureTime: {
        type:Date,
        required:true,
    },
    arrivalTime:{
        type:Date,
        required:true,
    },
    price: {
        type: Number,
        required:true
    },
    availableSeats:{
        type:Number,
        required:true,
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