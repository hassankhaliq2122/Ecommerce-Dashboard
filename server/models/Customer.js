import mongoose from 'mongoose';

const CustomerSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    avatar: { type: String, default: '' },
    totalSpend: { type: Number, default: 0 },
    ordersCount: { type: Number, default: 0 },
    status: { type: String, default: 'Active' },
    type: { type: String, default: 'New' },
    joinDate: { type: String, default: () => new Date().toISOString().split('T')[0] },
    location: { type: String, default: 'United States' },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Customer', CustomerSchema);
