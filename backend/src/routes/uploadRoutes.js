const express = require('express');
const router = express.Router();
// const multer = require('multer');
// const { CloudinaryStorage } = require('multer-storage-cloudinary');
// const cloudinary = require('cloudinary').v2;
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

/* 
 * Phase 5 Preparation: Cloudinary Image Uploads 
 * 
 * Once Phase 5 begins, configure cloudinary with process.env keys,
 * set up Multer storage, and uncomment the route below.
 * 
 * This ensures no image binaries are stored in MongoDB, maintaining
 * optimal database performance and stateless backend containers.
 */

router.post('/', authenticate, authorize('admin'), (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Image upload to Cloudinary is scheduled for Phase 5. Endpoint prepared.',
  });
});

module.exports = router;
