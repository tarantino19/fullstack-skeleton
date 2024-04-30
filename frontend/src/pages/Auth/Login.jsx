import React from 'react';
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useLoginMutation } from '../../redux/api/usersApiSlice';
import { setCredentials } from '../../redux/features/auth/authSlice';
import { toast } from 'react-toastify';
import Loader from '../../components/Loader';

function Login() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [login, { isLoading }] = useLoginMutation();
	const { userInfo } = useSelector((state) => state.auth);
	const { search } = useLocation();
	const sp = new URLSearchParams(search);
	const redirect = sp.get('redirect');

	useEffect(() => {
		if (userInfo) {
			navigate(redirect);
		}
	}, [navigate, redirect, userInfo]);

	const submitHandler = async (e) => {
		e.preventDefault();
		try {
			const response = await login({ email, password }).unwrap();
			console.log(response);
			dispatch(setCredentials({ ...response }));
			navigate(redirect || '/');
		} catch (error) {
			toast.error(error.data.message);
		}
	};

	return (
		<div>
			<section className='pl-[10rem] flex flex-wrap'>
				<div className='mr-[4rem] mt-[5rem]'>
					<h1 className='text-2xl font-semibold mb-4'>Sign In</h1>

					<form onSubmit={submitHandler} className='container w-[30rem]'>
						<div className='my-[2rem]'>
							<label htmlFor='email' className='block text-sm font-medium'>
								Email Address
							</label>
							<input
								type='email'
								id='email'
								className='mt-1 p-2 border rounded w-full'
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>

							<label htmlFor='password' className='block text-sm font-medium mt-3'>
								Password
							</label>
							<input
								type='password'
								id='password'
								className='mt-1 p-2 border rounded w-full'
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>

							<button
								disabled={isLoading}
								className='bg-violet-900 px-4 py-2 rounded mt-4 rounded-cursor-pointer my-[1rem] text-white'
								type='submit'
							>
								{isLoading ? 'Signing in...' : 'Sign In'}
							</button>
							{isLoading && <Loader />}
						</div>
					</form>

					<div className='mt-4'>
						<p className='black text-sm font-medium'>
							New Customer ? {''}
							<Link
								to={redirect ? `/register?redirect=${redirect}` : '/register'}
								className={'text-violet-800 hover:underline'}
							>
								Register Here
							</Link>
						</p>
					</div>
				</div>
				<img
					src='https://images.unsplash.com/photo-1634027423259-b44d7802e101?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
					alt=''
					className='mt-5 h-[40rem] w-[25%] xl:block md:hidden sm:hidden rounded-lg'
				/>
			</section>
		</div>
	);
}

export default Login;
