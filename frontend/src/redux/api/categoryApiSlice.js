import { apiSlice } from './apiSlice';
import { CATEGORY_URL } from '../constants';

export const categoryApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		//create a category
		createCategory: builder.mutation({
			query: (newCategory) => ({
				url: `${CATEGORY_URL}`,
				method: 'POST',
				body: newCategory,
			}),
		}),

		//update a Category
		updateCategory: builder.mutation({
			query: ({ categoryId, updatedCategory }) => ({
				url: `${CATEGORY_URL}/${categoryId}`,
				method: 'PUT',
				body: updatedCategory,
			}),
		}),

		//delete a category
		deleteCategory: builder.mutation({
			query: (categoryId) => ({
				url: `${CATEGORY_URL}/${categoryId}`,
				method: 'DELETE',
			}),
		}),

		//get all categories
		fetchCategories: builder.query({
			query: () => ({
				url: `${CATEGORY_URL}/categories`,
			}),
		}),

		//fetch single category
		getCategory: builder.query({
			query: (categoryId) => ({
				url: `${CATEGORY_URL}/${categoryId}`,
			}),
		}),
		//
	}),
});

export const {
	useCreateCategoryMutation,
	useUpdateCategoryMutation,
	useDeleteCategoryMutation,
	useFetchCategoriesQuery,
	useGetCategoryQuery,
} = categoryApiSlice;

//updateCategory - number of params in the backend controller will be same as number of params in the dispatcher - e.g. these 2 needed for the updateCategory Controller
// const { name } = req.body;
// const { categoryId } = req.params;

//the url should always be the same as the one in the backend route
