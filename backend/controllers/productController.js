const asyncHandler = require('../middlewares/asyncHandler');
const Product = require('../models/productModel');

const addProduct = asyncHandler(async (req, res) => {
	try {
		const { name, image, description, brand, category, price, quantity } = req.fields;

		if (!name || !image || !description || !brand || !category || !price || !quantity) {
			throw new Error('Please add all fields');
		}

		const product = new Product({ ...req.fields });
		await product.save();
		res.json({ success: true, message: 'Product created successfully', product });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

const updateProductDetails = asyncHandler(async (req, res) => {
	try {
		const { id } = req.params;
		const { name, image, description, brand, category, price, quantity } = req.fields;

		if (!name || !image || !description || !brand || !category || !price || !quantity) {
			throw new Error('Please add all fields');
		}

		const updatedProduct = await Product.findByIdAndUpdate(id, { ...req.fields }, { new: true });
		await updatedProduct.save();
		res.status(200).json({ success: true, message: 'Product updated successfully', updatedProduct });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

const removeProduct = asyncHandler(async (req, res) => {
	try {
		const { id } = req.params;

		const product = await Product.findById(id);
		if (!product) {
			return res.status(404).json({ success: false, message: 'Product not found' });
		}

		await Product.findByIdAndDelete(id);
		res.status(200).json({ success: true, message: 'Product deleted successfully' });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

const fetchProducts = asyncHandler(async (req, res) => {
	//all can get
	try {
		const pageSize = 12; //12 products per page
		const keyword = req.query.keyword ? { name: { $regex: req.query.keyword, $options: 'i' } } : {};

		const count = await Product.countDocuments({ ...keyword });
		const products = await Product.find({ ...keyword }).limit(pageSize);

		res.status(200).json({ products, page: Math.ceil(count / pageSize), hasMore: false, productCount: count });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

const fetchProductById = asyncHandler(async (req, res) => {
	try {
		const { id } = req.params;

		const product = await Product.findById(id);

		if (!product) {
			return res.status(404).json({ success: false, message: 'Product not found' });
		}

		res.status(200).json({ success: true, product });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

const fetchAllProducts = asyncHandler(async (req, res) => {
	//controlled/get by admin
	try {
		const products = await Product.find({}).populate('category').limit(12).sort({ createdAt: -1 });

		res.status(200).json({ success: true, products });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

const addProductReview = asyncHandler(async (req, res) => {
	try {
		const { id } = req.params;
		const { rating, comment } = req.body;
		const product = await Product.findById(id);

		if (!product) {
			return res.status(404).json({ success: false, message: 'Product not found' });
		}

		const numericRating = Number(rating);
		if (numericRating < 1 || numericRating > 5) {
			return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
		}

		const alreadyReviewed = product.reviews.find((r) => r.user.toString() === req.user._id.toString());

		if (alreadyReviewed) {
			return res.status(400).json({ success: false, message: 'You have already reviewed this product' });
		}

		const review = {
			name: req.user.username,
			rating: numericRating,
			comment,
			user: req.user._id,
		};

		product.reviews.push(review);

		product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

		await product.save();

		res.status(200).json({ success: true, message: 'Review added successfully' });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

const fetchTopProducts = asyncHandler(async (req, res) => {
	try {
		//based on rating
		const products = await Product.find({}).sort({ rating: -1 }).limit(5);
		res.status(200).json({ success: true, products });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

const fetchNewProducts = asyncHandler(async (req, res) => {
	try {
		const products = (await Product.find({}).sort({ _id: -1 })).limit(5);
		res.status(200).json({ success: true, products });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

module.exports = {
	addProduct,
	updateProductDetails,
	removeProduct,
	fetchProducts,
	fetchProductById,
	fetchAllProducts,
	addProductReview,
	fetchTopProducts,
	fetchNewProducts,
};
