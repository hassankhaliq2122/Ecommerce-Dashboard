import React, { useState } from 'react';
import { Calendar, Plus, Edit2, Trash2, Check, ArrowRight, DollarSign, TrendingUp, Receipt, Clock, Sparkles } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

function DatePeriodsPage({
  monthlyRecords = [],
  selectedMonth,
  setSelectedMonth,
  onSaveDateRange,
  onDeleteDateRange,
  onNavigateToDashboard,
  currencySymbol = '$',
}) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [revenue, setRevenue] = useState('');
  const [productCost, setProductCost] = useState('');
  const [expensesAmount, setExpensesAmount] = useState('');
  const [revenueTarget, setRevenueTarget] = useState('30000');
  const [customLabel, setCustomLabel] = useState('');
  const [editingKey, setEditingKey] = useState(null);
  const [error, setError] = useState('');

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

  const handleEdit = (record) => {
    setEditingKey(record.month);
    setStartDate(record.startDate || '');
    setEndDate(record.endDate || '');
    setRevenue(record.revenue !== undefined ? String(record.revenue) : '');
    setProductCost(record.productCost !== undefined ? String(record.productCost) : '');
    const totalExp = (record.expenses || []).reduce((acc, i) => acc + Number(i.amount || 0), 0);
    setExpensesAmount(String(totalExp));
    setRevenueTarget(record.revenueTarget !== undefined ? String(record.revenueTarget) : '30000');
    setCustomLabel(record.label || '');
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetForm = () => {
    setEditingKey(null);
    setStartDate('');
    setEndDate('');
    setRevenue('');
    setProductCost('');
    setExpensesAmount('');
    setRevenueTarget('30000');
    setCustomLabel('');
    setError('');
  };

  const handleQuickPreset = (days) => {
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

    const periodKey = editingKey || `${startDate}_${endDate}`;
    const autoLabel = formatDateLabel(startDate, endDate);

    const existingRec = monthlyRecords.find((r) => r.month === periodKey);
    const existingExpenses = existingRec?.expenses || [];
    let updatedExpenses = [...existingExpenses];

    if (numExpenses > 0 && existingExpenses.length === 0) {
      updatedExpenses = [
        {
          id: Date.now(),
          name: 'Operating Expenses',
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
      orders: existingRec?.orders || [],
      isCustomRange: true,
    };

    onSaveDateRange(payload);
    handleResetForm();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
            Date Periods & Data Entry
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0' }}>
            Select custom date ranges (e.g. 3 Jul - 3 Aug) and record revenue, product cost, expenses & profit.
          </p>
        </div>

        {onNavigateToDashboard && (
          <button
            type="button"
            className="btn-secondary"
            onClick={onNavigateToDashboard}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}
          >
            <span>Go to Dashboard Overview</span>
            <ArrowRight size={16} />
          </button>
        )}
      </div>

      {/* Entry Form Card */}
      <div className="card" style={{ padding: '1.5rem', borderRadius: 'var(--radius-xl)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ padding: '0.5rem', borderRadius: 'var(--radius-md)', background: 'var(--brand-100)', color: 'var(--brand-600)' }}>
              <Calendar size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>
                {editingKey ? 'Edit Date Period Entry' : 'Add New Date Period Entry'}
              </h3>
              <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Enter date range and financial metrics.
              </p>
            </div>
          </div>

          {editingKey && (
            <button type="button" className="btn-secondary" onClick={handleResetForm} style={{ fontSize: '0.8rem' }}>
              Cancel Edit
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div style={{ marginBottom: '1rem', padding: '0.65rem 0.85rem', backgroundColor: 'var(--rose-50)', color: 'var(--rose-600)', borderRadius: 'var(--radius-md)', fontSize: '0.85rem' }}>
              {error}
            </div>
          )}

          {/* Quick Date Presets */}
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
              Quick Presets:
            </div>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              <button type="button" className="btn-secondary" style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }} onClick={() => handleQuickPreset(7)}>Last 7 Days</button>
              <button type="button" className="btn-secondary" style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }} onClick={() => handleQuickPreset(14)}>Last 14 Days</button>
              <button type="button" className="btn-secondary" style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }} onClick={() => handleQuickPreset(30)}>Last 30 Days (1 Month)</button>
              <button type="button" className="btn-secondary" style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }} onClick={() => handleQuickPreset(60)}>Last 60 Days (2 Months)</button>
            </div>
          </div>

          {/* Date Inputs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Start Date *</label>
              <input
                type="date"
                className="form-input"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div>
              <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>End Date *</label>
              <input
                type="date"
                className="form-input"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          {startDate && endDate && (
            <div style={{ fontSize: '0.82rem', color: 'var(--brand-600)', backgroundColor: 'var(--brand-50)', padding: '0.5rem 0.8rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', fontWeight: 500 }}>
              Period Label: <strong>{formatDateLabel(startDate, endDate)}</strong>
            </div>
          )}

          {/* Financial Numbers Inputs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Total Revenue ({currencySymbol})</label>
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
              <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Product Cost / COGS ({currencySymbol})</label>
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

            <div>
              <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Total Expenses ({currencySymbol})</label>
              <input
                type="number"
                min="0"
                step="any"
                placeholder="e.g. 5000"
                className="form-input"
                value={expensesAmount}
                onChange={(e) => setExpensesAmount(e.target.value)}
              />
            </div>

            <div>
              <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Revenue Target ({currencySymbol})</label>
              <input
                type="number"
                min="0"
                step="any"
                placeholder="e.g. 60000"
                className="form-input"
                value={revenueTarget}
                onChange={(e) => setRevenueTarget(e.target.value)}
              />
            </div>
          </div>

          {/* Live Calculated Net Profit */}
          <div style={{
            padding: '0.85rem 1.1rem',
            backgroundColor: 'var(--bg-muted)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.25rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', fontWeight: 600 }}>
                Calculated Net Profit
              </span>
              <span style={{ fontSize: '1.3rem', fontWeight: 800, color: netProfit >= 0 ? 'var(--emerald-600)' : 'var(--rose-600)' }}>
                {formatCurrency(netProfit, currencySymbol)}
              </span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', fontWeight: 600 }}>
                Profit Margin
              </span>
              <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                {profitMargin}%
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem' }}>
            <button type="button" className="btn-secondary" onClick={handleResetForm}>
              Reset Form
            </button>
            <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}>
              <Check size={16} />
              <span>{editingKey ? 'Update Period Data' : 'Save Date Period'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* List of All Saved Date Periods */}
      <div>
        <div style={{ marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>All Saved Date Periods ({monthlyRecords.length})</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0' }}>
            Click "View on Dashboard" to activate any saved period.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
          {monthlyRecords.map((rec) => {
            const isSelected = rec.month === selectedMonth;
            const rev = Number(rec.revenue) || 0;
            const cost = Number(rec.productCost) || 0;
            const exp = (rec.expenses || []).reduce((acc, i) => acc + Number(i.amount || 0), 0);
            const prof = rev - cost - exp;
            const margin = rev > 0 ? ((prof / rev) * 100).toFixed(1) : '0.0';

            const periodLabel = rec.label || (rec.startDate && rec.endDate ? `${rec.startDate} - ${rec.endDate}` : rec.month);

            return (
              <div
                key={rec.month}
                className="card"
                style={{
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-lg)',
                  border: isSelected ? '2px solid var(--brand-500)' : '1px solid var(--border-color)',
                  position: 'relative',
                  backgroundColor: 'var(--bg-card)',
                  boxShadow: isSelected ? '0 4px 16px rgba(99, 102, 241, 0.15)' : 'none',
                }}
              >
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.85rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Calendar size={16} color="var(--brand-600)" />
                      <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                        {periodLabel}
                      </h4>
                    </div>
                    {rec.startDate && rec.endDate && (
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem', display: 'block' }}>
                        {rec.startDate} to {rec.endDate}
                      </span>
                    )}
                  </div>

                  {isSelected && (
                    <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>
                      Active Tab
                    </span>
                  )}
                </div>

                {/* Numbers Summary */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', marginBottom: '1rem', fontSize: '0.82rem' }}>
                  <div style={{ backgroundColor: 'var(--bg-main)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)' }}>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.72rem' }}>Revenue</span>
                    <strong style={{ color: 'var(--brand-600)', fontSize: '0.95rem' }}>{formatCurrency(rev, currencySymbol)}</strong>
                  </div>

                  <div style={{ backgroundColor: 'var(--bg-main)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)' }}>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.72rem' }}>Product Cost</span>
                    <strong style={{ fontSize: '0.95rem' }}>{formatCurrency(cost, currencySymbol)}</strong>
                  </div>

                  <div style={{ backgroundColor: 'var(--bg-main)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)' }}>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.72rem' }}>Expenses</span>
                    <strong style={{ color: 'var(--rose-600)', fontSize: '0.95rem' }}>{formatCurrency(exp, currencySymbol)}</strong>
                  </div>

                  <div style={{ backgroundColor: 'var(--bg-main)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)' }}>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.72rem' }}>Net Profit</span>
                    <strong style={{ color: prof >= 0 ? 'var(--emerald-600)' : 'var(--rose-600)', fontSize: '0.95rem' }}>
                      {formatCurrency(prof, currencySymbol)} ({margin}%)
                    </strong>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: '0.5rem', borderTop: '1px dashed var(--border-color)' }}>
                  <div style={{ display: 'flex', gap: '0.3rem' }}>
                    <button
                      type="button"
                      className="btn-icon"
                      title="Edit Period"
                      onClick={() => handleEdit(rec)}
                    >
                      <Edit2 size={14} />
                    </button>
                    {monthlyRecords.length > 1 && (
                      <button
                        type="button"
                        className="btn-icon"
                        title="Delete Period"
                        style={{ color: 'var(--rose-600)' }}
                        onClick={() => {
                          if (window.confirm(`Delete date period "${periodLabel}"?`)) {
                            onDeleteDateRange(rec.month);
                          }
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>

                  <button
                    type="button"
                    className={isSelected ? 'btn-primary' : 'btn-secondary'}
                    style={{ fontSize: '0.78rem', padding: '0.3rem 0.7rem' }}
                    onClick={() => {
                      setSelectedMonth(rec.month);
                      if (onNavigateToDashboard) {
                        onNavigateToDashboard();
                      }
                    }}
                  >
                    {isSelected ? 'Viewing on Dashboard' : 'Select on Dashboard'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default DatePeriodsPage;
