// utils/loyaltyService.js
const User = require('../models/userSchema');

exports.updatePassengerLoyalty = async (userId, totalPrice) => {
    const user = await User.findById(userId);
    if (!user || user.userType !== 'Passenger') return null;

    
    const pointsEarned = Math.round(totalPrice * 0.10);
    user.passenger.loyaltyProgram.pointsBalance += pointsEarned;

    
    const currentPoints = user.passenger.loyaltyProgram.pointsBalance;
    if (currentPoints >= 1000) user.passenger.loyaltyProgram.tier = 'Platinum';
    else if (currentPoints >= 500) user.passenger.loyaltyProgram.tier = 'Gold';
    else if (currentPoints >= 200) user.passenger.loyaltyProgram.tier = 'Silver';
    else user.passenger.loyaltyProgram.tier = 'Bronze';

    
    await user.save();

    // Return the summary data back to the controller
    return {
        pointsEarned,
        newPointsBalance: user.passenger.loyaltyProgram.pointsBalance,
        currentTier: user.passenger.loyaltyProgram.tier
    };
};