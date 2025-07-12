const Answer = require("../model/answer.model.js");
const Question = require("../model/question.model.js");
const User = require("../model/user.model.js");

// Fetch all users (Admin)
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({ message: "All users fetched", data: users });
    } catch (error) {
        res.status(500).json({ message: "Error fetching users", error: error.message });
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
    getAllUsers,
    deleteQuestion,
    deleteAnswer
}