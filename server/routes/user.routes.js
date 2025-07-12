const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller.js");

router.post("/signup", userController.signup);
router.post("/login", userController.login);
router.get("/all", userController.getAllUsers);
router.get("/:id", userController.getUserById)
router.patch("/ban/:id", userController.banUser);
router.patch("/unban/:id", userController.unbanUser);
router.get('/profile/:userId', userController.getUserProfileData);


module.exports = router;
