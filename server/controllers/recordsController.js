import MonthlyRecord from '../models/MonthlyRecord.js';

// Get all monthly records
export const getMonthlyRecords = async (req, res) => {
  try {
    const records = await MonthlyRecord.find().sort({ month: 1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve records', error: error.message });
  }
};

// Update revenue for a given month
export const updateMonthRevenue = async (req, res) => {
  try {
    const { month } = req.params;
    const { revenue } = req.body;

    const record = await MonthlyRecord.findOneAndUpdate(
      { month },
      { $set: { revenue: Number(revenue) } },
      { new: true, upsert: true }
    );

    res.json(record);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update revenue', error: error.message });
  }
};

// Update product cost for a given month
export const updateMonthCost = async (req, res) => {
  try {
    const { month } = req.params;
    const { productCost } = req.body;

    const record = await MonthlyRecord.findOneAndUpdate(
      { month },
      { $set: { productCost: Number(productCost) } },
      { new: true, upsert: true }
    );

    res.json(record);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update product cost', error: error.message });
  }
};

// Add expense to a month
export const addMonthExpense = async (req, res) => {
  try {
    const { month } = req.params;
    const { name, amount, category, date, status } = req.body;

    const newExpense = {
      id: Date.now(),
      name,
      amount: Number(amount),
      category: category || 'General',
      date: date || new Date().toISOString().split('T')[0],
      status: status || 'Paid',
    };

    let record = await MonthlyRecord.findOne({ month });
    if (!record) {
      record = new MonthlyRecord({
        month,
        revenue: 0,
        productCost: 0,
        expenses: [newExpense],
      });
      await record.save();
    } else {
      record.expenses.push(newExpense);
      await record.save();
    }

    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add expense', error: error.message });
  }
};

// Update an existing expense
export const updateMonthExpense = async (req, res) => {
  try {
    const { month, expenseId } = req.params;
    const { name, amount, category } = req.body;

    const record = await MonthlyRecord.findOne({ month });
    if (!record) {
      return res.status(404).json({ message: 'Monthly record not found' });
    }

    const expense = record.expenses.find((e) => e.id === Number(expenseId));
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    if (name) expense.name = name;
    if (amount !== undefined) expense.amount = Number(amount);
    if (category) expense.category = category;

    await record.save();
    res.json(record);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update expense', error: error.message });
  }
};

// Delete an expense
export const deleteMonthExpense = async (req, res) => {
  try {
    const { month, expenseId } = req.params;

    const record = await MonthlyRecord.findOne({ month });
    if (!record) {
      return res.status(404).json({ message: 'Monthly record not found' });
    }

    record.expenses = record.expenses.filter((e) => e.id !== Number(expenseId));
    await record.save();

    res.json(record);
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete expense', error: error.message });
  }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { month, orderId } = req.params;
    const { status } = req.body;

    const record = await MonthlyRecord.findOne({ month });
    if (!record) {
      return res.status(404).json({ message: 'Monthly record not found' });
    }

    const order = record.orders.find((o) => o.id === orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    await record.save();

    res.json(record);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update order status', error: error.message });
  }
};
