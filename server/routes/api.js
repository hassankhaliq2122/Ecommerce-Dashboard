import express from 'express';
import mongoose from 'mongoose';
import {
  getMonthlyRecords,
  createOrUpdateRecord,
  deleteRecord,
  updateMonthRevenue,
  updateMonthCost,
  addMonthExpense,
  updateMonthExpense,
  deleteMonthExpense,
  updateOrderStatus,
} from '../controllers/recordsController.js';
import { getProducts, createProduct } from '../controllers/productsController.js';
import { getCustomers } from '../controllers/customersController.js';
import { getSettings, updateSettings, handleResetDatabase } from '../controllers/settingsController.js';
import { register, login, getMe } from '../controllers/authController.js';

const router = express.Router();

// Health check endpoint with database connectivity check
router.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({
    status: 'healthy',
    database: dbStatus,
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

// Authentication routes
router.post('/auth/register', register);
router.post('/auth/login', login);
router.get('/auth/me', getMe);

// Records & Finance routes
router.get('/records', getMonthlyRecords);
router.post('/records/save-period', createOrUpdateRecord);
router.delete('/records/:month', deleteRecord);
router.put('/records/:month/revenue', updateMonthRevenue);
router.put('/records/:month/product-cost', updateMonthCost);
router.post('/records/:month/expenses', addMonthExpense);
router.put('/records/:month/expenses/:expenseId', updateMonthExpense);
router.delete('/records/:month/expenses/:expenseId', deleteMonthExpense);
router.put('/records/:month/orders/:orderId/status', updateOrderStatus);

// Products routes
router.get('/products', getProducts);
router.post('/products', createProduct);

// Customers routes
router.get('/customers', getCustomers);

// Settings routes
router.get('/settings', getSettings);
router.put('/settings', updateSettings);
router.post('/seed/reset', handleResetDatabase);

export default router;
