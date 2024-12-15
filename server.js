// Import required modules
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

// Initialize Express app and create an HTTP server
const app = express();
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server);

// Serve static files from the 'public' folder
app.use(express.static("public"));

// Handle socket connections
io.on("connection", (socket) => {
    console.log("A user connected");

    // Handle message events
    socket.on("message", (message) => {
        console.log("Message received:", message);
        socket.broadcast.emit("message", message); // Broadcast message to other clients
    });

    // Handle disconnection
    socket.on("disconnect", () => {
        console.log("A user disconnected");
    });
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
