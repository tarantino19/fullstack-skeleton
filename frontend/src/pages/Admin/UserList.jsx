import { useEffect, useState } from 'react';
import { FaTrash, FaEdit, FaCheck, FaTimes } from 'react-icons/fa';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { useDeleteUserMutation, useGetUsersQuery, useUpdateUserMutation } from '../../redux/api/usersApiSlice';
import { toast } from 'react-toastify';
// ⚠️⚠️⚠️ don't forget this ⚠️⚠️⚠️⚠️
// import AdminMenu from "./AdminMenu";
import useSWR from 'swr';
import { fetcher } from '../../utils/Fetcher';

const UserList = () => {
	const { data, refetch, isLoading, error } = useGetUsersQuery();
	const [deleteUser] = useDeleteUserMutation();
	const [updateUser] = useUpdateUserMutation();
	const [editableUserId, setEditableUserId] = useState(null);
	const [editableUserName, setEditableUserName] = useState('');
	const [editableUserEmail, setEditableUserEmail] = useState('');
	const singleUser = useSWR('/api/users/profile', fetcher); //testing useSWR - to access: do - singleUser.data.properties

	useEffect(() => {
		refetch();
		console.log(users);
	}, [refetch]);

	const deleteHandler = async (id) => {
		if (window.confirm('Are you sure?')) {
			try {
				await deleteUser(id).unwrap();
				refetch();
				toast.success('User deleted successfully');
			} catch (error) {
				toast.error(error.data.message);
			}
		}
	};

	const toggleEdit = (id, name, email) => {
		setEditableUserId(id);
		setEditableUserName(name);
		setEditableUserEmail(email);
	};

	const updateHandler = async (id) => {
		try {
			await updateUser({ userId: id, username: editableUserName, email: editableUserEmail });
			setEditableUserId(null);
			refetch();
			toast.success('User updated successfully');
		} catch (error) {
			toast.error(error.data.message);
		}
	};

	const users = data?.users || [];

	return (
		<div className='p-4'>
			<h1 className='text-2xl font-semibold mb-4'></h1>
			{isLoading ? (
				<Loader />
			) : error ? (
				<Message variant='danger'>{error?.data?.message || error.error}</Message>
			) : (
				<div className='px-10 py-2'>
					<div className='pl-12 mb-4'>
						<div>You are logged in as {singleUser.data?.username}</div>
					</div>
					<table className='w-full md:w-4/5 mx-auto'>
						<thead>
							<tr>
								<th className='px-4 py-2 text-left'>ID</th>
								<th className='px-4 py-2 text-left'>NAME</th>
								<th className='px-4 py-2 text-left'>EMAIL</th>
								<th className='px-4 py-2 text-left'>ADMIN</th>
								<th className='px-4 py-2'></th>
							</tr>
						</thead>
						<tbody>
							{users.map((user) => (
								<tr key={user._id}>
									<td className='px-4 py-2'>{user._id}</td>
									<td className='px-4 py-2'>
										{editableUserId === user._id ? (
											<div className='flex items-center'>
												<input
													type='text'
													className='w-full p-2 border rounded-lg'
													value={editableUserName}
													onChange={(e) => setEditableUserName(e.target.value)}
												/>
												<button onClick={() => updateHandler(user._id)} className='ml-2 bg-violet-400 py-2 px-4 rounded-lg'>
													<FaCheck className='ml-1[rem]' />
												</button>
											</div>
										) : (
											<div className='flex items-center'>
												<p className='w-3/5'>{user.username}</p>
												<button
													onClick={() => toggleEdit(user._id, user.username, user.email)}
													className='ml-2 bg-violet-400 py-2 px-4 rounded-lg'
												>
													<FaEdit className='ml-1[rem]' />
												</button>
											</div>
										)}
									</td>
									<td className='px-4 py-2'>
										{editableUserId === user._id ? (
											<div className='flex items-center'>
												<input
													className='w-full p-2 border rounded-lg'
													type='text'
													value={editableUserEmail}
													onChange={(e) => setEditableUserEmail(e.target.value)}
												/>
												<button className='ml-2 bg-violet-400 py-2 px-4 rounded-lg' onClick={() => updateHandler(user._id)}>
													<FaCheck className='ml-1[rem]' />
												</button>
											</div>
										) : (
											<div className='flex items-center'>
												<p className='w-3/5'>{user.email}</p>
												<button
													onClick={() => toggleEdit(user._id, user.username, user.email)}
													className='ml-2 bg-violet-400 py-2 px-4 rounded-lg'
												>
													<FaEdit className='ml-1[rem]' />
												</button>
											</div>
										)}
									</td>
									<td className='px-4 py-2'>
										{user.isAdmin ? (
											<div className='flex items-center'>
												<FaCheck className='text-green-600' />
											</div>
										) : (
											<div className='flex items-center'>
												<FaTimes className='text-red-600' />
											</div>
										)}
									</td>
									<td className='px-4 py-2'>
										{!user.isAdmin && (
											<div className='flex items-center'>
												<button onClick={() => deleteHandler(user._id)} className='ml-2 bg-red-500 text-white py-2 px-3 rounded-lg'>
													<FaTrash />
												</button>
											</div>
										)}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
};

export default UserList;
