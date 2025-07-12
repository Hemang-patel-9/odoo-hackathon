const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller.js");

router.delete("deleteAns/:id", adminController.deleteAnswer);
router.delete("deleteQue/:id", adminController.deleteAnswer);
router.get("/all", adminController.getAllUsers);

module.exports = router;