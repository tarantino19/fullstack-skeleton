const Category = require('../models/categoryModel');
const asyncHandler = require('../middlewares/asyncHandler');
const mongoose = require('mongoose');

const createCategory = asyncHandler(async (req, res) => {
	try {
		const { name } = req.body;

		if (!name) {
			throw new Error('Please add a category name');
		}

		const existingCategory = await Category.findOne({ name });

		if (existingCategory) {
			res.status(400);
			throw new Error('Category already exists');
		}

		const category = new Category({
			name,
		});

		await category.save();

		res.status(200).json({
			success: true,
			message: 'Category created successfully',
			category, //category: category
		});
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

const updateCategory = asyncHandler(async (req, res) => {
	try {
		const { name } = req.body;
		const { categoryId } = req.params;

		if (!mongoose.Types.ObjectId.isValid(categoryId)) {
			res.status(400);
			throw new Error('Invalid mongoose category ID');
		}

		const category = await Category.findById({ _id: categoryId });

		if (!category) {
			res.status(400);
			throw new Error('Category not found');
		}

		category.name = name;
		const updatedCategory = await category.save();

		res.status(200).json({
			success: true,
			message: `Category updated to ${updatedCategory.name}`,
			updatedCategory,
		});
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

const removeCategory = asyncHandler(async (req, res) => {
	try {
		const { categoryId } = req.params;

		if (!mongoose.Types.ObjectId.isValid(categoryId)) {
			res.status(400);
			throw new Error('Invalid mongoose category ID');
		}

		const category = await Category.findById({ _id: categoryId });

		if (!category) {
			res.status(400);
			throw new Error('Category not found');
		}

		await Category.findByIdAndDelete({ _id: categoryId });

		// await category.deleteOne({ _id: categoryId });

		//can also do this with findByIdAndDelete
		//await Category.findByIdAndDelete({ _id: categoryId }); or //findbyidandremove

		res.status(200).json({
			success: true,
			message: 'Category deleted successfully',
			category,
		});
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

const listCategory = asyncHandler(async (req, res) => {
	try {
		const allCategory = await Category.find();
		res.status(200).json(allCategory);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

const readCategory = asyncHandler(async (req, res) => {
	try {
		const { categoryId } = req.params;

		if (!mongoose.Types.ObjectId.isValid(categoryId)) {
			res.status(400);
			throw new Error('Invalid mongoose category ID');
		}

		const singleCategory = await Category.findById({ _id: categoryId }).select('-createdAt -updatedAt');
		res.status(200).json(singleCategory);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

module.exports = {
	createCategory,
	updateCategory,
	removeCategory,
	listCategory,
	readCategory,
};
