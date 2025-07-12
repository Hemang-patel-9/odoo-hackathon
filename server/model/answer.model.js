const mongoose = require("mongoose");

const AnswerSchema = new mongoose.Schema(
    {
        content: { type: String, required: true },
        question: { type: mongoose.Schema.Types.ObjectId, ref: "Question", required: true },
        author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        votes: [
            {
                user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
                vote: { type: Number, enum: [1, -1] }, // 1 = upvote, -1 = downvote
            },
        ],
        acceptedAnswer: { type: Boolean, default: false },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Answer", AnswerSchema);
