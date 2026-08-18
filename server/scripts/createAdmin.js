import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const createAdmin = async () => {
  const args = process.argv.slice(2);
  const name = args[0] || process.env.ADMIN_NAME || 'Admin User';
  const email = (args[1] || process.env.ADMIN_EMAIL || 'admin@shoplytics.io').trim().toLowerCase();
  const password = (args[2] || process.env.ADMIN_PASSWORD || 'password123').trim();

  if (!email || !password) {
    console.error('❌ Error: Email and password are required.');
    console.log('Usage: node scripts/createAdmin.js "Name" "email@domain.com" "password123"');
    process.exit(1);
  }

  try {
    console.log('⏳ Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to database.');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      existingUser.name = name;
      existingUser.password = hashedPassword;
      existingUser.role = 'admin';
      await existingUser.save();
      console.log(`\n🎉 Admin user updated successfully!`);
    } else {
      await User.create({
        name,
        email,
        password: hashedPassword,
        role: 'admin',
      });
      console.log(`\n🎉 New Admin user created successfully!`);
    }

    console.log(`----------------------------------------`);
    console.log(`👤 Name:  ${name}`);
    console.log(`📧 Email: ${email}`);
    console.log(`🔑 Role:  admin`);
    console.log(`----------------------------------------\n`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('❌ Failed to create/update admin user:', err.message);
    process.exit(1);
  }
};

createAdmin();
