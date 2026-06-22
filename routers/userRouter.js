const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/users", userController.createUser);
router.post("/users/login",userController.login);
router.put("/users/:id", userController.updateUser);
router.delete("/users/:id", userController.deleteUser);
router.get("/users/:id", userController.getUserById);

module.exports = router;