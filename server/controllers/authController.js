import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'shoplytics_super_secure_jwt_secret_2026_production_key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Helper to generate JWT Token
const generateToken = (userId, email, role) => {
  return jwt.sign({ id: userId, email, role }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

// Rate limiting in-memory map for brute-force protection
const loginAttempts = new Map();
const MAX_ATTEMPTS = 5;
const LOCKOUT_PERIOD_MS = 15 * 60 * 1000; // 15 minutes

const isRateLimited = (ip) => {
  const record = loginAttempts.get(ip);
  if (!record) return false;
  if (Date.now() > record.resetTime) {
    loginAttempts.delete(ip);
    return false;
  }
  return record.attempts >= MAX_ATTEMPTS;
};

const recordFailedAttempt = (ip) => {
  const record = loginAttempts.get(ip) || { attempts: 0, resetTime: Date.now() + LOCKOUT_PERIOD_MS };
  record.attempts += 1;
  loginAttempts.set(ip, record);
};

const clearAttempts = (ip) => {
  loginAttempts.delete(ip);
};

// @desc    Register a new user
// @route   POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields: name, email, and password.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (cleanPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return res.status(409).json({ message: 'An account with this email address already exists.' });
    }

    // Hash password with bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(cleanPassword, salt);

    // Create user in MongoDB
    const user = await User.create({
      name: name.trim(),
      email: cleanEmail,
      password: hashedPassword,
      role: 'admin',
    });

    const token = generateToken(user._id, user.email, user.role);

    return res.status(201).json({
      message: 'Account created successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Registration Error:', error);
    return res.status(500).json({ message: 'Server error creating account', error: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
export const login = async (req, res) => {
  try {
    const clientIp = req.ip || req.headers['x-forwarded-for'] || 'client';

    if (isRateLimited(clientIp)) {
      return res.status(429).json({
        message: 'Too many failed login attempts. Account temporarily locked for 15 minutes to prevent brute-force attacks.',
      });
    }

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    // Check MongoDB user
    let user = await User.findOne({ email: cleanEmail });

    // If user not in MongoDB yet, check .env default admin credentials
    const envEmail = (process.env.ADMIN_EMAIL || process.env.VITE_ADMIN_EMAIL || '').trim().toLowerCase();
    const envPassword = (process.env.ADMIN_PASSWORD || process.env.VITE_ADMIN_PASSWORD || '').trim();

    if (!user && envEmail && cleanEmail === envEmail) {
      if (cleanPassword === envPassword) {
        // Auto-seed admin user with hashed password into MongoDB
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(cleanPassword, salt);
        user = await User.create({
          name: process.env.ADMIN_NAME || 'Admin User',
          email: envEmail,
          password: hashedPassword,
          role: 'admin',
        });
      }
    }

    if (!user) {
      recordFailedAttempt(clientIp);
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Secure password comparison
    const isMatch = await bcrypt.compare(cleanPassword, user.password);
    if (!isMatch) {
      recordFailedAttempt(clientIp);
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Reset failed attempts on success
    clearAttempts(clientIp);

    const token = generateToken(user._id, user.email, user.role);

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({ message: 'Server error during login', error: error.message });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
export const getMe = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No authentication token provided.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ user });
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired authentication token.' });
  }
};
