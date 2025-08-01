const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure media folder exists
const mediaDir = path.join("media");
if (!fs.existsSync(mediaDir)) fs.mkdirSync(mediaDir);

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "media/");
	},
	filename: function (req, file, cb) {
		const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
		const ext = path.extname(file.originalname);
		cb(null, file.fieldname + "-" + uniqueSuffix + ext);
	},
});

const fileFilter = (req, file, cb) => {
	const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
	if (allowedTypes.includes(file.mimetype)) cb(null, true);
	else cb(new Error("Invalid file type"), false);
};

const upload = multer({ storage, fileFilter });

module.exports = { upload };
