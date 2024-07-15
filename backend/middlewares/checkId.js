const {
	Types: { ObjectId },
} = require('mongoose');

const checkId = (req, res, next) => {
	const { id } = req.params;

	if (!ObjectId.isValid(id)) {
		return res.status(400).json({
			success: false,
			message: `Invalid ID: ${id}`,
		});
	}
	next();
};

module.exports = checkId;
