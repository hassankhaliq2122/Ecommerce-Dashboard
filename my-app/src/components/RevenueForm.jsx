import React, { useState } from 'react';
import { DollarSign, Target, Check, AlertCircle } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

function RevenueForm({ onUpdateRevenue, currentRevenue = 0, targetRevenue = 30000, currencySymbol = '$' }) {
  const [revenueInput, setRevenueInput] = useState('');
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const progress = targetRevenue > 0 ? Math.min((currentRevenue / targetRevenue) * 100, 100) : 0;

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    setError('');
    const val = Number(revenueInput);

    if (revenueInput.trim() === '' || isNaN(val)) {
      setError('Please enter a valid revenue number.');
      return;
    }

    if (val < 0) {
      setError('Revenue cannot be negative.');
      return;
    }

    onUpdateRevenue(val);
    setRevenueInput('');
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 2500);
  };

  return (
    <div className="form-card">
      <div className="card-header-row" style={{ marginBottom: '1rem' }}>
        <div className="card-title-group">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <DollarSign size={18} color="var(--brand-500)" />
            Revenue Management
          </h3>
          <p className="card-subtitle">Set actual gross revenue for this month</p>
        </div>
      </div>

      <div style={{ marginBottom: '1.25rem', padding: '0.75rem', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', fontSize: '0.85rem' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Current Revenue:</span>
          <strong style={{ color: 'var(--text-primary)' }}>{formatCurrency(currentRevenue, currencySymbol)}</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.8rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>Target: {formatCurrency(targetRevenue, currencySymbol)}</span>
          <span style={{ color: 'var(--brand-600)', fontWeight: 600 }}>{progress.toFixed(1)}%</span>
        </div>
        <div className="progress-track" style={{ height: '6px' }}>
          <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="revenue-input">
            Update Revenue ({currencySymbol})
          </label>
          <div className="form-inline">
            <input
              id="revenue-input"
              type="number"
              className="form-input"
              placeholder="e.g. 28500"
              value={revenueInput}
              min="0"
              step="any"
              onChange={(e) => {
                setRevenueInput(e.target.value);
                if (error) setError('');
              }}
            />
            <button type="submit" className="btn-primary" style={{ whiteSpace: 'nowrap' }}>
              {isSuccess ? <Check size={16} /> : null}
              {isSuccess ? 'Updated' : 'Set Revenue'}
            </button>
          </div>
          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--rose-600)', fontSize: '0.75rem', marginTop: '0.35rem' }}>
              <AlertCircle size={13} />
              <span>{error}</span>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}

export default RevenueForm;
