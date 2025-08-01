const mongoose = require('mongoose');

const connectDB = async () => {
	const uri = process.env.MONGO_URI;
	if (!uri) {
		console.error('MongoDB URI is not defined in environment variables');
		process.exit(1);
	}
	try {
		await mongoose.connect(uri, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log('MongoDB connected successfully');
	} catch (error) {
		console.error('MongoDB connection error:', error);
		process.exit(1);
	}
};

module.exports = { connectDB };