import React, { useState, useEffect } from 'react';
import { Calendar, DollarSign, X, Check, TrendingUp, AlertCircle, Trash2, Clock, Sparkles, Plus, Receipt, Tag } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

const MODAL_EXPENSE_CATEGORIES = [
  'Marketing & Ads',
  'Packaging & Materials',
  'Shipping & Logistics',
  'Software & Subscriptions',
  'Salaries & Contractors',
  'Office & Overhead',
  'General Operations',
  'Other',
];

function AddDateRangeModal({ isOpen, onClose, onSave, onDelete, initialRecord = null, currencySymbol = '$' }) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [revenue, setRevenue] = useState('');
  const [productCost, setProductCost] = useState('');
  const [revenueTarget, setRevenueTarget] = useState('30000');
  const [customLabel, setCustomLabel] = useState('');
  const [error, setError] = useState('');

  // Multi-expense list state
  const [expensesList, setExpensesList] = useState([]);
  const [expenseName, setExpenseName] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseCategory, setExpenseCategory] = useState(MODAL_EXPENSE_CATEGORIES[0]);
  const [expenseInputError, setExpenseInputError] = useState('');

  useEffect(() => {
    if (initialRecord) {
      setStartDate(initialRecord.startDate || '');
      setEndDate(initialRecord.endDate || '');
      setRevenue(initialRecord.revenue !== undefined ? String(initialRecord.revenue) : '');
      setProductCost(initialRecord.productCost !== undefined ? String(initialRecord.productCost) : '');
      setRevenueTarget(initialRecord.revenueTarget !== undefined ? String(initialRecord.revenueTarget) : '30000');
      setCustomLabel(initialRecord.label || '');
      setExpensesList(Array.isArray(initialRecord.expenses) ? [...initialRecord.expenses] : []);
    } else {
      const today = new Date();
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(today.getDate() - 30);

      setEndDate(today.toISOString().split('T')[0]);
      setStartDate(thirtyDaysAgo.toISOString().split('T')[0]);
      setRevenue('');
      setProductCost('');
      setRevenueTarget('30000');
      setCustomLabel('');
      setExpensesList([]);
    }
    setExpenseName('');
    setExpenseAmount('');
    setExpenseInputError('');
    setError('');
  }, [initialRecord, isOpen]);

  if (!isOpen) return null;

  const numRevenue = Number(revenue) || 0;
  const numCost = Number(productCost) || 0;
  const totalExpensesSum = expensesList.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const netProfit = numRevenue - numCost - totalExpensesSum;
  const profitMargin = numRevenue > 0 ? ((netProfit / numRevenue) * 100).toFixed(1) : '0.0';

  const formatDateLabel = (s, e) => {
    if (!s || !e) return '';
    try {
      const d1 = new Date(s + 'T00:00:00');
      const d2 = new Date(e + 'T00:00:00');
      const sStr = d1.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
      const eStr = d2.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
      return `${sStr} - ${eStr}`;
    } catch (err) {
      return `${s} - ${e}`;
    }
  };

  const handleAddExpenseItem = (e) => {
    if (e) e.preventDefault();
    setExpenseInputError('');

    const trimmedName = expenseName.trim();
    const amountVal = Number(expenseAmount);

    if (!trimmedName) {
      setExpenseInputError('Please enter an expense name.');
      return;
    }
    if (isNaN(amountVal) || amountVal <= 0) {
      setExpenseInputError('Please enter an amount > 0.');
      return;
    }

    const newExpense = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      name: trimmedName,
      amount: amountVal,
      category: expenseCategory || 'General Operations',
      date: endDate || new Date().toISOString().split('T')[0],
      status: 'Paid',
    };

    setExpensesList((prev) => [...prev, newExpense]);
    setExpenseName('');
    setExpenseAmount('');
  };

  const handleRemoveExpenseItem = (id) => {
    setExpensesList((prev) => prev.filter((item) => item.id !== id));
  };

  const handleQuickRangePreset = (days) => {
    const today = new Date();
    const pastDate = new Date();
    pastDate.setDate(today.getDate() - days);

    setEndDate(today.toISOString().split('T')[0]);
    setStartDate(pastDate.toISOString().split('T')[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      setError('Please select both Start Date and End Date.');
      return;
    }
    if (new Date(startDate) > new Date(endDate)) {
      setError('Start Date cannot be after End Date.');
      return;
    }

    const periodKey = initialRecord?.month || `${startDate}_${endDate}`;
    const autoLabel = formatDateLabel(startDate, endDate);

    const payload = {
      month: periodKey,
      label: customLabel.trim() || autoLabel,
      startDate,
      endDate,
      revenue: numRevenue,
      productCost: numCost,
      revenueTarget: Number(revenueTarget) || 30000,
      expenses: expensesList,
      orders: initialRecord?.orders || [],
      isCustomRange: true,
    };

    onSave(payload);
    onClose();
  };

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '1rem',
      }}
    >
      <div
        className="modal-container"
        style={{
          maxWidth: '620px',
          width: '100%',
          maxHeight: '90vh',
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius-xl, 16px)',
          border: '1px solid var(--border-color)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflowY: 'auto',
          animation: 'modalFadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Styled Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            background: 'linear-gradient(135deg, var(--brand-600), var(--brand-800, #3730a3))',
            color: '#ffffff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'sticky',
            top: 0,
            zIndex: 10,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                backgroundColor: 'rgba(255, 255, 255, 0.18)',
                backdropFilter: 'blur(6px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Calendar size={20} color="#ffffff" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, color: '#ffffff' }}>
                {initialRecord ? 'Edit Date Range Report' : 'Create Date Range Report'}
              </h3>
              <p style={{ margin: '0.15rem 0 0 0', fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.85)' }}>
                Set custom start & end dates, revenue, and list named expenses.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              cursor: 'pointer',
            }}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
          {error && (
            <div
              style={{
                marginBottom: '1rem',
                padding: '0.75rem 1rem',
                backgroundColor: 'var(--rose-50)',
                border: '1px solid var(--rose-200)',
                color: 'var(--rose-600)',
                borderRadius: 'var(--radius-md, 10px)',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontWeight: 500,
              }}
            >
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {/* Quick Date Presets */}
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.4rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <Clock size={12} />
              Quick Date Presets:
            </div>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn-secondary"
                style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem', borderRadius: 'var(--radius-sm)' }}
                onClick={() => handleQuickRangePreset(7)}
              >
                Last 7 Days
              </button>
              <button
                type="button"
                className="btn-secondary"
                style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem', borderRadius: 'var(--radius-sm)' }}
                onClick={() => handleQuickRangePreset(14)}
              >
                Last 14 Days
              </button>
              <button
                type="button"
                className="btn-secondary"
                style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem', borderRadius: 'var(--radius-sm)' }}
                onClick={() => handleQuickRangePreset(30)}
              >
                Last 30 Days
              </button>
              <button
                type="button"
                className="btn-secondary"
                style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem', borderRadius: 'var(--radius-sm)' }}
                onClick={() => handleQuickRangePreset(90)}
              >
                Last 90 Days
              </button>
            </div>
          </div>

          {/* Date Selection Inputs */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                Start Date <span style={{ color: 'var(--rose-500)' }}>*</span>
              </label>
              <input
                type="date"
                className="form-input"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                End Date <span style={{ color: 'var(--rose-500)' }}>*</span>
              </label>
              <input
                type="date"
                className="form-input"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          {/* Active Period Label Card */}
          {startDate && endDate && (
            <div
              style={{
                marginBottom: '1.25rem',
                padding: '0.5rem 0.85rem',
                backgroundColor: 'var(--brand-50, rgba(99, 102, 241, 0.08))',
                border: '1px solid var(--brand-200, rgba(99, 102, 241, 0.2))',
                borderRadius: 'var(--radius-md, 8px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                <Sparkles size={16} color="var(--brand-600)" />
                <span style={{ color: 'var(--text-muted)' }}>Period Tab:</span>
                <strong style={{ color: 'var(--brand-700, var(--brand-600))' }}>{formatDateLabel(startDate, endDate)}</strong>
              </div>
            </div>
          )}

          {/* Financial Inputs Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                Total Revenue ({currencySymbol})
              </label>
              <input
                type="number"
                min="0"
                step="any"
                placeholder="e.g. 50000"
                className="form-input"
                value={revenue}
                onChange={(e) => setRevenue(e.target.value)}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                Product Cost / COGS ({currencySymbol})
              </label>
              <input
                type="number"
                min="0"
                step="any"
                placeholder="e.g. 20000"
                className="form-input"
                value={productCost}
                onChange={(e) => setProductCost(e.target.value)}
              />
            </div>
          </div>

          {/* MULTI-EXPENSE SECTION */}
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-main)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.25rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Receipt size={16} color="var(--rose-600)" />
                <strong style={{ fontSize: '0.88rem', color: 'var(--text-main)' }}>Named Expenses List</strong>
              </div>
              <span className="badge badge-primary" style={{ fontSize: '0.72rem' }}>
                {expensesList.length} items
              </span>
            </div>

            {/* Row to add an expense */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1.5fr auto', gap: '0.5rem', marginBottom: '0.6rem', alignItems: 'flex-end' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem', fontWeight: 600 }}>
                  Expense Name
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Facebook Ads"
                  value={expenseName}
                  onChange={(e) => setExpenseName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddExpenseItem();
                    }
                  }}
                  style={{ fontSize: '0.82rem', padding: '0.45rem 0.6rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem', fontWeight: 600 }}>
                  Amount ({currencySymbol})
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  className="form-input"
                  placeholder="1500"
                  value={expenseAmount}
                  onChange={(e) => setExpenseAmount(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddExpenseItem();
                    }
                  }}
                  style={{ fontSize: '0.82rem', padding: '0.45rem 0.6rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem', fontWeight: 600 }}>
                  Category
                </label>
                <select
                  className="form-input"
                  value={expenseCategory}
                  onChange={(e) => setExpenseCategory(e.target.value)}
                  style={{ fontSize: '0.82rem', padding: '0.45rem 0.6rem' }}
                >
                  {MODAL_EXPENSE_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={handleAddExpenseItem}
                  style={{ padding: '0.48rem 0.75rem', fontSize: '0.8rem', height: '34px', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                >
                  <Plus size={14} />
                  <span>Add</span>
                </button>
              </div>
            </div>

            {expenseInputError && (
              <div style={{ fontSize: '0.75rem', color: 'var(--rose-600)', marginBottom: '0.5rem' }}>
                {expenseInputError}
              </div>
            )}

            {/* List */}
            {expensesList.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', maxHeight: '180px', overflowY: 'auto' }}>
                {expensesList.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.45rem 0.65rem',
                      backgroundColor: 'var(--bg-card)',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-color)',
                      fontSize: '0.82rem',
                    }}
                  >
                    <div>
                      <strong style={{ color: 'var(--text-main)' }}>{item.name}</strong>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginLeft: '0.4rem' }}>
                        ({item.category})
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <strong style={{ color: 'var(--rose-600)' }}>
                        {formatCurrency(Number(item.amount) || 0, currencySymbol)}
                      </strong>
                      <button
                        type="button"
                        className="btn-icon"
                        onClick={() => handleRemoveExpenseItem(item.id)}
                        style={{ color: 'var(--rose-600)', padding: '0.2rem' }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center', padding: '0.5rem 0' }}>
                No individual expenses added yet.
              </div>
            )}

            {/* TOTAL SUM ROW AT THE END OF THE LIST */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.5rem 0.75rem',
                backgroundColor: 'var(--rose-50)',
                borderRadius: 'var(--radius-sm)',
                marginTop: '0.5rem',
              }}
            >
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--rose-800)' }}>
                Total Expenses Sum ({expensesList.length} items)
              </span>
              <strong style={{ fontSize: '0.95rem', color: 'var(--rose-700)' }}>
                {formatCurrency(totalExpensesSum, currencySymbol)}
              </strong>
            </div>
          </div>

          {/* Live Calculated Net Profit Summary Box */}
          <div
            style={{
              padding: '1rem 1.25rem',
              borderRadius: 'var(--radius-lg, 12px)',
              background: netProfit >= 0
                ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(5, 150, 105, 0.02))'
                : 'linear-gradient(135deg, rgba(244, 63, 94, 0.08), rgba(225, 29, 72, 0.02))',
              border: netProfit >= 0
                ? '1px solid rgba(16, 185, 129, 0.25)'
                : '1px solid rgba(244, 63, 94, 0.25)',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Calculated Net Profit
              </div>
              <div
                style={{
                  fontSize: '1.35rem',
                  fontWeight: 800,
                  color: netProfit >= 0 ? 'var(--emerald-600, #10b981)' : 'var(--rose-600, #e11d48)',
                  marginTop: '0.1rem',
                }}
              >
                {formatCurrency(netProfit, currencySymbol)}
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Profit Margin
              </div>
              <div
                style={{
                  fontSize: '1.15rem',
                  fontWeight: 700,
                  color: 'var(--text-main)',
                  marginTop: '0.1rem',
                }}
              >
                {profitMargin}%
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {initialRecord && onDelete ? (
              <button
                type="button"
                className="btn-secondary"
                style={{ color: 'var(--rose-600)', borderColor: 'var(--rose-200)', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}
                onClick={() => {
                  if (window.confirm('Delete this saved date range tab?')) {
                    onDelete(initialRecord.month);
                    onClose();
                  }
                }}
              >
                <Trash2 size={15} />
                Delete
              </button>
            ) : <div />}

            <div style={{ display: 'flex', gap: '0.6rem' }}>
              <button
                type="button"
                className="btn-secondary"
                onClick={onClose}
                style={{ padding: '0.55rem 1.1rem', fontSize: '0.85rem' }}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="btn-primary"
                style={{
                  padding: '0.55rem 1.3rem',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
                }}
              >
                <Check size={16} />
                Save Period Report
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddDateRangeModal;
