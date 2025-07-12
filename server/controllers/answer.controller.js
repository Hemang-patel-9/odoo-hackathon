const Answer = require("../model/answer.model.js");
const Question = require("../model/question.model.js");
const Notification = require("../model/notification.model.js");


// ✅ Post an answer
const postAnswer = async (req, res) => {
    try {
        const { questionId } = req.params;
        const { content, author } = req.body;

        const question = await Question.findById(questionId);
        if (!question) return res.status(404).json({ message: "Question not found" });

        const newAnswer = new Answer({ content, question: questionId, author });
        await newAnswer.save();

        // ✅ Create notification for question owner
        if (question.author.toString() !== author) {
            const notif = new Notification({
                user: question.author,
                message: "Someone answered your question.",
                question: questionId,
                type: "answer",
            });
            await notif.save();
        }

        res.status(201).json({ message: "Answer posted", data: newAnswer });
    } catch (error) {
        res.status(500).json({ message: "Error posting answer", error: error.message });
    }
};


// ✅ Get all answers to a question
const getAnswersByQuestion = async (req, res) => {
    try {
        const answers = await Answer.find({ question: req.params.questionId })
            .sort({ createdAt: -1 })
            .populate("author", "name");

        res.status(200).json({ message: "Answers fetched", data: answers });
    } catch (error) {
        res.status(500).json({ message: "Error fetching answers", error: error.message });
    }
};

// ✅ Vote on an answer
const voteAnswer = async (req, res) => {
    try {
        const { answerId } = req.params;
        const { voteType, userId } = req.body;

        const answer = await Answer.findById(answerId);
        if (!answer) return res.status(404).json({ message: "Answer not found" });

        const existingVoteIndex = answer.votes.findIndex(v => v.user.toString() === userId);

        if (existingVoteIndex !== -1) {
            if (answer.votes[existingVoteIndex].vote === voteType) {
                answer.votes.splice(existingVoteIndex, 1);
            } else {
                answer.votes[existingVoteIndex].vote = voteType;
            }
        } else {
            answer.votes.push({ user: userId, vote: voteType });
        }

        await answer.save();
        const voteSum = answer.votes.reduce((acc, v) => acc + v.vote, 0);

        // ✅ Create notification for answer author
        if (answer.author.toString() !== userId) {
            const notif = new Notification({
                user: answer.author,
                message: voteType === 1 ? "Someone liked your answer." : "Someone disliked your answer.",
                question: answer.question,
                type: "review",
            });
            await notif.save();
        }

        res.status(200).json({ message: "Vote updated", totalVotes: voteSum });
    } catch (error) {
        res.status(500).json({ message: "Error voting answer", error: error.message });
    }
};

// ✅ Delete answer (author-only check skipped)
const deleteAnswer = async (req, res) => {
    try {
        const { id } = req.params;
        await Answer.findByIdAndDelete(id);
        res.status(200).json({ message: "Answer deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting answer", error: error.message });
    }
};

module.exports = {
    postAnswer,
    getAnswersByQuestion,
    voteAnswer,
    deleteAnswer,
};
