const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
	{
		name: {
			type: String,
			trim: true,
			required: true,
			maxLength: 32,
			unique: true,
		},
	},
	{ timestamps: true }
);

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;
//index uses the routes, routes uses the controller, controller uses the model
