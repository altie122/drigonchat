import { Server } from "socket.io";

const port = 12222;

const io = new Server(12222, { /* options */ });

console.log(`Starting server on port: ${port}`);

io.on("connection", (socket) => {
  // ...
});