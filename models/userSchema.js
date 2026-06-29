const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

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
    email:{
        type:String,
        unique:true,
        required:[true,"Email is required!!"],
        maxLength:80,
        lowercase:true
    }
    ,
    password:{
         type:String,
        required:true,
        trim:true,
    }
    ,
    passwordConfirm:{
         type:String,
            trim:true,
    },
    passwordChangedAt:Date
    ,
    userType:{
        type: String,
        enum:['Pilot','Passenger','Host','Admin'],
        required:true,
    },
    pilot: {
        type: {
            rank: {
                type: String,
                enum: ['Captain', 'First Officer', 'Second Officer'],
            },
            licenseNumber: {
                type: String,
            }
        },
        default: undefined
    },
    passenger: {
        type: {
            passportNumber: {
                type: String,
            },
            passportExpiryDate: {
                type: Date,
            },
            allergies: [{
                allergen: { 
                    type: String, 
                    required: true 
                },
                severity: { 
                    type: String, 
                    enum: ['Mild', 'Moderate', 'Severe'], 
                    default: 'Mild' 
                },
                notes: { 
                    type: String 
                }
            }],
            loyaltyProgram: {
                frequentFlyerNumber: {
                    type: String,
                    unique: true,
                    sparse: true // Enforces uniqueness only for accounts with this field
                },
                pointsBalance: {
                    type: Number,
                    default: 0
                },
                tier: {
                    type: String,
                    enum: ['Bronze', 'Silver', 'Gold', 'Platinum'],
                    default: 'Bronze'
                }
            }
        },
        default: undefined
    },
    host: {
        type: {
            subRole: {
                type: String,
                enum: ['Purser', 'Senior Cabin Crew', 'Flight Attendant', 'Ground Host'],
                default: 'Flight Attendant',
            },
            assignedCabinClass: {
                type: String,
                enum: ['Economy', 'Business', 'First Class', 'All'],
                default: 'Economy'
            },
            languagesSpoken: {
                type: [String], 
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
            }
        },
        default: undefined
    },
    admin: {
        type: {
            role: {
                type: String,
                enum: ['SuperAdmin', 'Manager', 'Support'],
                default: 'Support',
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
        default: undefined
    },
        loyaltyProgram: {
            frequentFlyerNumber: {
                type: String,
                unique: true,
                sparse: true // Enforces uniqueness only for accounts with this field
            },
            pointsBalance: {
                type: Number,
                default: 0
            },
            tier: {
                type: String,
                enum: ['Bronze', 'Silver', 'Gold', 'Platinum'],
                default: 'Bronze'
            }
        }
    ,
    },


{ timestamps: true }
);
//Pre hook for the password and hashing the password + generating loyalty number
// Pre hook for the password, hashing the password, and generating loyalty number
userSchema.pre("save", async function() {
    // 1. Password hashing
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 12);
        this.passwordConfirm = undefined;
    }
    
    // 2. Loyalty Number Generation (Only for new Passengers)
    if (this.userType === 'Passenger') {
        // Initialize the object safely so we don't hit an 'undefined' error
        if (!this.passenger.loyaltyProgram) {
            this.passenger.loyaltyProgram = {};
        }

        if (!this.passenger.loyaltyProgram.frequentFlyerNumber) {
            const randomNumber = Math.floor(100000 + Math.random() * 900000);
            this.passenger.loyaltyProgram.frequentFlyerNumber = `FLY-${randomNumber}`;
        }
    }
});
userSchema.methods.checkPassword = async function(candidatePassword,userPassword){
    return await bcrypt.compare(candidatePassword,userPassword);
}
// userSchema.js (Add this below your pre-save hook and above checkPassword)

userSchema.methods.passwordChangedAfterTokenIssued = function(JWTTimestamp) {
    if (this.passwordChangedAt) {
        // Convert the date to a timestamp in seconds to match the JWT `iat` format
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        
        // If the token was issued BEFORE the password was changed, return true
        return JWTTimestamp < changedTimestamp; 
    }

    // False means the password was NOT changed after the token was issued
    return false;
};


module.exports = mongoose.model("User", userSchema);
