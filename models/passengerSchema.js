const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const passengerSchema = new Schema({
    fullName : {
        type: String,
        required: true
    },
    passportNumber: {
        type: String,
        required:true
    },
    nationality: {
        type: String,
        required: true
    },
    dateOfBirth:{
        type: Date
    }
},
{ timestamps: true }
);
module.exports = mongoose.model("Passenger", passengerSchema);
