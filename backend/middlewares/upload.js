const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../utils/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    const isLogo = file.fieldname === "logo";
    return {
      folder: isLogo
        ? "QuickBite/restaurants/logos"
        : "QuickBite/restaurants/banners",
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
      transformation: isLogo
        ? [{ width: 400, height: 400, crop: "fill" }] // square logo
        : [{ width: 1600, crop: "limit" }], // banner
    };
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

module.exports = upload;

// // middlewares/upload.js
// const multer = require("multer");
// const { CloudinaryStorage } = require("multer-storage-cloudinary");
// const cloudinary = require("../utils/cloudinary");

// const storage = new CloudinaryStorage({
//   cloudinary,
//   params: {
//     folder: "QuickBite",
//     allowed_formats: ["jpg", "jpeg", "png", "pdf"],
//   },
// });

// const upload = multer({
//   storage,
//   limits: { fileSize: 5 * 1024 * 1024 },
// });

// module.exports = upload;
