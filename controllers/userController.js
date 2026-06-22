const User = require("../models/userSchema");
const Flight = require("../models/flightSchema");
const Booking = require("../models/bookingSchema");
const validator = require("validator");
const userSchema = require("../models/userSchema");
//Create new User POST /api/Users
exports.createUser =async (req,res)=>{
    try {
        if(!validator.isEmail(req.body["email"])){
            return res.status(400).json({message:'Invalid email address!!'});
        }
    const checkUserExistence = await User.findOne({
        $or:[{email:req.body.email},{username:req.body.username}],
    });
    if(checkUserExistence){
        return res.status(409).json({message:"User already exist!!"});
    }
    if(req.body.password !== req.body.passwordConfirm){
        return res.status(400).json({message:"Please enter matching password!!"});
    }

    const newUser = await userSchema.create({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            nationality: req.body.nationality,
            dateOfBirth: req.body.dateOfBirth,
            email:req.body.email,
            password:req.body.password,
            passwordConfirm:req.body.passwordConfirm,
            userType: req.body.userType,
            pilot: req.body.userType === 'pilot' ? req.body.pilot : undefined,
            passenger: req.body.userType === 'passenger' ? req.body.pilot : undefined,
            host: req.body.userType === 'host' ? req.body.pilot : undefined,
            admin: req.body.userType === 'admin' ? req.body.pilot : undefined,
            });
         return res.status(200).json({message:`User `+req.body.firstName+' has been created'});
        }
            catch (err) {
        console.log(err);
        res.status(500).json({message:err.message});
    }
   

}
//login system Post /api/Users/login
exports.login = async (req,res)=>{
    try {
        const {email,password}=req.body;
        const user = await User.findOne({
            email
        });
        if(!user || (await user.checkPassword(password,user.password))){
            //we dont specify what is wrong so the hijacker doesn't know whats wrong
            return res.status(401).json({message:"Wrong User Credentials"});
        }
        return res.status(200).json({message:"Logged in successfully"});
    } catch (err) {
        console.log(err);
        return res.status(500).json({message:err.message});
    }
}
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
