const User = require("../models/userSchema");
const Flight=require("../models/flightSchema");
const Booking= require("../models/bookingSchema");
exports.booking=async(req,res)=>{
    try{
        const {userID, flightID,seatNumber, totalPrice}=req.body;
        const flight=await Flight.findById(flightID);
        if(!flight){
            return res.status(404).json({message:"Flight not found"});
        }
        if(flight.capacity<=0){
            return res.status(400).json({message:"Flight is full"});
        }
        flight.capacity-=1;
        await flight.save();
        
        const bookedFlight=new Booking({
            seatNumber,
            bookingStatus:'confirmed',
            totalPrice,
            passenger:userID,
            flight:flightID,
        });
        await bookedFlight.save();
        res.status(201).json({
            message:"New Booking Added Successfully"
        });
    }catch(err){
        console.log(err);
        res.status(500).json({message:err.message});
    }
}