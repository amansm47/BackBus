const mongoose = require('mongoose');
require('dotenv').config();

async function cleanDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB');
    
    // Drop the users collection to remove old indexes
    await mongoose.connection.db.collection('users').drop();
    console.log('Users collection dropped');
    
    console.log('Database cleaned successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error cleaning database:', error);
    process.exit(1);
  }
}

cleanDatabase();