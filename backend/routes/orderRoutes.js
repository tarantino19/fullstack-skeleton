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

router.route('/').post(authenticate, createOrder).get(authenticate, authorizeAdmin, getAllOrders);
router.route('/:id').get(authenticate, findOrderById);
router.route('/:id/pay').put(authenticate, markOrderAsPaid);
router.route('/:id/delivered').put(authenticate, authorizeAdmin, markOrderAsDelivered);
router.route('/mine').get(authenticate, getUserOrders);

router.route('/total-orders').get(authenticate, authorizeAdmin, countTotalOrders);
router.route('/total-sales').get(authenticate, authorizeAdmin, calculateTotalSales);
router.route('/total-sales-by-date').get(authenticate, authorizeAdmin, calculateTotalSalesByDate);
module.exports = router;
