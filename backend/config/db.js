const mongoose = require('mongoose');

const connectDB = async () => {
	try {
		await mongoose.connect(process.env.MONGO_URI);
		console.log(`You are connected to the MongoDB Server`);
	} catch (err) {
		console.error(`Error: ${err.message}`);
		process.exit(1);
	}
};

module.exports = connectDB;
