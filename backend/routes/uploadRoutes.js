const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'uploads/');
	},
	filename: function (req, file, cb) {
		const extName = path.extname(file.originalname);
		cb(null, `${file.fieldname}-${Date.now()}${extName}`);
	},
});

const fileFilter = (req, file, cb) => {
	const fileTypes = /jpe?g|png|webp/;
	const mimeTypes = /image\/jpe?g|image\/png|image\/webp/;
	const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
	const mimeType = mimeTypes.test(file.mimetype);

	if (extName && mimeType) {
		cb(null, true);
	} else {
		cb(new Error('Only image files are allowed'), false);
	}
};

const upload = multer({ storage, fileFilter });

const uploadSingleImage = upload.single('image');

router.route('/').post((req, res) => {
	uploadSingleImage(req, res, (err) => {
		if (err) {
			return res.status(400).json({ error: err.message });
		} else if (req.file) {
			return res.status(200).json({ success: true, message: 'Image successfully uploaded', image: `/${req.file.path}` });
		} else {
			return res.status(400).json({ error: 'No image uploaded' });
		}
	});
});

module.exports = router;
