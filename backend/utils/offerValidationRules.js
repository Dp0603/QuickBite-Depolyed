const { body } = require("express-validator");

const offerValidationRules = () => [
  body("title").notEmpty().withMessage("Title is required"),

  // Conditional discountValue validation
  body("discountValue").custom((value, { req }) => {
    const type = req.body.discountType?.toUpperCase();
    if (type === "PERCENT") {
      if (value < 1 || value > 100) {
        throw new Error("Percentage discount must be between 1 and 100");
      }
    } else if (type === "FLAT" || type === "UPTO") {
      if (value < 1) {
        throw new Error("Discount must be at least ₹1");
      }
    }
    return true;
  }),

  body("validFrom").isISO8601().toDate().withMessage("Invalid start date"),
  body("validTill").isISO8601().toDate().withMessage("Invalid end date"),
  body("validFrom").custom((value, { req }) => {
    const validTill = new Date(req.body.validTill);
    if (new Date(value) > validTill) {
      throw new Error("validFrom must be before validTill");
    }
    return true;
  }),
];

module.exports = offerValidationRules;
