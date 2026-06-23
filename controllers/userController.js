const User = require("../models/userSchema");
const Flight = require("../models/flightSchema");
const Booking = require("../models/bookingSchema");
const userSchema = require("../models/userSchema");

// create /api/User/:id
// craete user
exports.createUser = async (req, res) => {
    try {
        const userCheck = await User.findOne({$or: [
            {firstName: req.body["firstName"]},
            {lastName: req.body["lastName"]},
            {email: req.body["email"]},
            {password: req.body["password"]},
            {nationality: req.body["nationality"]},
            {dateOfBirth: req.body["dateOfBirth"]},
            {userType: req.body["userType"]},
    ]});
    if(user){
            return res
            .status(409)
            .json({message: "User is already found"});
    };
    const newUser = await userSchema.create({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password,
            nationality: req.body.nationality,
            dateOfBirth: req.body.dateOfBirth,
            userType: req.body.userType,
            pilot: req.body.userType === 'pilot' ? req.body.pilot : undefined,
            passenger: req.body.userType === 'passenger' ? req.body.pilot : undefined,
            host: req.body.userType === 'host' ? req.body.pilot : undefined,
            admin: req.body.userType === 'admin' ? req.body.pilot : undefined,
    });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: err.message });
    }
};

// Update /api/User/:id
// update user
exports.updateUser = async (req, res) => {
    try {
        const userCheck = await User.findOne({$or: [
            {firstName: req.body["firstName"]},
            {lastName: req.body["lastName"]},
            {email: req.body["email"]},
            {password: req.body["password"]},
            {nationality: req.body["nationality"]},
            {dateOfBirth: req.body["dateOfBirth"]},
            {userType: req.body["userType"]},
        ]});
        if(user){
            return res
            .status(409)
            .json({message: "User is already found"});
        };
        const updatedUser = await User.findByIdAndUpdate(
            req.params["id"],
            {
            ffirstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password,
            nationality: req.body.nationality,
            dateOfBirth: req.body.dateOfBirth,
            userType: req.body.userType,
            pilot: req.body.userType === 'pilot' ? req.body.pilot : undefined,
            passenger: req.body.userType === 'passenger' ? req.body.pilot : undefined,
            host: req.body.userType === 'host' ? req.body.pilot : undefined,
            admin: req.body.userType === 'admin' ? req.body.pilot : undefined,
            },
            { new: true }
            );
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
