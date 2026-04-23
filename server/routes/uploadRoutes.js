const express = require('express');
const { upload, uploadImage, uploadMultiple } = require('../controllers/uploadController');
const { uploadLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

router.post('/image', uploadLimiter, upload.single('image'), uploadImage);
router.post('/images', protect, uploadLimiter, upload.array('images', 5), uploadMultiple);

module.exports = router;
