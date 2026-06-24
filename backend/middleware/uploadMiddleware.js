const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directory exists before processing files
const uploadDir = path.join(__dirname, '../uploads/xrays');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Set up disk storage engine configuration criteria
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate secure randomized unique filename tokens with original extensions
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `xray-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

// Filter file extensions to guarantee only image types are processed
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Operational error: System only accepts image formats (jpeg, jpg, png, webp).'));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB Maximum File Boundary Threshold
});

module.exports = upload;