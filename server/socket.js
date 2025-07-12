
const { Server } = require('socket.io');

const onlineUsers = {};

const initializeSocket = (server) => {
	const io = new Server(server, {
		cors: {
			origin: '*', // ⚠️ In production, set to your frontend origin
			methods: ['GET', 'POST'],
		},
	});

	io.on('connection', (socket) => {
		console.log('✅ Socket connected:', socket.id);

		// 🧾 Register a user
		socket.on('register-user', (userId) => {
			if (!userId) {
				console.warn('⚠️ Missing userId during registration');
				return;
			}
			onlineUsers[userId] = socket.id;
			console.log(`📌 User ${userId} registered with socket ${socket.id}`);
			console.log('🌍 Current online users:', onlineUsers);
		});

		// 🔔 Notify another user (usually when question is answered or mentioned)
		socket.on('notify', ({ user: toUserId, data, qauth }) => {
			const targetSocketId = onlineUsers[toUserId];
			console.log(`📡 Attempting to notify ${toUserId} → socket: ${targetSocketId}`);

			if (qauth && targetSocketId) {
				socket.to(targetSocketId).emit('get-notification', data);
				console.log(`📨 Notification sent to user ${toUserId}`);
			} else {
				console.log(`⚠️ Notification skipped: User ${toUserId} is offline or qauth failed`);
			}
		});

		// 🔌 On disconnect: remove user from tracking
		socket.on('disconnect', () => {
			for (const userId in onlineUsers) {
				if (onlineUsers[userId] === socket.id) {
					delete onlineUsers[userId];
					console.log(`❌ Disconnected: Removed user ${userId}`);
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
