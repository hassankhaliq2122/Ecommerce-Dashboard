import mongoose from 'mongoose';
import dns from 'node:dns';
import MonthlyRecord from '../models/MonthlyRecord.js';
import Product from '../models/Product.js';
import Customer from '../models/Customer.js';
import Setting from '../models/Setting.js';
import {
  INITIAL_MONTHLY_RECORDS,
  INITIAL_PRODUCTS,
  INITIAL_CUSTOMERS,
  INITIAL_SETTINGS,
} from '../data/seedData.js';

// Configure DNS for reliable MongoDB Atlas SRV resolution
try {
  dns.setDefaultResultOrder('ipv4first');
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch (err) {
  console.log('DNS configuration note:', err.message);
}

export const resetDatabase = async () => {
  await MonthlyRecord.deleteMany({});
  await Product.deleteMany({});
  await Customer.deleteMany({});
  await Setting.deleteMany({});
  await MonthlyRecord.insertMany(INITIAL_MONTHLY_RECORDS);
  await Setting.create(INITIAL_SETTINGS);
  console.log('🧹 All dummy records, products, and customers cleared from MongoDB Atlas.');
};

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 8000,
    });
    console.log(`🚀 MongoDB Atlas Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`⚠️ MongoDB Atlas Notice (${error.message}). Will retry in background.`);
    return false;
  }
};
