const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const bookingSchema=new Schema({
    seatNumber:{
        type:String,
        required:true,
    },
    bookingStatus:{
        enum:['pending','confirmed','cancelled','completed'],
        required:true,
    },
    totalPrice:{
        type:Number,
        required:true,
    },
    passenger:{
        type:Schema.Types.ObjectId,
        ref:'Passenger',
    },
    flight:{
        type:Schema.Types.ObjectId,
        ref:'Flight',
    },
},
{timestamps:true},
)
module.exports=mongoose.model('Booking',bookingSchema);