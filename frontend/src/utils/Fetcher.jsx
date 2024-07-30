// fetcher.js
export const fetcher = async (url) => {
	const response = await fetch(url);
	if (!response.ok) {
		throw new Error('Network response was not ok');
	}
	return response.json();
};

export const updateFetcher = async (url, data) => {
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
