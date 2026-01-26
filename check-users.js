const mongoose = require('mongoose');
require('dotenv').config();

async function listUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    const userSchema = new mongoose.Schema({
      uid: String,
      email: String,
      displayName: String,
      photoURL: String,
      role: String,
      phone: String,
      createdAt: Date
    });
    
    const User = mongoose.model('User', userSchema);
    const users = await User.find({});
    
    console.log('Users in database:', users.length);
    users.forEach(user => {
      console.log(`- ${user.email} (${user.role}) - Created: ${user.createdAt}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

listUsers();