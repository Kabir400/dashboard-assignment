const express = require("express");

//controller
const { updateSheetData } = require("../controller/sheetController.js");
const fetchInitailSheet = require("../controller/fetchInitialSheet.js");

//middleware
const checkLogin = require("../middleware/checkLogin.js");

const router = express.Router();

router.post("/sheet-update", updateSheetData);
router.get("/sheet-data", checkLogin, fetchInitailSheet);

module.exports = router;
