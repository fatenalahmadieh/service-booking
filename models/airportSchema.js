const mongoose=require('mongoose');

const airportSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            required: true
        },
        code: {
            type: String,
            required: true,
            unique: true
        },
        city: {
            type: String,
            required: true,
        },
        country: {
            type: String,
            required: true, 
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Airport", airportSchema);