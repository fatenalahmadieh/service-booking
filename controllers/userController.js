const User = require("../models/userSchema");
const Flight = require("../models/flightSchema");
const Booking = require("../models/bookingSchema");

exports.createUser = async (req, res) => {
    try {
        
        return res.status(201).json({
            message: "User created successfully",
            data: newUser
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: err.message });
    }
};

exports.updateUser = async (req, res) => {
    try {

        return res.status(200).json({
            message: "User updated successfully",
            data: updatedUser
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: err.message });
    }
};
// DELETE /api/User/:id
// delete user
exports.deleteUser = async (req, res) => {
    try {
        const userCheck = await User.findById(req.params["id"]);
            if(!userCheck){
                return res
                .status(401)
                .json({message: "user is not found"});
            };
        await User.findByIdAndDelete(req.params["id"]);
        return res.status(200).json({
            message: "User deleted successfully"
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: err.message });
    }
};

// exports.booking = async (req, res) => {
//     try {
//         const {userID, flightID, seatNumber, totalPrice} = req.body;
//         const flight = await Flight.findById(flightID);
//         if(!flight){
//             return res.status(404).json({message:"Flight not found"});
//         }
//         if(flight.availableSeats <= 0){
//             return res.status(400).json({message:"Flight is full"});
//         }
//         flight.availableSeats -= 1;
//         await flight.save();
        
//         const bookedFlight = new Booking({
//             seatNumber,
//             bookingStatus: 'confirmed',
//             totalPrice,
//             passenger: userID,
//             flight: flightID,
//         });
//         await bookedFlight.save();
//         res.status(201).json({
//             message: "New Booking Added Successfully"
//         });
//     }catch(err){
//         console.log(err);
//         res.status(500).json({message:err.message});
//     }
// }

// GET    /api/User/:id
// get user by id
exports.getUserById = async (req, res) => {
    try {
        const userCheck = await User.findById(req.params["id"]);
        if(!userCheck){
            return res
            .status(401)
            .json({message: "user is not found"});
        };
        return res.status(200).json({ data: "user" });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: err.message });
    }
};
