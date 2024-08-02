const express = require('express');
const router = express.Router();
const { authenticate, authorizeAdmin } = require('../middlewares/authMiddleware');
const {
	createOrder,
	getAllOrders,
	getUserOrders,
	countTotalOrders,
	calculateTotalSales,
	calculateTotalSalesByDate,
	findOrderById,
	markOrderAsPaid,
	markOrderAsDelivered,
} = require('../controllers/orderController');

//***don't change route order***

// Route to count total orders (admin only)
router.route('/total-orders').get(
	authenticate,
	authorizeAdmin,
	(req, res, next) => {
		console.log('Reached GET /total-orders route');
		next();
	},
	countTotalOrders
);

// Route to calculate total sales (admin only)
router.route('/total-sales').get(
	authenticate,
	authorizeAdmin,
	(req, res, next) => {
		console.log('Reached GET /total-sales route');
		next();
	},
	calculateTotalSales
);

// Route to calculate total sales by date (admin only)
router.route('/total-sales-by-date').get(
	authenticate,
	authorizeAdmin,
	(req, res, next) => {
		console.log('Reached GET /total-sales-by-date route');
		next();
	},
	calculateTotalSalesByDate
);

// Route to get orders for the logged-in user
router.route('/mine').get(
	authenticate,
	(req, res, next) => {
		console.log('Reached GET /mine route');
		next();
	},
	getUserOrders
);

// Route to create an order
router.route('/').post(
	authenticate,
	(req, res, next) => {
		console.log('Reached POST / route');
		next();
	},
	createOrder
);

// Route to get all orders (admin only)
router.route('/').get(
	authenticate,
	authorizeAdmin,
	(req, res, next) => {
		console.log('Reached GET / route for admin');
		next();
	},
	getAllOrders
);

// Route to mark an order as paid
router.route('/:id/pay').put(
	authenticate,
	(req, res, next) => {
		console.log('Reached PUT /:id/pay route');
		next();
	},
	markOrderAsPaid
);

// Route to mark an order as delivered
router.route('/:id/delivered').put(
	authenticate,
	authorizeAdmin,
	(req, res, next) => {
		console.log('Reached PUT /:id/delivered route');
		next();
	},
	markOrderAsDelivered
);

// Route to get an order by ID
router.route('/:id').get(
	authenticate,
	(req, res, next) => {
		console.log('Reached GET /:id route');
		next();
	},
	findOrderById
);

module.exports = router;
