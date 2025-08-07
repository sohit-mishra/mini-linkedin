const cloudinary = require('@/config/cloudinary');

const uploadToCloudinary = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(buffer);
  });
};

const uploadImageHandler = (folder) => async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    if (!req.file.mimetype.startsWith("image/")) {
      return res.status(400).json({ message: "Only image uploads are allowed" });
    }

    const buffer = req.file.buffer;
    const result = await uploadToCloudinary(buffer, folder);

    res.status(200).json({
      message: "Image uploaded successfully",
      url: result.secure_url,
    });
  } catch (error) {
    res.status(500).json({ message: "Upload failed", error: error.message });
  }
};

const uploadImage = uploadImageHandler("uploads");
const uploadPostImage = uploadImageHandler("post");

module.exports = { uploadImage, uploadPostImage };
