const { body } = require("express-validator");

//user
const userValidator = [
  body("name")
    .isLength({ min: 1 })
    .withMessage("Name is required")
    .isAlpha("en-US", { ignore: " -" })
    .withMessage("Name must not contain anything otherthan alphabet")
    .trim(),
  body("email").isEmail().withMessage("Invalid email!"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
];

module.exports = userValidator;
