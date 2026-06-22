const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName : {
        type: String,
        required: true
    },
    lastName : {
        type: String,
        required: true
    },
    nationality: {
        type: String,
        required: true
    },
    dateOfBirth:{
        type: Date
    },
    userType:{
        type: String,
        enum:['Pilot','Passenger','host','admin'],
        required:true,
    },
    pilot:{
        rank: {
            type: String,
            enum: ['Captain', 'First Officer', 'Second Officer'],
            required: true
            },
        licenseNumber: {
            type: String,
            required: true
            }
    },
    passenger:{
        passportNumber: {
                type: String,
                required: true
            },
            passportExpiryDate: {
                type: Date,
                required: true
            },
    },
    host:{
        subRole: {
            type: String,
            enum: ['Purser', 'Senior Cabin Crew', 'Flight Attendant', 'Ground Host'],
            default: 'Flight Attendant',
            required: true
        },
        assignedCabinClass: {
            type: String,
            enum: ['Economy', 'Business', 'First Class', 'All'],
            default: 'Economy'
        },
        languagesSpoken: {
            type: [String], 
            required: true,
            default: ['English']
        },
        certificationExpiry: {
            type: Date,
            description: "Tracks when their mandatory flight safety/medical certs expire"
        },
        status: {
            type: String,
            enum: ['On Duty', 'Off Duty', 'On Leave', 'Standby'],
            default: 'Off Duty'
        },
    },
    admin:{
        role: {
            type: String,
            enum: ['SuperAdmin', 'Manager', 'Support'],
            default: 'Support',
            required: true
        },
        permissions: {
            type: [String], 
            default: []
        },
        
        lastLogin: {
            type: Date
        },
        assignedRegion: {
            type: String,
            description: "Limits their admin actions to a specific city or country"
        }
    },
},
{ timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
