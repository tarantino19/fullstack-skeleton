import React from 'react';
import { Navigate, Outlet } from 'react-router';
import { useSelector } from 'react-redux';

const PrivateRoute = () => {
	const { userInfo } = useSelector((state) => state.auth);

	//The replace prop ensures that the current URL is replaced in the history stack with the new URL, preventing the user from navigating back to the previous protected route.
	return userInfo ? <Outlet /> : <Navigate to='/login' replace />;
};

export default PrivateRoute;
