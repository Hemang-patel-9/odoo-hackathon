const Notification = require("../model/notification.model.js");

// ✅ Mark a single notification as read
const markNotificationAsRead = async (req, res) => {
    try {
        const { id } = req.params;

        const notification = await Notification.findByIdAndUpdate(
            id,
            { isRead: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }

        res.status(200).json({ message: "Notification marked as read", data: notification });
    } catch (error) {
        res.status(500).json({ message: "Error updating notification", error: error.message });
    }
};

module.exports = {
    markNotificationAsRead,
};
