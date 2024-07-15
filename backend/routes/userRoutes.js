const express = require('express');
const router = express.Router();
const {
	createUser,
	loginUser,
	logoutCurrentUser,
	getAllUsers,
	getCurrentUserProfile,
	updateCurrentUserProfile,
	deleteUserById,
	getUserById,
	updateUserById,
} = require('../controllers/userController');
const { authenticate, authorizeAdmin } = require('../middlewares/authMiddleware');

//The main purpose of the authenticate middleware is to verify the authenticity of a user's JSON Web Token (JWT) and to attach the authenticated user's information to the request object. This middleware is designed to protect routes by ensuring that only authenticated users can access them.
//authorizeadmin is a middleware that checks if the user is an admin. "hey you can access this endpoint only if you are an admin"

//.route()
// This method is convenient when you have multiple HTTP methods (e.g., POST, GET, PUT, DELETE) associated with the same route.
// It allows you to define middleware functions (like authenticate, authorizeAdmin) once for all HTTP methods associated with the route, reducing redundancy and improving readability.

router.route('/').post(createUser).get(authenticate, authorizeAdmin, getAllUsers);

//http://localhost:5000/api/users/auth
router.post('/auth', loginUser);
router.post('/logout', logoutCurrentUser);

router.route('/profile').get(authenticate, getCurrentUserProfile).put(authenticate, updateCurrentUserProfile);

//ADMIN ROUTES
router
	.route('/:id')
	.delete(authenticate, authorizeAdmin, deleteUserById)
	.get(authenticate, authorizeAdmin, getUserById)
	.put(authenticate, authorizeAdmin, updateUserById);

module.exports = router;
//index uses the routes, routes uses the method + controller, controller uses the model
