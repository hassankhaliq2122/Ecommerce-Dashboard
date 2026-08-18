import React, { useState, useEffect } from 'react';
import { Calendar, DollarSign, X, Check, TrendingUp, AlertCircle, Trash2, Clock, Sparkles } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

function AddDateRangeModal({ isOpen, onClose, onSave, onDelete, initialRecord = null, currencySymbol = '$' }) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [revenue, setRevenue] = useState('');
  const [productCost, setProductCost] = useState('');
  const [expensesAmount, setExpensesAmount] = useState('');
  const [revenueTarget, setRevenueTarget] = useState('30000');
  const [customLabel, setCustomLabel] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialRecord) {
      setStartDate(initialRecord.startDate || '');
      setEndDate(initialRecord.endDate || '');
      setRevenue(initialRecord.revenue !== undefined ? String(initialRecord.revenue) : '');
      setProductCost(initialRecord.productCost !== undefined ? String(initialRecord.productCost) : '');
      
      const totalExp = (initialRecord.expenses || []).reduce((acc, item) => acc + Number(item.amount || 0), 0);
      setExpensesAmount(String(totalExp));
      setRevenueTarget(initialRecord.revenueTarget !== undefined ? String(initialRecord.revenueTarget) : '30000');
      setCustomLabel(initialRecord.label || '');
    } else {
      const today = new Date();
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(today.getDate() - 30);

      setEndDate(today.toISOString().split('T')[0]);
      setStartDate(thirtyDaysAgo.toISOString().split('T')[0]);
      setRevenue('');
      setProductCost('');
      setExpensesAmount('');
      setRevenueTarget('30000');
      setCustomLabel('');
    }
    setError('');
  }, [initialRecord, isOpen]);

  if (!isOpen) return null;

  const numRevenue = Number(revenue) || 0;
  const numCost = Number(productCost) || 0;
  const numExpenses = Number(expensesAmount) || 0;
  const netProfit = numRevenue - numCost - numExpenses;
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

    const existingExpenses = initialRecord?.expenses || [];
    let updatedExpenses = [...existingExpenses];

    if (numExpenses > 0 && existingExpenses.length === 0) {
      updatedExpenses = [
        {
          id: Date.now(),
          name: 'Operating Overhead & Expenses',
          amount: numExpenses,
          category: 'Operations',
          date: endDate || new Date().toISOString().split('T')[0],
          status: 'Paid',
        },
      ];
    } else if (numExpenses !== undefined && existingExpenses.length > 0) {
      const currentSum = existingExpenses.reduce((s, x) => s + Number(x.amount || 0), 0);
      if (currentSum !== numExpenses) {
        updatedExpenses = [
          {
            id: Date.now(),
            name: 'Total Period Expenses',
            amount: numExpenses,
            category: 'Operations',
            date: endDate || new Date().toISOString().split('T')[0],
            status: 'Paid',
          },
        ];
      }
    }

    const payload = {
      month: periodKey,
      label: customLabel.trim() || autoLabel,
      startDate,
      endDate,
      revenue: numRevenue,
      productCost: numCost,
      revenueTarget: Number(revenueTarget) || 30000,
      expenses: updatedExpenses,
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
          maxWidth: '560px',
          width: '100%',
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius-xl, 16px)',
          border: '1px solid var(--border-color)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
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
            position: 'relative',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.18)',
                backdropFilter: 'blur(6px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}
            >
              <Calendar size={22} color="#ffffff" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.01em' }}>
                {initialRecord ? 'Edit Saved Date Range' : 'Create Saved Date Range'}
              </h3>
              <p style={{ margin: '0.15rem 0 0 0', fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.85)' }}>
                Select custom start & end dates and record financial figures.
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
              transition: 'background 0.2s',
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
              <div style={{ position: 'relative' }}>
                <input
                  type="date"
                  className="form-input"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.75rem',
                    borderRadius: 'var(--radius-md, 8px)',
                    border: '1px solid var(--border-color)',
                    fontSize: '0.9rem',
                    backgroundColor: 'var(--bg-main)',
                    color: 'var(--text-main)',
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                End Date <span style={{ color: 'var(--rose-500)' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="date"
                  className="form-input"
                  required
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.75rem',
                    borderRadius: 'var(--radius-md, 8px)',
                    border: '1px solid var(--border-color)',
                    fontSize: '0.9rem',
                    backgroundColor: 'var(--bg-main)',
                    color: 'var(--text-main)',
                  }}
                />
              </div>
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
                <span style={{ color: 'var(--text-muted)' }}>Display Tab Name:</span>
                <strong style={{ color: 'var(--brand-700, var(--brand-600))' }}>{formatDateLabel(startDate, endDate)}</strong>
              </div>
            </div>
          )}

          {/* Financial Inputs Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
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
                style={{
                  width: '100%',
                  padding: '0.6rem 0.75rem',
                  borderRadius: 'var(--radius-md, 8px)',
                  border: '1px solid var(--border-color)',
                  fontSize: '0.9rem',
                  backgroundColor: 'var(--bg-main)',
                  color: 'var(--text-main)',
                }}
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
                style={{
                  width: '100%',
                  padding: '0.6rem 0.75rem',
                  borderRadius: 'var(--radius-md, 8px)',
                  border: '1px solid var(--border-color)',
                  fontSize: '0.9rem',
                  backgroundColor: 'var(--bg-main)',
                  color: 'var(--text-main)',
                }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                Total Expenses ({currencySymbol})
              </label>
              <input
                type="number"
                min="0"
                step="any"
                placeholder="e.g. 5000"
                className="form-input"
                value={expensesAmount}
                onChange={(e) => setExpensesAmount(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.75rem',
                  borderRadius: 'var(--radius-md, 8px)',
                  border: '1px solid var(--border-color)',
                  fontSize: '0.9rem',
                  backgroundColor: 'var(--bg-main)',
                  color: 'var(--text-main)',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                Revenue Target ({currencySymbol})
              </label>
              <input
                type="number"
                min="0"
                step="any"
                placeholder="e.g. 60000"
                className="form-input"
                value={revenueTarget}
                onChange={(e) => setRevenueTarget(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.75rem',
                  borderRadius: 'var(--radius-md, 8px)',
                  border: '1px solid var(--border-color)',
                  fontSize: '0.9rem',
                  backgroundColor: 'var(--bg-main)',
                  color: 'var(--text-main)',
                }}
              />
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
                  fontSize: '1.4rem',
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
                Delete Tab
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
                Save Period Data
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddDateRangeModal;
