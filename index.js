import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);
const ioServer = new Server(server);
app.use(express.static("frontend/dist"));

ioServer.on("connection", (socket) => {
  console.log("A User connected", socket.id);

  socket.on("message", (message) => {
    console.log("Message received:", message);
    //socket.broadcast.emit("message", message);
    ioServer.emit("message", message);
  });
  socket.on("disconnect", () => {
    console.log("A User disconnected", socket.id);
  });
});

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
