require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: true,
    methods: ["GET", "POST"],
    credentials: true
  }
});

app.use(cors({
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/simulator', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'simulator.html'));
});

let busData = {
  busId: 'BUS_01',
  currentStopIndex: 0,
  status: 'idle',
  busPosition: 0,
  location: { speed: 0, timestamp: new Date() }
};

io.on('connection', (socket) => {
  console.log('✅ Client connected:', socket.id);
  socket.emit('busLocationUpdate', busData);
  
  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id);
  });
});

app.post('/api/buses/location', (req, res) => {
  try {
    const { busId, latitude, longitude, speed, currentStopIndex, status, busPosition, isAtFinalDestination } = req.body;
    
    busData = {
      busId: busId || 'BUS_01',
      currentStopIndex: isAtFinalDestination || (busPosition >= 1) ? 10 : (currentStopIndex || 0),
      status: isAtFinalDestination ? 'completed' : (status || 'running'),
      busPosition: isAtFinalDestination || (busPosition >= 1) ? 1 : (busPosition || 0),
      isAtFinalDestination: isAtFinalDestination || (busPosition >= 1 && currentStopIndex >= 10),
      location: {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        speed: parseFloat(speed) || 0,
        timestamp: new Date()
      }
    };

    io.emit('busLocationUpdate', busData);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`🚀 BusPulse Server: http://localhost:${PORT}`);
  console.log(`📱 Simulator: http://localhost:${PORT}/simulator`);
});