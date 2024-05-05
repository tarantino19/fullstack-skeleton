import React from 'react';
import { useState } from 'react';
import { toast } from 'react-toastify';
import {
	useCreateCategoryMutation,
	useUpdateCategoryMutation,
	useDeleteCategoryMutation,
	useFetchCategoriesQuery,
} from '../../redux/api/categoryApiSlice';
import CategoryForm from '../../components/CategoryForm';
import Modal from '../../components/Modal';

function CategoryList() {
	const { data: categories, refetch, isLoading } = useFetchCategoriesQuery();
	const [name, setName] = useState('');
	const [selectedCategory, setSelectedCategory] = useState(null);
	const [updatingName, setUpdatingName] = useState('');
	const [modalVisible, setModalVisible] = useState(false);

	const [createCategory] = useCreateCategoryMutation();
	const [updateCategory] = useUpdateCategoryMutation();
	const [deleteCategory] = useDeleteCategoryMutation();

	const handleCreateCategory = async (e) => {
		e.preventDefault();

		if (!name) {
			toast.error('Please enter a category name');
			return;
		}

		try {
			await createCategory({ name }).unwrap();
			setName('');
			toast.success('Category created successfully');
			refetch(); // Call the refetch function to update the category UI
		} catch (error) {
			if (error.data && error.data.message) {
				toast.error(error.data.message);
			} else {
				toast.error('An error occurred while creating the category');
			}
		}
	};

	const handleUpdateCategory = async (e) => {
		e.preventDefault();

		if (!updatingName) {
			toast.error('Please enter a category name');
			return;
		}

		try {
			const result = await updateCategory({
				categoryId: selectedCategory._id,
				updatedCategory: { name: updatingName },
			}).unwrap();
			toast.success(`Successfully updated to ${result.updatedCategory.name}`);
			refetch(); // Call the refetch function to update the category UI
			setSelectedCategory(null);
			setUpdatingName('');
			setModalVisible(false);
		} catch (error) {
			if (error.data && error.data.message) {
				toast.error(error.data.message);
			}
		}
	};

	const handleDeleteCategory = async () => {
		try {
			await deleteCategory(selectedCategory._id).unwrap();
			toast.success(`Category deleted successfully`);
			refetch(); // Call the refetch function to update the category UI
			setSelectedCategory(null);
			setModalVisible(false);
		} catch (error) {
			if (error.data && error.data.message) {
				toast.error(error.data.message);
			}
		}
	};

	return (
		<div className='ml-[10rem] flex flex-col md:flex-row'>
			{/*Admin Menu*/}
			<div className='md:w-3/4 p-3'>
				<div className='h-12'>Manage Categories</div>
				<CategoryForm value={name} setValue={setName} handleSubmit={handleCreateCategory} />
				<br />
				<div className='flex flex-wrap'>
					{categories?.map((category) => (
						<div key={category._id}>
							<button
								disabled={isLoading}
								className='bg-white border border-violet-500 text-violet-500 py-2 px-4 rounded-lg m-3 hover:bg-violet-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-opacity-50'
								onClick={() => {
									setSelectedCategory(category);
									setModalVisible(true);
									setUpdatingName(category.name);
								}}
							>
								{category.name}
							</button>
						</div>
					))}
				</div>
				<Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
					<CategoryForm
						value={updatingName}
						setValue={(value) => setUpdatingName(value)}
						handleSubmit={handleUpdateCategory}
						buttonText='update'
					/>
					<button
						onClick={handleDeleteCategory}
						className='ml-0 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 focus:ring-2 focus:ring-red-500 focus:ring-opacity-50'
					>
						DELETE
					</button>
				</Modal>
			</div>
		</div>
	);
}

export default CategoryList;
