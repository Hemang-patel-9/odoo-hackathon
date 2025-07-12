const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        tags: [{ type: String, required: true }],
        author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        acceptedAnswer: { type: mongoose.Schema.Types.ObjectId, ref: "Answer" },
        votes: [
            {
                user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
                vote: { type: Number, enum: [1, -1] }, // 1 = upvote, -1 = downvote
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model("Question", QuestionSchema);
