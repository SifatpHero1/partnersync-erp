import mongoose from 'mongoose';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export const connectMongo = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/partnersync');
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB Connection Failed:', error);
  }
};

export const pgPool = new Pool({
  connectionString: process.env.POSTGRES_URI,
});

export const connectPostgres = async () => {
  try {
    await pgPool.query('SELECT NOW()');
    console.log('✅ PostgreSQL Connected');
  } catch (error) {
    console.error('❌ PostgreSQL Connection Failed:', error);
  }
};