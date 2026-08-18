import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    sku: { type: String, required: true },
    price: { type: Number, required: true },
    cost: { type: Number, default: 0 },
    stock: { type: Number, default: 0 },
    rating: { type: Number, default: 5.0 },
    ordersCount: { type: Number, default: 0 },
    revenue: { type: Number, default: 0 },
    status: { type: String, default: 'In Stock' },
    image: { type: String, default: '' },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Product', ProductSchema);
