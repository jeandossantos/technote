import { config } from 'dotenv';
import mongoose from 'mongoose';

config();

async function connectDb() {
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(process.env.DATABASE_URI, {});
    console.log('Connected to mongodb successfully.');
  } catch (error) {
    console.log('🚀 ~ file: dbConnection.js:11 ~ connectDb ~ error:\n', error);
  }
}

export { connectDb };
