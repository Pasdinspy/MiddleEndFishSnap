const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: 'fishsnap', // Specify a consistent database name
      retryWrites: true,
      w: 'majority' // Ensure write durability
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Configure mongoose to use disk-based storage
mongoose.set('bufferCommands', false);

module.exports = connectDB;