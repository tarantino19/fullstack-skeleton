const express = require('express');
const router = express.Router();
const formidable = require('express-formidable');
const {
	addProduct,
	updateProductDetails,
	removeProduct,
	fetchProducts,
	fetchProductById,
	fetchAllProducts,
	addProductReview,
	fetchTopProducts,
	fetchNewProducts,
} = require('../controllers/productController');

const { authenticate, authorizeAdmin } = require('../middlewares/authMiddleware');
const checkId = require('../middlewares/checkId');

router.route('/').post(authenticate, authorizeAdmin, formidable(), addProduct).get(fetchProducts);
router.route('/allProducts').get(authenticate, authorizeAdmin, fetchAllProducts);

router.route('/:id/reviews').post(authenticate, checkId, addProductReview);
router.route('/top').get(fetchTopProducts);
router.route('/new').get(fetchNewProducts);

router
	.route('/:id')
	.put(authenticate, authorizeAdmin, formidable(), updateProductDetails)
	.delete(authenticate, authorizeAdmin, removeProduct)
	.get(fetchProductById);

module.exports = router;
