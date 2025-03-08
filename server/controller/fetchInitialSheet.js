const ApiResponse = require("../utils/ApiResponse.js");
const TryCatch = require("../utils/TryCatch.js");
const fetchSheetData = require("../service/fetchInitialSheet.js");

const fetchInitialSheet = TryCatch(async (req, res, next) => {
  //fetching the the data
  const spreadsheetId = "12uHTRAHg4b8MhRP4dgtHlEP9C4mvlMG5CQP4WgqaID8";
  const range = "Sheet1!A1:Z"; // Adjusting the range as needed
  const data = await fetchSheetData(spreadsheetId, range);

  //response object
  const apiresponse = new ApiResponse(
    200,
    "Data fetched successfully!!",
    true,
    {
      data,
      user: req.user,
    }
  );

  //sending response
  res.status(apiresponse.status).json(apiresponse);
});

module.exports = fetchInitialSheet;
