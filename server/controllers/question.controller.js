const Question = require("../model/question.model.js");
const Notification = require("../model/notification.model.js");
const Answer = require("../model/answer.model.js");

// ✅ Create a new question
const createQuestion = async (req, res) => {
    try {
        const { title, description, tags, author } = req.body;

        const newQuestion = new Question({
            title,
            description,
            tags,
            author,
        });

        await newQuestion.save();
        res.status(201).json({ message: "Question created successfully", data: newQuestion });
    } catch (error) {
        res.status(500).json({ message: "Error creating question", error: error.message });
    }
};

// ✅ Get all questions
// ✅ Get all questions with answer count
const getAllQuestions = async (req, res) => {
    try {
        // Find all questions and populate the author field
        const questions = await Question.find()
            .sort({ createdAt: -1 })
            .populate("author", "name email")
            .exec(); // .exec() is optional but it's good practice to use it with `find()` for better error handling

        // For each question, get the answer count
        const questionsWithAnswerCount = await Promise.all(
            questions.map(async (question) => {
                const answerCount = await Answer.countDocuments({ question: question._id });
                return {
                    ...question.toObject(),
                    answerCount, // Add the answer count to the question object
                };
            })
        );

        res.status(200).json({ message: "Questions fetched successfully", data: questionsWithAnswerCount });
    } catch (error) {
        res.status(500).json({ message: "Error fetching questions", error: error.message });
    }
};

// ✅ Get question by ID
const getQuestionById = async (req, res) => {
    try {
        const question = await Question.findById(req.params.id)
            .populate("author", "name email")
            .populate("acceptedAnswer");
        if (!question) {
            return res.status(404).json({ message: "Question not found" });
        }
        res.status(200).json({ message: "Question fetched successfully", data: question });
    } catch (error) {
        res.status(500).json({ message: "Error fetching question", error: error.message });
    }
};

// ✅ Vote on a question (upvote/downvote)
const voteQuestion = async (req, res) => {
    try {
        const { id } = req.params;
        const { vType, userId } = req.body;

        const question = await Question.findById(id);
        if (!question) return res.status(404).json({ message: "Question not found" });

        const existingVoteIndex = question.votes.findIndex(v => v.user.toString() === userId);

        if (existingVoteIndex !== -1) {
            if (question.votes[existingVoteIndex].vote === vType) {
                question.votes.splice(existingVoteIndex, 1);
            } else {
                question.votes[existingVoteIndex].vote = vType;
            }
        } else {
            question.votes.push({ user: userId, vote: vType });
        }

        await question.save();
        const voteSum = question.votes.reduce((acc, v) => acc + v.vote, 0);

        // ✅ Create notification
        if (question.author.toString() !== userId) {
            const notif = new Notification({
                user: question.author,
                message: vType === 1 ? "Someone liked your question." : "Someone disliked your question.",
                question: id,
                type: "review",
            });
            await notif.save();
        }

        res.status(200).json({ message: "Vote updated", totalVotes: voteSum });
    } catch (error) {
        res.status(500).json({ message: "Error voting", error: error.message });
    }
};

// ✅ Mark an answer as accepted
const acceptAnswer = async (req, res) => {
    try {
        const question = await Question.findById(req.params.questionId);

        if (!question) {
            return res.status(404).json({ message: "Question not found" });
        }

        if (question.author.toString() !== req.body.userId) {
            return res.status(403).json({ message: "Only question owner can accept answers" });
        }

        question.acceptedAnswer = req.body.answerId;
        await question.save();

        res.status(200).json({ message: "Answer marked as accepted", data: question });
    } catch (error) {
        res.status(500).json({ message: "Error accepting answer", error: error.message });
    }
};

// ✅ Get questions by tag
const getQuestionsByTag = async (req, res) => {
    try {
        const tag = req.params.tag;
        const questions = await Question.find({ tags: tag }).populate("author", "name");
        res.status(200).json({ message: "Questions fetched by tag", data: questions });
    } catch (error) {
        res.status(500).json({ message: "Error fetching questions by tag", error: error.message });
    }
};

// ✅ Update Question
const updateQuestion = async (req, res) => {
    try {
        const updated = await Question.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        if (!updated) {
            return res.status(404).json({ message: "Question not found" });
        }
        res.status(200).json({ message: "Question updated", data: updated });
    } catch (error) {
        res.status(500).json({ message: "Error updating question", error: error.message });
    }
};

// ✅ Delete Question
const deleteQuestion = async (req, res) => {
    try {
        const deleted = await Question.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: "Question not found" });
        }
        res.status(200).json({ message: "Question deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting question", error: error.message });
    }
};



module.exports = {
    createQuestion,
    getAllQuestions,
    getQuestionById,
    voteQuestion,
    acceptAnswer,
    getQuestionsByTag,
    updateQuestion,
    deleteQuestion,
};
