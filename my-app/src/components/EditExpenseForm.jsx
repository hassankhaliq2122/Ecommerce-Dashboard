import React, { useState, useEffect } from 'react';
import Modal from './ui/Modal';
import { AlertCircle, Check } from 'lucide-react';

function EditExpenseForm({ expense, onUpdateExpense, onCancel, currencySymbol = '$' }) {
  const [nameInput, setNameInput] = useState('');
  const [amountInput, setAmountInput] = useState('');
  const [categoryInput, setCategoryInput] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (expense) {
      setNameInput(expense.name || '');
      setAmountInput(expense.amount !== undefined ? expense.amount.toString() : '');
      setCategoryInput(expense.category || '');
      setError('');
    }
  }, [expense]);

  if (!expense) {
    return null;
  }

  const handleSave = (e) => {
    if (e) e.preventDefault();
    setError('');

    const trimmedName = nameInput.trim();
    const parsedAmount = Number(amountInput);

    if (!trimmedName) {
      setError('Expense name is required.');
      return;
    }

    if (amountInput.trim() === '' || isNaN(parsedAmount)) {
      setError('Please enter a valid amount.');
      return;
    }

    if (parsedAmount <= 0) {
      setError('Amount must be greater than 0.');
      return;
    }

    onUpdateExpense({
      ...expense,
      id: expense.id,
      name: trimmedName,
      amount: parsedAmount,
      category: categoryInput.trim() || 'General',
    });
  };

  return (
    <Modal
      isOpen={Boolean(expense)}
      onClose={onCancel}
      title="Edit Expense Record"
      footer={
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', width: '100%' }}>
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className="btn-primary" onClick={handleSave}>
            <Check size={16} />
            Save Changes
          </button>
        </div>
      }
    >
      <form onSubmit={handleSave}>
        <div className="form-group">
          <label className="form-label" htmlFor="edit-name">
            Expense Name *
          </label>
          <input
            id="edit-name"
            type="text"
            className="form-input"
            value={nameInput}
            onChange={(e) => {
              setNameInput(e.target.value);
              if (error) setError('');
            }}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="edit-amount">
            Amount ({currencySymbol}) *
          </label>
          <input
            id="edit-amount"
            type="number"
            className="form-input"
            value={amountInput}
            min="0.01"
            step="any"
            onChange={(e) => {
              setAmountInput(e.target.value);
              if (error) setError('');
            }}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="edit-category">
            Category (Optional)
          </label>
          <input
            id="edit-category"
            type="text"
            className="form-input"
            placeholder="e.g. Marketing, Logistics"
            value={categoryInput}
            onChange={(e) => setCategoryInput(e.target.value)}
          />
        </div>

        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--rose-600)', fontSize: '0.75rem', marginTop: '0.5rem' }}>
            <AlertCircle size={13} />
            <span>{error}</span>
          </div>
        )}
      </form>
    </Modal>
  );
}

export default EditExpenseForm;
