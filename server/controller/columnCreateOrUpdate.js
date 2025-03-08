const ApiResponse = require("../utils/ApiResponse.js");
const ApiError = require("../utils/ApiError.js");
const TryCatch = require("../utils/TryCatch.js");

const columnModel = require("../model/column.js");

const createOrUpdateColumn = TryCatch(async (req, res, next) => {
  const userId = req.user._id;
  const { header, data } = req.body;

  console.log(req.body);

  // Validate input
  if (!header || !Array.isArray(header) || !data || !Array.isArray(data)) {
    return next(new ApiError(400, "Invalid input"));
  }

  // Validate that each row inside data does not exceed header length
  if (data.some((row) => row.length > header.length)) {
    return next(
      new ApiError(400, "Each data row should have length ≤ header length")
    );
  }

  // Check if column already exists for the user
  let column = await columnModel.findOne({ userId });

  if (column) {
    // Update existing column
    column.header = header;
    column.data = data;
  } else {
    // Create new column
    column = new columnModel({ userId, header, data });
  }

  await column.save();

  // Create response
  const apiresponse = new ApiResponse(
    200,
    "Column updated successfully",
    true,
    { column }
  );

  return res.status(apiresponse.status).json(apiresponse);
});

module.exports = createOrUpdateColumn;
