// utils/socket.js

const { Server } = require("socket.io");

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5000", // Update this for production
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("🟢 New socket client connected:", socket.id);

    socket.on("joinOrderRoom", (orderId) => {
      socket.join(orderId);
      console.log(`🧾 Socket ${socket.id} joined order room: ${orderId}`);
    });

    socket.on("disconnect", () => {
      console.log("🔴 Socket client disconnected:", socket.id);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error("❌ Socket.io not initialized!");
  }
  return io;
};

module.exports = {
  initSocket,
  getIO,
};
