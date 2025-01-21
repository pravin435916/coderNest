import express from 'express';
import mongoose from 'mongoose';
import userRoute from './routes/users.js';
import postRoute from './routes/posts.js';
import notificationRoute from './routes/notifications.js';
import cors from 'cors';
import { createServer } from 'http'; // Import http module for server
import {Server} from 'socket.io'; // Correct import for socket.io
import * as dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

const app = express();
const server = createServer(app); // Create an HTTP server for socket.io to work with
const io = new Server(server, {
  cors: {
    origin: ['https://coder-nest.vercel.app', 'http://localhost:5173'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  }
});
// Connected users map
// Connected users map to track socket connections
const connectedUsers = new Map();

// Socket.IO middleware for authentication
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error('Authentication error'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.userId;
    next();
  } catch (err) {
    next(new Error('Authentication error'));
  }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.userId);
  
  // Store user's socket id
  connectedUsers.set(socket.userId, socket.id);
  
  // Join user's personal room
  socket.join(socket.userId);

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.userId);
    connectedUsers.delete(socket.userId);
  });

  // Listen for notification acknowledgment
  socket.on('notification_read', async (notificationId) => {
    try {
      await Notification.findByIdAndUpdate(notificationId, { isRead: true });
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  });
});

// MongoDB connection URI from environment variables
const mongoURI = process.env.MONGO_URL;

// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error(err));

// Middleware
app.use(cors({
  origin: ['*'.'https://coder-nest.vercel.app','http://localhost:5173'], // Allow only requests from this origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow these methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow these headers
  credentials: true,
}));
// Pass io to routes to allow socket communication
app.use((req, res, next) => {
  req.io = io;
  req.connectedUsers = connectedUsers;
  next();
});
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});
app.use(express.json());
app.use('/api/users', userRoute);
app.use('/api/post', postRoute);
app.use('/api/notifications', notificationRoute);

// Start the server
const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`Server listening on port ${port}`));
