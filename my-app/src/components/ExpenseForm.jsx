import React, { useState } from 'react';
import { PlusCircle, AlertCircle, Receipt } from 'lucide-react';

function ExpenseForm({ onAddExpense, currencySymbol = '$' }) {
  const [textInput, setTextInput] = useState('');
  const [amountInput, setAmountInput] = useState('');
  const [categoryInput, setCategoryInput] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    setError('');

    const trimmedName = textInput.trim();
    const parsedAmount = Number(amountInput);

    if (!trimmedName) {
      setError('Expense name is required.');
      return;
    }

    if (amountInput.trim() === '' || isNaN(parsedAmount)) {
      setError('Please enter a valid expense amount.');
      return;
    }

    if (parsedAmount <= 0) {
      setError('Expense amount must be greater than 0.');
      return;
    }

    onAddExpense({
      name: trimmedName,
      amount: parsedAmount,
      category: categoryInput.trim() || 'General',
      date: new Date().toISOString().split('T')[0],
      status: 'Paid',
    });

    setTextInput('');
    setAmountInput('');
    setCategoryInput('');
  };

  return (
    <div className="form-card">
      <div className="card-header-row" style={{ marginBottom: '1rem' }}>
        <div className="card-title-group">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Receipt size={18} color="var(--rose-500)" />
            Add New Expense
          </h3>
          <p className="card-subtitle">Record arbitrary operating or marketing expense</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', marginBottom: '0.75rem' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="expense-name">
              Expense Description *
            </label>
            <input
              id="expense-name"
              type="text"
              className="form-input"
              placeholder="e.g. Meta Ads, Packaging"
              value={textInput}
              onChange={(e) => {
                setTextInput(e.target.value);
                if (error) setError('');
              }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="expense-amount">
              Amount ({currencySymbol}) *
            </label>
            <input
              id="expense-amount"
              type="number"
              className="form-input"
              placeholder="e.g. 750"
              min="0.01"
              step="any"
              value={amountInput}
              onChange={(e) => {
                setAmountInput(e.target.value);
                if (error) setError('');
              }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="expense-category">
              Category (Optional)
            </label>
            <input
              id="expense-category"
              type="text"
              className="form-input"
              placeholder="e.g. Marketing, Software"
              value={categoryInput}
              onChange={(e) => setCategoryInput(e.target.value)}
            />
          </div>
        </div>

        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--rose-600)', fontSize: '0.75rem', marginBottom: '0.75rem' }}>
            <AlertCircle size={13} />
            <span>{error}</span>
          </div>
        )}

        <button type="submit" className="btn-primary" style={{ width: '100%' }}>
          <PlusCircle size={16} />
          Add Expense
        </button>
      </form>
    </div>
  );
}

export default ExpenseForm;
