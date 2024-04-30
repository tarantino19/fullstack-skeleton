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
