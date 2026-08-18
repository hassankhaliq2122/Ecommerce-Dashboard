import mongoose from 'mongoose';

const ExpenseSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: String, default: 'General' },
  date: { type: String, default: () => new Date().toISOString().split('T')[0] },
  status: { type: String, default: 'Paid' },
});

const OrderSchema = new mongoose.Schema({
  id: { type: String, required: true },
  customer: { type: String, required: true },
  email: { type: String },
  product: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, default: 'Pending' },
  date: { type: String, default: () => new Date().toISOString().split('T')[0] },
  paymentMethod: { type: String, default: 'Credit Card' },
});

const MonthlyRecordSchema = new mongoose.Schema(
  {
    month: { type: String, required: true, unique: true, index: true },
    label: { type: String },
    startDate: { type: String },
    endDate: { type: String },
    isCustomRange: { type: Boolean, default: false },
    revenue: { type: Number, required: true, default: 0 },
    revenueTarget: { type: Number, default: 30000 },
    productCost: { type: Number, required: true, default: 0 },
    ordersCount: { type: Number, default: 0 },
    conversionRate: { type: Number, default: 3.5 },
    expenses: [ExpenseSchema],
    orders: [OrderSchema],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('MonthlyRecord', MonthlyRecordSchema);
