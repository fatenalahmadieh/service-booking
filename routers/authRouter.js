const express = require('express');
const router = express.Router();
const userController = require("../controllers/authController");

router.post("/users", userController.signUp);
router.post("/users/login",userController.login);

module.exports = router;