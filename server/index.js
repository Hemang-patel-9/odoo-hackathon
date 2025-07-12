require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const userRoutes = require('./routes/user.routes.js')
const questionRoutes = require('./routes/question.routes.js')
const answerRoutes = require('./routes/answer.routes.js')
const notificationRoutes = require('./routes/notification.routes.js')

const { initializeSocket } = require('./socket.js');
const { connectDB } = require('./connection.js');

const app = express();
const server = http.createServer(app);

// Initialize socket.io
const io = initializeSocket(server);

// Middlewares
app.use("/media", express.static('media'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/user", userRoutes);
app.use("/questions", questionRoutes);
app.use("/answers", answerRoutes);
app.use("/notifications", notificationRoutes)

// Routes
app.use("/user", userRoutes);
app.use("/questions", questionRoutes);
app.use("/answers", answerRoutes);
app.use("/notifications", notificationRoutes);

connectDB();

app.get('/', (req, res) => {
	res.send('Welcome to the API!');
});

// Listen
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
	console.log(`🚀 Server running at http://localhost:${PORT}`);
});

module.exports = { io };
