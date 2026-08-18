import Product from '../models/Product.js';

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ ordersCount: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve products', error: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create product', error: error.message });
  }
};
