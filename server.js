const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const { createServer } = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["https://fron-bus.vercel.app", "http://localhost:3000"],
    methods: ["GET", "POST"]
  }
});
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Request logger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body);
  next();
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/buspulse', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

// User Schema
const userSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  displayName: String,
  photoURL: String,
  role: { type: String, default: 'student' },
  phone: String,
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Serve simulator at root
app.get('/simulator', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'simulator.html'));
});

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working', mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' });
});

// API endpoint to receive location updates from simulator
app.post('/api/buses/location', (req, res) => {
  const { busId, latitude, longitude, speed, status } = req.body;
  
  // Find and update the bus
  const busIndex = buses.findIndex(bus => bus.number === busId || bus.id === 1);
  if (busIndex !== -1) {
    buses[busIndex] = {
      ...buses[busIndex],
      lat: latitude,
      lng: longitude,
      speed: speed || 0,
      status: status || 'running'
    };
    
    // Broadcast to all connected clients
    io.emit('busUpdate', buses);
    console.log(`Bus ${busId} location updated:`, { latitude, longitude, speed });
  }
  
  res.json({ success: true, message: 'Location updated' });
});

// Routes
app.post('/api/users', async (req, res) => {
  try {
    console.log('Received user data:', req.body);
    const { uid, email, displayName, photoURL, role, phone } = req.body;
    
    if (!uid || !email) {
      return res.status(400).json({ error: 'UID and email are required' });
    }
    
    let user = await User.findOne({ email });
    if (user) {
      console.log('User already exists:', user.email);
      return res.json(user);
    }
    
    console.log('Creating new user with data:', { uid, email, displayName, photoURL, role, phone });
    user = new User({ uid, email, displayName, photoURL, role: role || 'student', phone });
    await user.save();
    console.log('New user created successfully:', user.email);
    res.json(user);
  } catch (error) {
    console.error('Detailed error creating user:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ error: error.message, details: error.toString() });
  }
});

app.get('/api/users/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Socket.IO connection handling
let buses = [
  { id: 1, number: 'Bus 42A', lat: 28.6139, lng: 77.2090, speed: 25, passengers: 15, route: 'City Center - University' },
  { id: 2, number: 'Bus 15B', lat: 28.6129, lng: 77.2295, speed: 30, passengers: 22, route: 'Mall - Station' },
  { id: 3, number: 'Bus 23C', lat: 28.6169, lng: 77.2265, speed: 20, passengers: 8, route: 'Airport - Downtown' }
];

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  // Send initial bus data
  socket.emit('busUpdate', buses);
  
  // Handle location updates from simulator
  socket.on('updateBusLocation', (data) => {
    const { busId, lat, lng, speed, passengers } = data;
    const busIndex = buses.findIndex(bus => bus.id === busId);
    
    if (busIndex !== -1) {
      buses[busIndex] = { ...buses[busIndex], lat, lng, speed, passengers };
      // Broadcast updated location to all clients
      io.emit('busUpdate', buses);
    }
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Export for Vercel
module.exports = app;