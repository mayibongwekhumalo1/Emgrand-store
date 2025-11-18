import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  try {
    console.log('Checking MongoDB connection state:', mongoose.connection.readyState);
    if (mongoose.connection.readyState === 0) {
      const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';
      console.log('Connecting to MongoDB with URI:', mongoURI.replace(/\/\/.*@/, '//***:***@')); // Hide credentials in logs
      await mongoose.connect(mongoURI);
      console.log('MongoDB connected successfully');
    } else {
      console.log('MongoDB already connected');
    }
  } catch (error) {
    console.error('MongoDB connection error:', error);
    console.error('Error details:', error instanceof Error ? error.message : 'Unknown error');
    throw error; // Let the caller handle the error
  }
};

export default connectDB;