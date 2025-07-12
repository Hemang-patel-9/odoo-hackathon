const express = require("express");
const router = express.Router();
const answerController = require("../controllers/answer.controller");

// No middleware used
router.post("/:questionId", answerController.postAnswer);
router.get("/question/:questionId", answerController.getAnswersByQuestion);
router.post("/:answerId/vote", answerController.voteAnswer);
router.delete("/:id", answerController.deleteAnswer);

module.exports = router;
