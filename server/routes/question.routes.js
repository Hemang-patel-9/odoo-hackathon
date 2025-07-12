const express = require("express");
const router = express.Router();
const questionController = require("../controllers/question.controller.js");

router.post("/", questionController.createQuestion);
router.get("/", questionController.getAllQuestions);
router.get("/:id", questionController.getQuestionById);
router.post("/:id/vote", questionController.voteQuestion);
router.post("/:questionId/accept", questionController.acceptAnswer);
router.get("/tag/:tag", questionController.getQuestionsByTag);
router.put("/:id", questionController.updateQuestion);
router.delete("/:id", questionController.deleteQuestion);

module.exports = router;
