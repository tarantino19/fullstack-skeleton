const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const asyncHandler = require('./asyncHandler');

const authenticate = asyncHandler(async (req, res, next) => {
	let token;

	//read JWT from jwt cookie
	token = req.cookies.jwt;

	if (token) {
		try {
			const decoded = jwt.verify(token, process.env.JWT_SECRET);
			req.user = await User.findById(decoded.userId).select('-password');
			next();
		} catch (error) {
			res.status(401).json({
				success: false,
				message: 'Invalid token',
			});
		}
	} else {
		res.status(401).json({
			success: false,
			message: 'You are not logged in/No token provided',
		});
	}
});

const authorizeAdmin = asyncHandler(async (req, res, next) => {
	if (req.user && req.user.isAdmin) {
		next();
	} else {
		res.status(401).json({
			success: false,
			message: 'Not authorized as admin',
		});
	}
});

module.exports = { authenticate, authorizeAdmin };
