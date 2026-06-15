const express=require('express');
const router=express.Router();
const userController=require("../controllers/passengerController");

router.post("/users/flight", userController.bookFlight);      
module.exports=router;