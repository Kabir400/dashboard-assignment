require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");

const connectDB = require("./config/db.js");
const sheetRoutes = require("./routes/sheetRoutes.js");
const userRoutes = require("./routes/userRoutes.js");
const { setupSocket } = require("./sockets/socketHandler.js");

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to Database
connectDB();

// Routes
app.use("/api", sheetRoutes);
app.use("/api", userRoutes);

// Setup WebSockets
setupSocket(server);

//defalut error handler middleware
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const suceess = err.suceess || false;
  let message = err.message || "something went wrong";
  const data = err.data || null;

  res.status(status).json({
    status,
    message,
    suceess,
    data,
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
