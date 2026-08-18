import Customer from '../models/Customer.js';

export const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find().sort({ totalSpend: -1 });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve customers', error: error.message });
  }
};
