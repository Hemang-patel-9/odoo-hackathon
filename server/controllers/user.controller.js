const User = require("../model/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { upload } = require("../middleware/upload.middleware.js");


const JWT_SECRET = process.env.JWT_SECRET;

// Signup controller
const signup = (req, res) => {
    upload.single("avatar")(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: "File upload error", error: err.message });
        }

        try {
            const { name, email, password } = req.body;

            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: "User already exists" });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = new User({
                name,
                email,
                password: hashedPassword,
                avatar: req.file ? req.file.path : undefined, // ✅ Save avatar path
            });

            await newUser.save();

            res.status(201).json({ message: "User registered successfully", data: newUser });
        } catch (error) {
            res.status(500).json({ message: "Error during signup", error: error.message });
        }
    });
};


// Login controller
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        if (user.banned) {
            return res.status(403).json({ message: "Account is banned" });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
            expiresIn: "2h",
        });

        res.status(200).json({
            message: "Login successful",
            token,
            data: { id: user._id, name: user.name, role: user.role, email: user.email, avatar: user.avatar },
        });
    } catch (error) {
        res.status(500).json({ message: "Error during login", error: error.message });
    }
};

// Fetch all users (Admin)
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({ message: "All users fetched", data: users });
    } catch (error) {
        res.status(500).json({ message: "Error fetching users", error: error.message });
    }
};

// Ban a user (Admin)
const banUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, { banned: true }, { new: true });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User banned successfully", data: user });
    } catch (error) {
        res.status(500).json({ message: "Error banning user", error: error.message });
    }
};

// Unban a user (Admin)
const unbanUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, { banned: false }, { new: true });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User unbanned successfully", data: user });
    } catch (error) {
        res.status(500).json({ message: "Error unbanning user", error: error.message });
    }
};

const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password"); // exclude password
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ data: user });
    } catch (error) {
        res.status(500).json({ message: "Error fetching user", error: error.message });
    }
};

module.exports = {
    signup,
    login,
    getAllUsers,
    banUser,
    unbanUser,
    getUserById
};
