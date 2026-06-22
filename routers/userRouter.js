const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");


router.put("/users/:id", userController.updateUser);
router.delete("/users/:id", userController.deleteUser);
//protect the info without getting info
router.get("/users/:id", authController.protect,userController.getUserById);

module.exports = router;