const ApiResponse = require("../utils/ApiResponse.js");
const ApiError = require("../utils/ApiError.js");
const TryCatch = require("../utils/TryCatch.js");

const userModel = require("../model/user.js");

const updateSelectedColumns = TryCatch(async (req, res, next) => {
  const { selectedColumns } = req.body;
  const userId = req.user._id;

  // Validate input
  if (!selectedColumns || !Array.isArray(selectedColumns)) {
    return next(new ApiError(400, "Invalid input"));
  }

  // Find user
  const user = await userModel.findById(userId);
  if (!user) {
    return next(new ApiError(404, "User not found"));
  }

  // Update selectedColumns
  user.selectedColumns = selectedColumns;
  await user.save();

  // Create response
  const apiresponse = new ApiResponse(
    200,
    "Selected columns updated successfully",
    true,
    { user }
  );

  return res.status(apiresponse.status).json(apiresponse);
});

module.exports = updateSelectedColumns;
