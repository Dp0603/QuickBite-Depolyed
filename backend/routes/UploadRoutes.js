// routes/UploadRoutes.js
const express = require("express");
const upload = require("../middlewares/upload");

const router = express.Router();

// ✅ Example: Upload image to Cloudinary
router.post("/image", upload.single("image"), (req, res) => {
  if (!req.file || !req.file.path) {
    return res.status(400).json({ message: "Image upload failed" });
  }

  res.status(200).json({
    message: "Image uploaded successfully",
    imageUrl: req.file.path,
  });
});

module.exports = router;
