const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const connectToDatabase = require('./config/db');
const jwt = require('jsonwebtoken');
const Canvas = require('./models/canvasModel');
const User = require('./models/userModel');
require('dotenv').config();
const PORT = process.env.PORT;
const server = http.createServer(app);
const cors = require('cors');
app.use(cors());
app.use(express.json())
connectToDatabase();

const io = new Server(server, {
    cors: {
        origin: "*",
    },
});

// In-memory cache for canvas data (optional, for performance)
const canvasData = {};

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Join canvas room with authentication
    socket.on("joinCanvas", async ({ canvasId }) => {
        try {
            const authHeader = socket.handshake.headers.authorization;
            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                socket.emit("unauthorized", { message: "Access Denied: No Token" });
                return;
            }
            const token = authHeader.split(" ")[1];
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            const userEmail = decoded.email;

            // Find user and canvas
            const user = await User.findOne({ email: userEmail });
            const canvas = await Canvas.findById(canvasId);

            if (
                !canvas ||
                (String(canvas.owner) !== String(user._id) &&
                    !canvas.shared_with.map(String).includes(String(user._id)))
            ) {
                socket.emit("unauthorized", { message: "You are not authorized to join this canvas." });
                return;
            }

            socket.join(canvasId);
            console.log(`User ${socket.id} joined canvas ${canvasId}`);

            // Send latest canvas data
            if (canvasData[canvasId]) {
                socket.emit("loadCanvas", canvasData[canvasId]);
            } else {
                socket.emit("loadCanvas", canvas.elements);
            }
        } catch (err) {
            socket.emit("unauthorized", { message: "Access Denied" });
        }
    });

    // Handle drawing updates
    socket.on("drawingUpdate", async ({ canvasId, elements }) => {
        try {
            canvasData[canvasId] = elements;
            // Broadcast to all users in the room except sender
            socket.to(canvasId).emit("receiveDrawingUpdate", elements);

            // Save to DB (atomic update)
            await Canvas.findByIdAndUpdate(
                canvasId,
                { elements },
                { new: true, useFindAndModify: false }
            );
        } catch (error) {
            console.error(error);
        }
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
    });
});

const userRoutes = require('./routes/userRoutes');
const canvasRoutes = require('./routes/canvasRoutes');
app.use('/users', userRoutes);
app.use('/canvas', canvasRoutes);

server.listen(PORT, () => {
    console.log(`Websocket server is running on port ${PORT}`);
});