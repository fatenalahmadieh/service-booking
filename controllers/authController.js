const validator = require("validator");
const User = require("../models/userSchema");
const jwt = require("jsonwebtoken");

//Utility: Sign Token
const signToken = (user)=>{
    return jwt.sign(
    {
      id: user._id,
      firstName:user.firstName,
      lastName:user.lastName,
      userType:user.userType,
      nationality:user.nationality
    },
      process.env.JWT_SECRET,
      {expiresIn: process.env.JWT_EXPIRES_IN || "15m"},
    );
}

//Utility:Create Send Token
const createSendToken = (user,statusCode,message,res)=>{
    const token = signToken(user);

    const sanitizeUser = {
        id:user._id,
        name:user.firstName,
        lastName:user.lastName,
        userType:user.userType,
        nationality:user.nationality,
    };
    res.status(statusCode).json({
        status:"Success",
        token,
        message,
        data:{user:sanitizeUser}
    });
}

//Create new User POST /api/Users
exports.signUp = async (req,res)=>{
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

        const newUser = await User.create({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            nationality: req.body.nationality,
            dateOfBirth: req.body.dateOfBirth,
            email:req.body.email,
            password:req.body.password,
            passwordConfirm:req.body.passwordConfirm,
            userType: req.body.userType,
            pilot: req.body.userType === 'Pilot' ? req.body.pilot : undefined,
            // Automatically parses passport details and allergies if passed in passenger object
            passenger: req.body.userType === 'Passenger' ? req.body.passenger : undefined, 
            host: req.body.userType === 'Host' ? req.body.host : undefined, //typo: 'Post' -> 'Host'
            admin: req.body.userType === 'Admin' ? req.body.admin : undefined,
        });
        
        // Log user in automatically upon successful registration
        createSendToken(newUser, 201, `User ${newUser.firstName} has been created successfully`, res);

    } catch (err) {
        console.log(err);
        res.status(500).json({message:err.message});
    }
}

//login system Post /api/Users/login
exports.login = async (req,res)=>{
    try {
        const {email,password}=req.body;
        const user = await User.findOne({ email });
        if(!user || !(await user.checkPassword(password,user.password))){
            return res.status(401).json({message:"Wrong User Credentials"});
        }
        createSendToken(user,200,"You are logged in successfully!!",res);
    } catch (err) {
        console.log(err);
        return res.status(500).json({message:err.message});
    }
}

exports.protect = async(req,res,next)=>{
    try {
       let token;
       const authHeader = req.headers.authorization;
       if(authHeader.startsWith("Bearer ")){
        token = authHeader.split(" ")[1]
       } ;
       if(!token){
        return res.status(401).json({message:"You are not Authenticated"});
       }
       const decoded = await jwt.verify(token,process.env.JWT_SECRET);

       const currentUser= await User.findById(decoded.id);
       if(!currentUser){
        return res.status(401).json({message:"User no longer exists"});
       }
       if (currentUser.passwordChangedAfterTokenIssued(decoded.iat)) {
          return res.status(401).json({ message: "You recently changed your password. Please log in again" })
       }
       req.user =currentUser;
       next();
    } catch (err) {
        if(err.name==="JsonWebTokenError"){
            return res.status(401).json({message:"Invalid Token!!"});
        }
        if(err.name==="TokenExpiredError"){
            return res.status(401).json({message:"Token Expired!!"});
        }
        res.status(500).json({message:"Something went wrong!!"});
    }
}

// Middleware to restrict access based on user classification
exports.restrictTo = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(500).json({ message: "User context missing. Ensure protect middleware is called first." });
        }
        if (!allowedRoles.includes(req.user.userType)) {
            return res.status(403).json({ 
                message: "Access Denied: You do not have permission to perform this action." 
            });
        }
        next();
    };
};
