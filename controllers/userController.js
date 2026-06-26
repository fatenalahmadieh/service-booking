const User = require("../models/userSchema");
const Flight = require("../models/flightSchema");
const Booking = require("../models/bookingSchema");

// Update /api/User/:id
// update user
exports.updateUser = async (req, res) => {
    try {
        const userCheck = await User.findById(req.params.id);
        if(!userCheck){
            return res
            .status(409)
            .json({message: "User is not found"});
        }

        // Normalize user type formatting to match Schema Enums ('Pilot', 'Passenger', etc.)
        const role = req.body.userType;

        const updatedUser = await User.findByIdAndUpdate(
            req.params["id"],
            {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: req.body.password,
                nationality: req.body.nationality,
                dateOfBirth: req.body.dateOfBirth,
                userType: role,
                pilot: role === 'Pilot' ? req.body.pilot : undefined,
                passenger: role === 'Passenger' ? {
                    passportNumber: req.body.passenger?.passportNumber,
                    passportExpiryDate: req.body.passenger?.passportExpiryDate,
                    allergies: req.body.passenger?.allergies // Handles array of allergies incoming from request
                } : undefined,
                host: role === 'Host' ? req.body.host : undefined,
                admin: role === 'Admin' ? req.body.admin : undefined,
            },
            { new: true, runValidators: true }
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
        }
        await User.findByIdAndDelete(req.params["id"]);
        return res.status(200).json({
            message: "User deleted successfully"
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: err.message });
    }
};

// GET    /api/User/:id
// get user by id
exports.getUserById = async (req, res) => {
    try {
        const userCheck = await User.findById(req.params["id"]);
        if(!userCheck){
            return res
            .status(404)
            .json({message: "user is not found"});
        }
        return res.status(200).json({ data: userCheck });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: err.message });
    }
};