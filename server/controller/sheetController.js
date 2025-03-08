const { emitSheetUpdate } = require("../sockets/socketHandler.js");

let latestData = [];

const updateSheetData = async (req, res) => {
  try {
    latestData = req.body.data;
    emitSheetUpdate(latestData); // Emit update to WebSocket clients

    res.status(200).json({ message: "✅ Data received", data: latestData });
  } catch (error) {
    console.error("❌ Error processing sheet update:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { updateSheetData };
