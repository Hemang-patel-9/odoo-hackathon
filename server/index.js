require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require('./routes/user.routes.js')
const questionRoutes = require('./routes/question.routes.js')
const answerRoutes = require('./routes/answer.routes.js')
const notificationRoutes = require('./routes/notification.routes.js')
const adminRoutes = require('./routes/admin.routes.js')

const { connectDB } = require('./connection.js');
const app = express();
const PORT = process.env.PORT || 8000;

//static middleware
// Middleware
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
app.use("/admin", adminRoutes )

connectDB();
// Routes
app.get('/', (req, res) => {
	res.send('Welcome to the API!');
});


//middlewares
//app.use("/r", func)

// Listen
app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});