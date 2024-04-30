import React from 'react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Loader from '../../components/Loader';
import { setCredentials } from '../../redux/features/auth/authSlice';
import { Link } from 'react-router-dom';
import { useProfileMutation } from '../../redux/api/usersApiSlice';

function Profile() {
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');

	const { userInfo } = useSelector((state) => state.auth);

	const [updateProfile, { isLoading: loadingUpdateProfile }] = useProfileMutation();

	useEffect(() => {
		setUsername(userInfo.username);
		setEmail(userInfo.email);
	}, [userInfo.username, userInfo.email]);

	const dispatch = useDispatch();

	const submitHandler = async (e) => {
		e.preventDefault();

		if (password !== confirmPassword) {
			toast.error('Passwords do not match');
		} else {
			try {
				const response = await updateProfile({ _id: userInfo._id, username, email, password }).unwrap();
				dispatch(setCredentials({ ...response }));
				toast.success('Profile updated successfully');
			} catch (error) {
				console.log({ message: error });
				toast.error(error.data.message);
			}
		}
	};

	return (
		<div className='container mx-auto p-4 mt-[10rem]'>
			<div className='flex justify-center align-center md:flex md:space-x-4'>
				<div className='md:1-1/3'>
					<h2 className='text-2xl font-semibold mb-4'>Update Profile</h2>
					<form onSubmit={submitHandler}>
						<div className='mb-3'>
							<label className='black mb-2'>Username</label>
							<input
								type='text'
								placeholder='enter your username'
								className='form-input p-4 rounded-sm w-full border-2 border-gray-400 border-opacity-80'
								value={username}
								onChange={(e) => setUsername(e.target.value)}
							/>
						</div>
						<div className='mb-3'>
							<label className='black mb-2'>Email</label>
							<input
								type='email'
								placeholder='enter your email'
								className='form-input p-4 rounded-sm w-full border-2 border-gray-400 border-opacity-80'
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
						</div>
						<div className='mb-3'>
							<label className='black mb-2'>Password</label>
							<input
								type='password'
								placeholder='enter your password'
								className='form-input p-4 rounded-sm w-full border-2 border-gray-400 border-opacity-80'
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
						</div>
						<div className='mb-4'>
							<label className='black mb-2'>Confirm Password</label>
							<input
								type='password'
								placeholder='enter your password again'
								className='form-input p-4 rounded-sm w-full border-2 border-gray-400 border-opacity-80'
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
							/>
						</div>

						<div className='flex justify-between'>
							<button type='submit' className='bg-violet-500 text-white px-3 py-2 rounded-sm'>
								Update Profile
							</button>

							<Link to='/user-orders' className='bg-violet-500 text-white px-3 py-2 rounded-sm hover:bg-violet-900'>
								Check My Orders
							</Link>
						</div>
					</form>
				</div>

				{loadingUpdateProfile && <Loader />}
			</div>
		</div>
	);
}

export default Profile;
