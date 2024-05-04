import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../../components/Loader';
import { useRegisterMutation } from '../../redux/api/usersApiSlice';
import { setCredentials } from '../../redux/features/auth/authSlice';
import { toast } from 'react-toastify';

function Register() {
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');

	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [register, { isLoading }] = useRegisterMutation();
	const { userInfo } = useSelector((state) => state.auth);
	const search = useLocation();
	const sp = new URLSearchParams(search);
	const redirect = sp.get('redirect');

	useEffect(() => {
		if (userInfo) {
			navigate(redirect);
		}
	}, [navigate, redirect, userInfo]);

	const submitHandler = async (e) => {
		e.preventDefault();

		if (password !== confirmPassword) {
			toast.error('Passwords do not match');
			return;
		}

		try {
			const response = await register({ username, email, password }).unwrap();
			dispatch(setCredentials({ ...response }));
			navigate(redirect);
			toast.success('You are now registered');
		} catch (error) {
			console.log({ message: error });
			toast.error(error.data.message);
		}
	};

	return (
		<section className='pl-[10rem] flex flex-wrap'>
			<div className='mr-[4rem] mt-[5rem]'>
				<h1 className='text-2xl font-semibold mb-4'>Register</h1>
				<form onSubmit={submitHandler} className='container w-[30rem]'>
					<div className='my-[1rem]'>
						<label htmlFor='username' className='black text-sm font-medium'>
							Name
						</label>
						<input
							type='text'
							id='username'
							className='mt-1 p-2 border rounded w-full'
							placeholder='enter your username'
							value={username}
							onChange={(e) => setUsername(e.target.value)}
						></input>
					</div>
					<div className='my-[1rem]'>
						<label htmlFor='email' className='black text-sm font-medium'>
							Email
						</label>
						<input
							type='email'
							id='email'
							className='mt-1 p-2 border rounded w-full'
							placeholder='enter your email address'
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						></input>
					</div>
					<div className='my-[1rem]'>
						<label htmlFor='password' className='black text-sm font-medium'>
							Password
						</label>
						<input
							type='password'
							id='password'
							className='mt-1 p-2 border rounded w-full'
							placeholder='enter your secure password'
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						></input>
					</div>
					<div className='my-[1rem]'>
						<label htmlFor='confirmPassword' className='black text-sm font-medium'>
							Confirm Password
						</label>
						<input
							type='password'
							id='confirmPassword'
							className='mt-1 p-2 border rounded w-full'
							placeholder='enter your password again'
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
						></input>
					</div>
					<button
						disabled={isLoading}
						type='submit'
						className='bg-violet-900 text-white px-4 p-2 rounded cursor-pointer my-[1rem]'
					>
						{isLoading ? 'Signing You Up...' : 'Register'}
					</button>
					{isLoading && <Loader />}
				</form>

				<div className='mt-4'>
					<p className='black text-sm font-medium'>
						Already have an account?{' '}
						<Link to={redirect ? `/login?redirect=${redirect}` : '/login'} className='text-violet-800 hover:underline'>
							Login Here
						</Link>
					</p>
				</div>
			</div>
			<img
				src='https://plus.unsplash.com/premium_photo-1664391649733-b92a94066d7b?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
				alt=''
				className='mt-5 h-[40rem] w-[25%] xl:block md:hidden sm:hidden rounded-lg'
			/>
		</section>
	);
}

export default Register;
