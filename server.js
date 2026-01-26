const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});