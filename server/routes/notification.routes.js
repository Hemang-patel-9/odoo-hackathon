const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notification.controller.js");

router.put("/read/:id", notificationController.markNotificationAsRead);
router.get("/user/:id", notificationController.getNotificationByUserId);

module.exports = router;