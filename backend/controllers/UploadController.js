const upload = require("../middlewares/upload");

// 🖼️ Upload restaurant logo
const uploadRestaurantLogo = [
  upload.single("logo"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          message: "Logo file is required",
        });
      }

      res.status(200).json({
        message: "Restaurant logo uploaded successfully",
        data: {
          url: req.file.path,
          publicId: req.file.filename,
        },
      });
    } catch (error) {
      console.error("❌ Logo upload failed:", error);
      res.status(500).json({
        message: "Failed to upload restaurant logo",
      });
    }
  },
];

// 🖼️ Upload restaurant banner
const uploadRestaurantBanner = [
  upload.single("banner"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          message: "Banner file is required",
        });
      }

      res.status(200).json({
        message: "Restaurant banner uploaded successfully",
        data: {
          url: req.file.path,
          publicId: req.file.filename,
        },
      });
    } catch (error) {
      console.error("❌ Banner upload failed:", error);
      res.status(500).json({
        message: "Failed to upload restaurant banner",
      });
    }
  },
];

module.exports = {
  uploadRestaurantLogo,
  uploadRestaurantBanner,
};
