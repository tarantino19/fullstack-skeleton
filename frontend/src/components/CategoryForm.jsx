import React from 'react';
import { useFetchCategoriesQuery } from '../redux/api/categoryApiSlice';

function CategoryForm({ value, setValue, handleSubmit, buttonText = 'submit', handleDelete }) {
	const { isLoading } = useFetchCategoriesQuery();

	return (
		<div className='p-1'>
			<form onSubmit={handleSubmit} className='space-y-3'>
				<input
					type='text'
					className='py-3 px-4 border rounded-lg w-full'
					placeholder='Write category name'
					value={value}
					onChange={(e) => setValue(e.target.value)}
				/>
				<div className='flex justify-between'>
					<button
						disabled={isLoading}
						className='bg-violet-500 text-white py-2 px-4 rounded-lg hover:bg-violet-600 focus:ring-2 focus:ring-violet-500 focus:ring-opacity-50'
					>
						{buttonText}
					</button>
				</div>
			</form>
		</div>
	);
}

export default CategoryForm;
