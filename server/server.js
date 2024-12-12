import express from 'express';
import mongoose from 'mongoose';
import userRoute from './routes/users.js';
import postRoute from './routes/posts.js';
import cors from 'cors';
import { createServer } from 'http'; // Import http module for server
import {Server} from 'socket.io'; // Correct import for socket.io
import * as dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

const app = express();
const server = createServer(app); // Create an HTTP server for socket.io to work with
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // The frontend URL
    methods: ["GET", "POST"]
  }
});


// MongoDB connection URI from environment variables
const mongoURI = process.env.MONGO_URL;

// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error(err));

// WebSocket connection logic
io.on('connection', (socket) => {
    console.log('A user connected');

    // Emit a welcome message when a user connects
    socket.emit('welcome', 'Welcome to the social media app!');
  
    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });
});
// Add connection error logging to catch any issues
io.on('connect_error', (err) => {
  console.error('Connection error:', err);
});

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Allow only requests from this origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow these methods
  allowedHeaders: ['Content-Type', 'Authorization'] // Allow these headers
}));
// Pass io to routes to allow socket communication
app.use((req, res, next) => {
  req.io = io; // Attach io to the request object
  next();
});
app.use(express.json());
app.use('/api/users', userRoute);
app.use('/api/post', postRoute);

// Start the server
const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`Server listening on port ${port}`));
