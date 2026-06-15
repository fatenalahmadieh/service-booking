const User = require("../models/userSchema");
exports.booking=async(req,res)=>{
    try{
        
    }catch(err){
        console.log(err);
        res.status(500).json({message:err.message});
    }
}