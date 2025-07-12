require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

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