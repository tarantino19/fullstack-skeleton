// fetcher.js
// for doing fetch requests in CRUD operations (use w/ SWR)
const fetcher = async (url) => {
	const response = await fetch(url);
	if (!response.ok) {
		throw new Error('Network response was not ok');
	}
	return response.json();
};

const updateFetcher = async (url, data) => {
	const response = await fetch(url, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	});
	if (!response.ok) {
		throw new Error('Failed to update');
	}
	return response.json();
};

const deleteFetcher = async (url) => {
	const response = await fetch(url, {
		method: 'DELETE',
	});
	if (!response.ok) {
		throw new Error('Failed to delete');
	}
	return response.json();
};

const createFetcher = async (url, data) => {
	const response = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	});
	if (!response.ok) {
		throw new Error('Failed to create');
	}
	return response.json();
};

export { fetcher, updateFetcher, deleteFetcher, createFetcher };
