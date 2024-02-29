const multer = require('multer');

// Multer configuration for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // Destination folder for storing uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname) // Rename uploaded files with a unique identifier
  }
});

// File type validation
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/') || file.mimetype === 'text/plain') {
    cb(null, true); // Accept image and text/plain file types
  } else {
    cb(new Error('Invalid file type. Only images and text files are allowed.'), false);
  }
};

// Initialize multer middleware with configuration
const upload = multer({ storage: storage, fileFilter: fileFilter });

module.exports = upload;
