import React, { useState } from 'react';
import { Package, Percent, Check, AlertCircle } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

function ProductCostForm({ onUpdateCost, currentCost = 0, revenue = 0, currencySymbol = '$' }) {
  const [costInput, setCostInput] = useState('');
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const costRatio = revenue > 0 ? (currentCost / revenue) * 100 : 0;

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    setError('');
    const val = Number(costInput);

    if (costInput.trim() === '' || isNaN(val)) {
      setError('Please enter a valid product cost.');
      return;
    }

    if (val < 0) {
      setError('Product cost cannot be negative.');
      return;
    }

    onUpdateCost(val);
    setCostInput('');
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 2500);
  };

  return (
    <div className="form-card">
      <div className="card-header-row" style={{ marginBottom: '1rem' }}>
        <div className="card-title-group">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Package size={18} color="var(--amber-500)" />
            Product Cost (COGS)
          </h3>
          <p className="card-subtitle">Cost of goods sold and manufacturing inventory</p>
        </div>
      </div>

      <div style={{ marginBottom: '1.25rem', padding: '0.75rem', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', fontSize: '0.85rem' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Current COGS:</span>
          <strong style={{ color: 'var(--text-primary)' }}>{formatCurrency(currentCost, currencySymbol)}</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>Share of Revenue:</span>
          <span style={{ color: costRatio > 60 ? 'var(--rose-600)' : 'var(--amber-600)', fontWeight: 600 }}>
            {costRatio.toFixed(1)}%
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="product-cost-input">
            Update Product Cost ({currencySymbol})
          </label>
          <div className="form-inline">
            <input
              id="product-cost-input"
              type="number"
              className="form-input"
              placeholder="e.g. 11800"
              value={costInput}
              min="0"
              step="any"
              onChange={(e) => {
                setCostInput(e.target.value);
                if (error) setError('');
              }}
            />
            <button type="submit" className="btn-primary" style={{ whiteSpace: 'nowrap' }}>
              {isSuccess ? <Check size={16} /> : null}
              {isSuccess ? 'Updated' : 'Set Cost'}
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

export default ProductCostForm;
