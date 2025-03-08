const mongoose = require("mongoose");

const columnSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  header: [
    {
      name: { type: String, required: true },
      type: { type: String, required: true },
    },
  ],
  data: [[{ type: String }]],
});

module.exports = mongoose.model("column", columnSchema);
