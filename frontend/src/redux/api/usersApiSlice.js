import { apiSlice } from './apiSlice';
import { USERS_URL } from '../constants';

export const userApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		login: builder.mutation({
			query: (data) => ({
				url: `${USERS_URL}/auth`,
				method: 'POST',
				body: data,
			}),
		}),
		logout: builder.mutation({
			query: () => ({
				url: `${USERS_URL}/logout`,
				method: 'POST',
			}),
		}),
		register: builder.mutation({
			query: (data) => ({
				url: `${USERS_URL}`,
				method: 'POST',
				body: data,
			}),
		}),
		profile: builder.mutation({
			query: (data) => ({
				url: `${USERS_URL}/profile`,
				method: 'PUT',
				body: data,
			}),
		}),
		getUsers: builder.query({
			query: () => ({
				url: USERS_URL,
			}),
			providesTags: ['User'],
			keepUnusedDataFor: 5,
		}),
		deleteUser: builder.mutation({
			query: (id) => ({
				url: `${USERS_URL}/${id}`,
				method: 'DELETE',
			}),
		}),
		getUserDetails: builder.query({
			query: (id) => ({
				url: `${USERS_URL}/${id}`,
			}),
			keepUnusedDataFor: 5,
		}),
		updateUser: builder.mutation({
			query: (data) => ({
				url: `${USERS_URL}/${data.userId}`,
				method: 'PUT',
				body: data,
			}),
			invalidatesTags: ['User'],
		}),
	}),
});

export const {
	useLoginMutation,
	useLogoutMutation,
	useRegisterMutation,
	useProfileMutation,
	useGetUsersQuery,
	useDeleteUserMutation,
	useGetUserDetailsQuery,
	useUpdateUserMutation,
} = userApiSlice;

//use QUERY or MUTATION depending on the action
//wnen importing these, put inside an array for example  const [login, { isLoading }] = useLoginMutation(); //i can also other add properties
//for naming exports - getUsers = useGetUsersQuery(); -add use and add Query at the end or could be Mutation depending on the action

//we are creating hooks for these slices in our components
//for example, for this
// login: builder.mutation({
// 	query: (data) => ({
// 		url: `${USERS_URL}/auth`,
// 		method: 'POST',
// 		body: data,
// 	}),
// }),

//our hooks is in the loginpage component - we are providing the data to the mutation
// const submitHandler = async (e) => {
// 	e.preventDefault();
// 	try {
// 		const response = await login({ email, password }).unwrap();
// 		console.log(response);
// 		dispatch(setCredentials({ ...response }));
// 		navigate(redirect || '/');
// 	} catch (error) {
// 		toast.error(error.data.message);
// 	}
// };

// profile: builder.mutation({
// 	query: (data) => ({
// 		url: `${USERS_URL}/profile`,
// 		method: 'PUT',
// 		body: data,
// 	}),
// }),
