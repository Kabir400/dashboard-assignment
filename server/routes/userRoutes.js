const express = require("express");
const router = express.Router();

//middleware
const userValidator = require("../middleware/userValidator.js");
const validate = require("../middleware/validate.js");
const checkLogin = require("../middleware/checkLogin.js");

//controller
const createUser = require("../controller/createUser.js");
const loginUser = require("../controller/loginUser.js");
const updateSelectedColumns = require("../controller/updateSelectedColumns.js");
const createOrUpdateColumn = require("../controller/columnCreateOrUpdate.js");
const getColumn = require("../controller/getColumn.js");

//routes
router.post("/signup", userValidator, validate, createUser);
router.post("/login", loginUser);
router.post("/update-selected-columns", checkLogin, updateSelectedColumns);
router.post("/update-column", checkLogin, createOrUpdateColumn);
router.get("/get-column", checkLogin, getColumn);

module.exports = router;
