const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const asyncHandler = require('../middlewares/asyncHandler');
const mongoose = require('mongoose'); // Import mongoose

//Utility function
const calculatePrice = (orderItems) => {
	const itemsPrice = orderItems.reduce((acc, item) => acc + item.price * item.qty, 0);
	const shippingPrice = itemsPrice > 100 ? 0 : 10;
	const taxRate = 0.15;
	const taxPrice = (itemsPrice * taxRate).toFixed(2);
	const totalPrice = (itemsPrice + shippingPrice + parseFloat(taxPrice)).toFixed(2);
	return {
		itemsPrice: itemsPrice.toFixed(2),
		shippingPrice: shippingPrice.toFixed(2),
		taxPrice: taxPrice,
		totalPrice: totalPrice,
	};
};

const createOrder = asyncHandler(async (req, res) => {
	try {
		const { orderItems, shippingAddress, paymentMethod } = req.body;

		if (orderItems && orderItems.length === 0) {
			res.status(400);
			throw new Error('No order items');
		}

		const itemsFromDB = await Product.find({ _id: { $in: orderItems.map((item) => item._id) } });
		//
		const dbOrderItems = orderItems.map((itemFromClient) => {
			const matchingItemFromDB = itemsFromDB.find(
				(itemFromDB) => itemFromDB._id.toString() === itemFromClient._id.toString()
			);

			if (!matchingItemFromDB) {
				throw new Error(`Product ${itemFromClient.name} - ${itemFromClient._id} not found`);
			}

			return {
				...itemFromClient,
				product: itemFromClient._id,
				price: matchingItemFromDB.price,
				_id: undefined,
			};
		});

		const { itemsPrice, shippingPrice, taxPrice, totalPrice } = calculatePrice(dbOrderItems);

		const order = new Order({
			orderItems: dbOrderItems,
			user: req.user._id,
			shippingAddress,
			paymentMethod,
			//below - all computed properties - will not come directly from req.body
			itemsPrice,
			shippingPrice,
			taxPrice,
			totalPrice,
		});

		const createdOrder = await order.save();
		res.status(201).json(createdOrder);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

const getAllOrders = asyncHandler(async (req, res) => {
	try {
		const orders = await Order.find({}).populate('user', 'id username');
		res.status(200).json({ orders, totalNumberOfOrders: orders.length });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

const getUserOrders = asyncHandler(async (req, res) => {
	try {
		const orders = await Order.find({ user: req.user._id });
		//when im trying to get the id of the already logged in user, i can do that via req.user._id which was set in the auth middleware

		if (orders.length === 0) {
			return res.status(404).json({ message: 'No orders found for this user' });
		}

		res.status(200).json(orders);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

const countTotalOrders = asyncHandler(async (req, res) => {
	try {
		const totalOrders = await Order.countDocuments();
		res.status(200).json({ totalOrders });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

const calculateTotalSales = asyncHandler(async (req, res) => {
	try {
		const totalSales = await Order.aggregate([{ $group: { _id: null, totalSales: { $sum: '$totalPrice' } } }]);
		res.status(200).json({ totalSales });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

const calculateTotalSalesByDate = asyncHandler(async (req, res) => {
	try {
		const salesByDate = await Order.aggregate([
			{
				$match: {
					isPaid: true,
				},
			},
			{
				$group: {
					_id: { $dateToString: { format: '%Y-%m-%d', date: '$paidAt' } },
					totalSales: { $sum: '$totalPrice' },
				},
			},
		]);

		res.status(200).json({ salesByDate });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

const findOrderById = asyncHandler(async (req, res) => {
	try {
		const order = await Order.findById(req.params.id).populate('user', 'username email');
		if (!order) {
			return res.status(404).json({ message: 'Order not found' });
		}
		res.status(200).json(order);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

const markOrderAsPaid = asyncHandler(async (req, res) => {
	try {
		// Get and sanitize the order ID
		const orderId = req.params.id.trim();
		console.log('Order ID:', orderId);

		// Validate ObjectId
		if (!mongoose.Types.ObjectId.isValid(orderId)) {
			return res.status(400).json({ message: 'Invalid order ID format' });
		}

		// Find the order by ID
		const order = await Order.findById(orderId);
		if (!order) {
			return res.status(404).json({ message: 'Order not found' });
		}

		// Update order details
		order.isPaid = true;
		order.paidAt = Date.now();

		// Save updated order
		const updatedOrder = await order.save();

		res.status(200).json(updatedOrder);
	} catch (error) {
		console.error('Error in markOrderAsPaid:', error); // Log detailed error
		res.status(400).json({ error: error.message });
	}
});

const markOrderAsDelivered = asyncHandler(async (req, res) => {
	try {
		// Sanitize and validate ObjectId
		const orderId = req.params.id.trim();
		if (!mongoose.Types.ObjectId.isValid(orderId)) {
			return res.status(400).json({ message: 'Invalid order ID format' });
		}

		// Find the order by ID
		const order = await Order.findById(orderId);
		if (!order) {
			return res.status(404).json({ message: 'Order not found' });
		}

		// Update order details
		order.isDelivered = true;
		order.deliveredAt = Date.now();

		// Save updated order
		const updatedOrder = await order.save();

		res.status(200).json(updatedOrder);
	} catch (error) {
		console.error('Error in markOrderAsDelivered:', error); // Log detailed error
		res.status(400).json({ error: error.message });
	}
});

module.exports = {
	createOrder,
	getAllOrders,
	getUserOrders,
	countTotalOrders,
	calculateTotalSales,
	calculateTotalSalesByDate,
	findOrderById,
	markOrderAsPaid,
	markOrderAsDelivered,
};
