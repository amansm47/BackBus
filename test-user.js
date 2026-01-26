const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
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

// Test creating a user
async function testCreateUser() {
  try {
    const testUser = new User({
      uid: 'test123',
      email: 'test@example.com',
      displayName: 'Test User',
      role: 'student'
    });
    
    await testUser.save();
    console.log('User created successfully:', testUser);
    process.exit(0);
  } catch (error) {
    console.error('Error creating user:', error);
    process.exit(1);
  }
}

testCreateUser();