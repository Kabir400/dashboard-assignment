const ApiResponse = require("../utils/ApiResponse.js");
const ApiError = require("../utils/ApiError.js");
const TryCatch = require("../utils/TryCatch.js");

const columnModel = require("../model/column.js");

const getColumn = TryCatch(async (req, res, next) => {
  const userId = req.user._id;

  // Fetch column data
  const column = await columnModel.findOne({ userId });

  if (!column) {
    return next(new ApiError(404, "Column not found"));
  }

  // Create response
  const apiresponse = new ApiResponse(
    200,
    "Column fetched successfully",
    true,
    { column }
  );

  return res.status(apiresponse.status).json(apiresponse);
});

module.exports = getColumn;
