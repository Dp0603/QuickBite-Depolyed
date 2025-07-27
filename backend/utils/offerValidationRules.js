const { body } = require("express-validator");

const offerValidationRules = () => [
  body("title").notEmpty().withMessage("Title is required"),
  body("discountValue")
    .isInt({ min: 1, max: 100 })
    .withMessage("Discount must be between 1 and 100"),
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
