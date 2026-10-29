
import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dns from 'dns';
import Room from './models/Room.js';

// Force Google DNS to bypass network/ISP blocking
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Pull the database connection string from your .env file
const MONGO_URI = process.env.MONGO_URI;

// Root / Test Route
app.get("/", (req, res) => {
  res.json({ success: true, message: "Hostel Hub API is running..." });
});

// GET route to fetch all rooms from the database
app.get('/api/rooms', async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch rooms' });
  }
});

// POST route to create and save a new room
app.post('/api/rooms', async (req, res) => {
  try {
    const { roomNumber, capacity, pricePerMonth } = req.body;
    
    const newRoom = new Room({
      roomNumber,
      capacity,
      pricePerMonth
    });

    const savedRoom = await newRoom.save();
    console.log("Room saved to MongoDB:", savedRoom);
    res.status(201).json(savedRoom);
  } catch (err) {
    console.error("Error creating room:", err);
    res.status(400).json({ error: 'Failed to create room' });
  }
});

// Database Connection & Server Startup
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected Successfully');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });