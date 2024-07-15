const User = require('../models/userModel');
const asyncHandler = require('../middlewares/asyncHandler');
const bcrypt = require('bcryptjs');
const createToken = require('../utils/createToken');

const createUser = asyncHandler(async (req, res) => {
	const { username, email, password } = req.body;

	if (!username || !email || !password) {
		throw new Error('Please input all fields');
	}

	const userExists = await User.findOne({ email });

	if (userExists) {
		res.status(400).json({
			success: false,
			message: 'User already exists',
		});
	} else {
		const salt = await bcrypt.genSalt(11);
		const hashedPassword = await bcrypt.hash(password, salt);

		try {
			const newUser = new User({ username, email, password: hashedPassword });
			await newUser.save();
			createToken(res, newUser._id);
			//getting this cookie means we are technically logged in

			res.status(201).json({
				message: 'User created successfully',
				_id: newUser._id,
				username: newUser.username,
				email: newUser.email,
				isAdmin: newUser.isAdmin,
			});
		} catch (error) {
			res.status(400).json({
				success: false,
				message: error,
			});
		}
	}
});

const loginUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) {
		throw new Error('Please input all fields');
	} else {
		const existingUser = await User.findOne({ email });

		if (existingUser) {
			const isPasswordValid = await bcrypt.compare(password, existingUser.password);

			if (isPasswordValid) {
				createToken(res, existingUser._id);

				res.status(200).json({
					success: true,
					message: 'User logged in successfully',
					_id: existingUser._id,
					username: existingUser.username,
					email: existingUser.email,
					isAdmin: existingUser.isAdmin,
				});
			} else {
				res.status(400).json({
					success: false,
					message: 'Email or password may be wrong or account does not exist',
				});
			}
		} else {
			res.status(400).json({
				success: false,
				message: 'Email or password may be wrong or account does not exist',
			});
		}
	}
});

const logoutCurrentUser = asyncHandler(async (req, res) => {
	res.clearCookie('jwt', '', {
		httpOnly: true,
		expires: new Date(0),
	});

	res.status(200).json({
		success: true,
		message: 'User logged out successfully',
	});
});

const getAllUsers = asyncHandler(async (req, res) => {
	//for returning all users + search api for the users

	const { username, email, isAdmin } = req.query;

	const query = {};

	if (username) {
		query.username = { $regex: new RegExp(username, 'i') };
	}
	if (email) {
		query.email = { $regex: new RegExp(email, 'i') };
	}
	if (isAdmin !== undefined) {
		query.isAdmin = isAdmin === 'true';
	}

	const users = await User.find(query).select('-password');

	if (users.length === 0) {
		return res.status(404).json({
			success: false,
			message: 'No users found matching the search criteria.',
		});
	}

	res.json({
		success: true,
		users,
	});
});

const getCurrentUserProfile = asyncHandler(async (req, res) => {
	const user = await User.findById(req.user._id);
	//we already got the req.user from the authMiddleware, so now we can just get the id via req.user._id
	//no need to pass the specificId in the route because we're getting it from the req object after authenticqtion

	try {
		if (user) {
			res.status(200).json({
				_id: user._id,
				username: user.username,
				email: user.email,
			});
		} else {
			res.status(404);
			throw new Error('User info not found');
		}
	} catch (error) {
		res.status(404).json({ message: 'User not found' });
	}
});

const updateCurrentUserProfile = asyncHandler(async (req, res) => {
	const user = await User.findById(req.user._id);
	//we already got the req.user from the authMiddleware, so now we can just get the id via req.user._id
	//no need to pass the specificId in the route because we're getting it from the req object after authenticqtion

	//we are changing the user profile only if the user exists and been found
	if (user) {
		user.username = req.body.username || user.username;
		user.email = req.body.email || user.email;

		if (req.body.password) {
			const salt = await bcrypt.genSalt(11);
			const hashedPassword = await bcrypt.hash(req.body.password, salt);
			user.password = hashedPassword;
		}

		const updatedUser = await user.save();

		res.status(200).json({
			message: 'Profile updated successfully',
			_id: updatedUser._id,
			username: updatedUser.username,
			email: updatedUser.email,
			isAdmin: updatedUser.isAdmin,
		});
	} else {
		res.status(404);
		throw new Error('User not found');
	}
});

//ADMIN
const deleteUserById = asyncHandler(async (req, res) => {
	const user = await User.findById(req.params.id);

	if (user) {
		if (user.isAdmin) {
			res.status(400);
			throw new Error('Ya crazy??? Ya cannot delete an admin account');
		}

		await user.deleteOne({ _id: user._id });

		res.status(200).json({ message: 'User with username of ' + user.email + ' deleted successfully' });
	} else {
		res.status(404);
		throw new Error('User not found');
	}
});

const getUserById = asyncHandler(async (req, res) => {
	const user = await User.findById(req.params.id).select('-password');

	if (user) {
		res.json(user);
	} else {
		res.status(404);
		throw new Error('User not found');
	}
});

const updateUserById = asyncHandler(async (req, res) => {
	const user = await User.findById(req.params.id);

	if (user) {
		user.username = req.body.username || user.username;
		user.email = req.body.email || user.email;
		user.isAdmin = Boolean(req.body.isAdmin);

		const updatedUser = await user.save();

		res.status(200).json({
			message: 'User updated successfully',
			_id: updatedUser._id,
			username: updatedUser.username,
			email: updatedUser.email,
			isAdmin: updatedUser.isAdmin,
		});
	} else {
		res.status(404);
		throw new Error('User not found');
	}
});

module.exports = {
	createUser,
	loginUser,
	logoutCurrentUser,
	getAllUsers,
	getCurrentUserProfile,
	updateCurrentUserProfile,
	deleteUserById,
	getUserById,
	updateUserById,
};
