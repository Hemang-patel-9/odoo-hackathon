// socket.js
const { Server } = require('socket.io');

// Create user ↔ socket mapping
const onlineUsers = new Map();

/**
 * Initialize Socket.IO server
 * @param {import('http').Server} server - Node HTTP server
 * @returns {Server} - socket.io instance
 */
const initializeSocket = (server) => {
	const io = new Server(server, {
		cors: {
			origin: '*', // Or your frontend origin
			methods: ['GET', 'POST'],
		},
	});

	io.on('connection', (socket) => {
		console.log('✅ Socket connected:', socket.id);

		socket.on('register-user', (userId) => {
			onlineUsers.set(userId, socket.id);
			console.log(`📌 User ${userId} registered with socket ${socket.id}`);
		});

		socket.on('notify', (data) => {
			if (data.user) {
				socket.to(data.user).emit("get-notification", data);
			}
		});

		socket.on('disconnect', () => {
			console.log('🔌 Socket disconnected:', socket.id);
			for (const [userId, sockId] of onlineUsers.entries()) {
				if (sockId === socket.id) {
					onlineUsers.delete(userId);
					console.log(`❌ Removed user ${userId} from online list`);
					break;
				}
			}
		});
	});

	return io;
};

module.exports = {
	initializeSocket,
	onlineUsers,
};
