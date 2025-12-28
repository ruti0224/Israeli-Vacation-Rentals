import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export async function connectDB() {
  try {
    const DB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ZimmerDB';
    await mongoose.connect(DB_URI);
    console.log('mongo connected successfully');
  } catch (error) {
    console.log('ERROR', error.message);
  } 
}