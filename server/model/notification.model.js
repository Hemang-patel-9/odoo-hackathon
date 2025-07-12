const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        message: { type: String, required: true },
        isRead: { type: Boolean, default: false },
        question: { type: mongoose.Schema.Types.ObjectId, ref: "Question", required: true },
        type: {
            type: String,
            enum: ['answer', 'review', 'mention'],
            required: true,
        },

    },
    { timestamps: true }
);

module.exports = mongoose.model("Notification", NotificationSchema);
