const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, unique: true, required: true },
        password: { type: String, required: true, min: 8 },
        role: {
            type: String,
            enum: ["admin", "user"],
            default: "user",
        },
        banned: { type: Boolean, default: false },
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
