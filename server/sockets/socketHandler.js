const { Server } = require("socket.io");

let io;
const setupSocket = (server) => {
  io = new Server(server, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    console.log("🔗 New WebSocket Connection");

    socket.on("disconnect", () => {
      console.log("❌ WebSocket Disconnected");
    });
  });
};

const emitSheetUpdate = (data) => {
  if (io) {
    io.emit("googleSheetsUpdate", data);
  }
};

module.exports = { setupSocket, emitSheetUpdate };
