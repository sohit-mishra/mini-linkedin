const express = require('express');
const router = express.Router();
const multer = require("multer");
const { uploadImage, uploadPostImage } = require('@/controllers/uploadController');
const authMiddleware = require("@/middleware/authMiddleware");

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/profile", authMiddleware, upload.single("avatar"), uploadImage);
router.post("/post", authMiddleware, upload.single("image"), uploadPostImage);

module.exports = router;