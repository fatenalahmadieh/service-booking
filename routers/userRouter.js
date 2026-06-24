const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");


router.put("/users/:id",authController.protect, 
    authController.restrictTo('Admin'), userController.updateUser);
router.delete("/users/:id",authController.protect, 
    authController.restrictTo('Admin'), userController.deleteUser);
//protect the info without getting info
router.get("/users/:id", authController.protect, 
    authController.restrictTo('Admin'),userController.getUserById);

module.exports = router;