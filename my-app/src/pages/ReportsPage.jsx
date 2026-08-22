import React, { useState } from 'react';
import {
  FileText,
  Calendar,
  Plus,
  Trash2,
  Edit2,
  Check,
  ArrowRight,
  DollarSign,
  TrendingUp,
  Receipt,
  Percent,
  Sparkles,
  Layers,
  ChevronDown,
  ChevronUp,
  Tag,
  AlertCircle,
  Clock,
  Eye,
  X,
} from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

const EXPENSE_CATEGORIES = [
  'Marketing & Ads',
  'Packaging & Materials',
  'Shipping & Logistics',
  'Software & Subscriptions',
  'Salaries & Contractors',
  'Office & Overhead',
  'General Operations',
  'Other',
];

function ReportsPage({
  monthlyRecords = [],
  selectedMonth,
  setSelectedMonth,
  onSaveDateRange,
  onDeleteDateRange,
  onNavigateToDashboard,
  currencySymbol = '$',
}) {
  // Form State
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [revenue, setRevenue] = useState('');
  const [productCost, setProductCost] = useState('');
  const [revenueTarget, setRevenueTarget] = useState('30000');
  const [customLabel, setCustomLabel] = useState('');
  const [editingKey, setEditingKey] = useState(null);
  const [error, setError] = useState('');

  // Dynamic Multi-Expense State
  const [expensesList, setExpensesList] = useState([]);
  const [expenseName, setExpenseName] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseCategory, setExpenseCategory] = useState(EXPENSE_CATEGORIES[0]);
  const [expenseInputError, setExpenseInputError] = useState('');

  // Modal / Expanded State for Saved Reports
  const [viewingRecordExpenses, setViewingRecordExpenses] = useState(null);

  // Financial Calculations
  const numRevenue = Number(revenue) || 0;
  const numCost = Number(productCost) || 0;
  const totalExpensesSum = expensesList.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const grossProfit = numRevenue - numCost;
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

  // Add a new named expense item to the list
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
      setExpenseInputError('Please enter a valid expense amount greater than 0.');
      return;
    }

    const newExpenseItem = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      name: trimmedName,
      amount: amountVal,
      category: expenseCategory || 'General Operations',
      date: endDate || new Date().toISOString().split('T')[0],
      status: 'Paid',
    };

    setExpensesList((prev) => [...prev, newExpenseItem]);
    setExpenseName('');
    setExpenseAmount('');
  };

  // Remove an expense item from the list
  const handleRemoveExpenseItem = (id) => {
    setExpensesList((prev) => prev.filter((item) => item.id !== id));
  };

  // Quick Preset Handlers
  const handleQuickPreset = (days) => {
    const today = new Date();
    const pastDate = new Date();
    pastDate.setDate(today.getDate() - days);

    setEndDate(today.toISOString().split('T')[0]);
    setStartDate(pastDate.toISOString().split('T')[0]);
  };

  const handleThisMonthPreset = () => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    setStartDate(firstDay.toISOString().split('T')[0]);
    setEndDate(lastDay.toISOString().split('T')[0]);
  };

  // Edit an existing saved record
  const handleEdit = (record) => {
    setEditingKey(record.month);
    setStartDate(record.startDate || '');
    setEndDate(record.endDate || '');
    setRevenue(record.revenue !== undefined ? String(record.revenue) : '');
    setProductCost(record.productCost !== undefined ? String(record.productCost) : '');
    setRevenueTarget(record.revenueTarget !== undefined ? String(record.revenueTarget) : '30000');
    setCustomLabel(record.label || '');
    setExpensesList(Array.isArray(record.expenses) ? [...record.expenses] : []);
    setExpenseName('');
    setExpenseAmount('');
    setExpenseInputError('');
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset the entire form
  const handleResetForm = () => {
    setEditingKey(null);
    setStartDate('');
    setEndDate('');
    setRevenue('');
    setProductCost('');
    setRevenueTarget('30000');
    setCustomLabel('');
    setExpensesList([]);
    setExpenseName('');
    setExpenseAmount('');
    setExpenseInputError('');
    setError('');
  };

  // Save the report
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

    const payload = {
      month: periodKey,
      label: customLabel.trim() || autoLabel,
      startDate,
      endDate,
      revenue: numRevenue,
      productCost: numCost,
      revenueTarget: Number(revenueTarget) || 30000,
      expenses: expensesList,
      orders: existingRec?.orders || [],
      isCustomRange: true,
    };

    if (onSaveDateRange) {
      onSaveDateRange(payload);
    }
    handleResetForm();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ padding: '0.45rem', borderRadius: 'var(--radius-md)', background: 'var(--brand-100)', color: 'var(--brand-600)' }}>
              <FileText size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                Financial Reports & Periods
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0' }}>
                Create period reports, record custom named expenses in dynamic lists, and compute net profits.
              </p>
            </div>
          </div>
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
            <div style={{ padding: '0.45rem', borderRadius: 'var(--radius-md)', background: 'var(--brand-100)', color: 'var(--brand-600)' }}>
              <Calendar size={18} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>
                {editingKey ? 'Edit Financial Report' : 'Generate New Period Report'}
              </h3>
              <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Select period dates, revenue, product cost, and add individual named expenses.
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
            <div style={{ marginBottom: '1rem', padding: '0.65rem 0.85rem', backgroundColor: 'var(--rose-50)', color: 'var(--rose-600)', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <AlertCircle size={16} />
              <span>{error}</span>
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
              <button type="button" className="btn-secondary" style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }} onClick={() => handleQuickPreset(30)}>Last 30 Days</button>
              <button type="button" className="btn-secondary" style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }} onClick={() => handleQuickPreset(60)}>Last 60 Days</button>
              <button type="button" className="btn-secondary" style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }} onClick={handleThisMonthPreset}>This Month</button>
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

            <div>
              <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Custom Report Label (Optional)</label>
              <input
                type="text"
                className="form-input"
                placeholder={startDate && endDate ? formatDateLabel(startDate, endDate) : 'e.g. Q3 Summer Campaign'}
                value={customLabel}
                onChange={(e) => setCustomLabel(e.target.value)}
              />
            </div>
          </div>

          {startDate && endDate && (
            <div style={{ fontSize: '0.82rem', color: 'var(--brand-600)', backgroundColor: 'var(--brand-50)', padding: '0.5rem 0.8rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem', fontWeight: 500 }}>
              Report Period: <strong>{formatDateLabel(startDate, endDate)}</strong>
            </div>
          )}

          {/* Financial Numbers Inputs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
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

          {/* ========================================================================= */}
          {/* MULTI-EXPENSE SECTION: ADD AS MANY NAMED EXPENSES AS DESIRED IN A LIST   */}
          {/* ========================================================================= */}
          <div
            style={{
              padding: '1.25rem',
              backgroundColor: 'var(--bg-main)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-lg)',
              marginBottom: '1.5rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ padding: '0.35rem', borderRadius: 'var(--radius-sm)', background: 'var(--rose-100)', color: 'var(--rose-600)' }}>
                  <Receipt size={16} />
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700 }}>
                    Period Expenses Breakdown
                  </h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Add as many named expenses as needed. They will be saved in a list and summed automatically.
                  </span>
                </div>
              </div>

              <span className="badge badge-primary" style={{ fontSize: '0.75rem' }}>
                {expensesList.length} {expensesList.length === 1 ? 'Expense Item' : 'Expense Items'}
              </span>
            </div>

            {/* Expense Inputs Row */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(180px, 2fr) minmax(130px, 1fr) minmax(160px, 1.5fr) auto',
                gap: '0.75rem',
                alignItems: 'flex-end',
                marginBottom: '1rem',
              }}
            >
              <div>
                <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                  Expense Name *
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Facebook Ads, Packaging, Rent"
                  value={expenseName}
                  onChange={(e) => setExpenseName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddExpenseItem();
                    }
                  }}
                />
              </div>

              <div>
                <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                  Amount ({currencySymbol}) *
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  className="form-input"
                  placeholder="e.g. 1500"
                  value={expenseAmount}
                  onChange={(e) => setExpenseAmount(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddExpenseItem();
                    }
                  }}
                />
              </div>

              <div>
                <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                  Category
                </label>
                <select
                  className="form-input"
                  value={expenseCategory}
                  onChange={(e) => setExpenseCategory(e.target.value)}
                >
                  {EXPENSE_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={handleAddExpenseItem}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.55rem 0.9rem',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    height: '38px',
                  }}
                >
                  <Plus size={16} />
                  <span>Add Expense</span>
                </button>
              </div>
            </div>

            {expenseInputError && (
              <div style={{ fontSize: '0.78rem', color: 'var(--rose-600)', marginBottom: '0.75rem', fontWeight: 500 }}>
                {expenseInputError}
              </div>
            )}

            {/* List of Added Expenses */}
            {expensesList.length === 0 ? (
              <div
                style={{
                  padding: '1.25rem',
                  textAlign: 'center',
                  backgroundColor: 'var(--bg-card)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px dashed var(--border-color)',
                  color: 'var(--text-muted)',
                  fontSize: '0.82rem',
                }}
              >
                No individual expenses added yet. Enter an expense name and amount above, then click <strong>"+ Add Expense"</strong>.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div
                  style={{
                    maxHeight: '260px',
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.4rem',
                    paddingRight: '0.25rem',
                  }}
                >
                  {expensesList.map((item, index) => (
                    <div
                      key={item.id || index}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.55rem 0.85rem',
                        backgroundColor: 'var(--bg-card)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-color)',
                        fontSize: '0.85rem',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, minWidth: '18px' }}>
                          #{index + 1}
                        </span>
                        <div>
                          <strong style={{ color: 'var(--text-main)', display: 'block', fontSize: '0.88rem' }}>
                            {item.name}
                          </strong>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                            <Tag size={10} />
                            {item.category || 'General Operations'}
                          </span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <strong style={{ color: 'var(--rose-600)', fontSize: '0.95rem' }}>
                          {formatCurrency(Number(item.amount) || 0, currencySymbol)}
                        </strong>
                        <button
                          type="button"
                          className="btn-icon"
                          title="Remove this expense"
                          onClick={() => handleRemoveExpenseItem(item.id)}
                          style={{ color: 'var(--rose-600)', padding: '0.3rem' }}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* END OF EXPENSES LIST: TOTAL EXPENSES SUM */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    backgroundColor: 'var(--rose-50)',
                    border: '1px solid var(--rose-200)',
                    borderRadius: 'var(--radius-md)',
                    marginTop: '0.5rem',
                  }}
                >
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--rose-800)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                      Total Expenses Sum ({expensesList.length} {expensesList.length === 1 ? 'item' : 'items'})
                    </span>
                    <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--rose-700)' }}>
                      Automatically calculated from all items in the list above
                    </p>
                  </div>
                  <strong style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--rose-700)' }}>
                    {formatCurrency(totalExpensesSum, currencySymbol)}
                  </strong>
                </div>
              </div>
            )}
          </div>

          {/* Live Calculated Financial Summary Card */}
          <div
            style={{
              padding: '1rem 1.25rem',
              backgroundColor: 'var(--bg-muted)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-lg)',
              marginBottom: '1.5rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: '1rem',
            }}
          >
            <div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', fontWeight: 600 }}>
                Revenue
              </span>
              <strong style={{ fontSize: '1.1rem', color: 'var(--brand-600)' }}>
                {formatCurrency(numRevenue, currencySymbol)}
              </strong>
            </div>

            <div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', fontWeight: 600 }}>
                Product Cost (COGS)
              </span>
              <strong style={{ fontSize: '1.1rem', color: 'var(--text-main)' }}>
                {formatCurrency(numCost, currencySymbol)}
              </strong>
            </div>

            <div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', fontWeight: 600 }}>
                Total Expenses
              </span>
              <strong style={{ fontSize: '1.1rem', color: 'var(--rose-600)' }}>
                {formatCurrency(totalExpensesSum, currencySymbol)}
              </strong>
            </div>

            <div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', fontWeight: 600 }}>
                Calculated Net Profit
              </span>
              <strong style={{ fontSize: '1.25rem', color: netProfit >= 0 ? 'var(--emerald-600)' : 'var(--rose-600)' }}>
                {formatCurrency(netProfit, currencySymbol)}
              </strong>
            </div>

            <div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', fontWeight: 600 }}>
                Profit Margin
              </span>
              <strong style={{ fontSize: '1.1rem', color: Number(profitMargin) >= 20 ? 'var(--emerald-600)' : 'var(--text-main)' }}>
                {profitMargin}%
              </strong>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem' }}>
            <button type="button" className="btn-secondary" onClick={handleResetForm}>
              Reset Form
            </button>
            <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}>
              <Check size={16} />
              <span>{editingKey ? 'Update Period Report' : 'Save Period Report'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* ========================================================================= */}
      {/* ALL SAVED PERIOD REPORTS GRID                                            */}
      {/* ========================================================================= */}
      <div>
        <div style={{ marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>All Saved Period Reports ({monthlyRecords.length})</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0' }}>
            Click "Select on Dashboard" to activate any period, or click "View Expenses" to inspect named expenses.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {monthlyRecords.map((rec) => {
            const isSelected = rec.month === selectedMonth;
            const rev = Number(rec.revenue) || 0;
            const cost = Number(rec.productCost) || 0;
            const recExpenses = Array.isArray(rec.expenses) ? rec.expenses : [];
            const exp = recExpenses.reduce((acc, i) => acc + Number(i.amount || 0), 0);
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
                      <FileText size={16} color="var(--brand-600)" />
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
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', marginBottom: '0.85rem', fontSize: '0.82rem' }}>
                  <div style={{ backgroundColor: 'var(--bg-main)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)' }}>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.72rem' }}>Revenue</span>
                    <strong style={{ color: 'var(--brand-600)', fontSize: '0.95rem' }}>{formatCurrency(rev, currencySymbol)}</strong>
                  </div>

                  <div style={{ backgroundColor: 'var(--bg-main)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)' }}>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.72rem' }}>Product Cost</span>
                    <strong style={{ fontSize: '0.95rem' }}>{formatCurrency(cost, currencySymbol)}</strong>
                  </div>

                  <div style={{ backgroundColor: 'var(--bg-main)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)' }}>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.72rem' }}>
                      Expenses ({recExpenses.length} {recExpenses.length === 1 ? 'item' : 'items'})
                    </span>
                    <strong style={{ color: 'var(--rose-600)', fontSize: '0.95rem' }}>{formatCurrency(exp, currencySymbol)}</strong>
                  </div>

                  <div style={{ backgroundColor: 'var(--bg-main)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)' }}>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.72rem' }}>Net Profit</span>
                    <strong style={{ color: prof >= 0 ? 'var(--emerald-600)' : 'var(--rose-600)', fontSize: '0.95rem' }}>
                      {formatCurrency(prof, currencySymbol)} ({margin}%)
                    </strong>
                  </div>
                </div>

                {/* View Individual Expenses Breakdown Button */}
                {recExpenses.length > 0 && (
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setViewingRecordExpenses(rec)}
                    style={{
                      width: '100%',
                      padding: '0.35rem 0.6rem',
                      fontSize: '0.76rem',
                      marginBottom: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.35rem',
                      borderRadius: 'var(--radius-sm)',
                    }}
                  >
                    <Eye size={13} />
                    <span>View Named Expenses ({recExpenses.length})</span>
                  </button>
                )}

                {/* Footer Buttons */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.5rem', borderTop: '1px dashed var(--border-color)' }}>
                  <div style={{ display: 'flex', gap: '0.3rem' }}>
                    <button
                      type="button"
                      className="btn-icon"
                      title="Edit Period Report"
                      onClick={() => handleEdit(rec)}
                    >
                      <Edit2 size={14} />
                    </button>
                    {monthlyRecords.length > 1 && (
                      <button
                        type="button"
                        className="btn-icon"
                        title="Delete Period Report"
                        style={{ color: 'var(--rose-600)' }}
                        onClick={() => {
                          if (window.confirm(`Delete report "${periodLabel}"?`)) {
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

      {/* EXPENSE BREAKDOWN MODAL FOR SAVED REPORTS */}
      {viewingRecordExpenses && (
        <div className="modal-overlay" onClick={() => setViewingRecordExpenses(null)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '520px', width: '90%', borderRadius: 'var(--radius-xl)', padding: '1.5rem' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ padding: '0.4rem', borderRadius: 'var(--radius-md)', background: 'var(--rose-100)', color: 'var(--rose-600)' }}>
                  <Receipt size={18} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>
                    Expenses Breakdown
                  </h3>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {viewingRecordExpenses.label || viewingRecordExpenses.month}
                  </span>
                </div>
              </div>

              <button
                type="button"
                className="btn-icon"
                onClick={() => setViewingRecordExpenses(null)}
              >
                <X size={18} />
              </button>
            </div>

            {/* List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', maxHeight: '320px', overflowY: 'auto', marginBottom: '1.25rem' }}>
              {(viewingRecordExpenses.expenses || []).map((exp, idx) => (
                <div
                  key={exp.id || idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.6rem 0.85rem',
                    backgroundColor: 'var(--bg-main)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                  }}
                >
                  <div>
                    <strong style={{ color: 'var(--text-main)', display: 'block', fontSize: '0.88rem' }}>
                      {exp.name}
                    </strong>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {exp.category || 'General Operations'} • {exp.date || viewingRecordExpenses.endDate || 'Current'}
                    </span>
                  </div>
                  <strong style={{ color: 'var(--rose-600)', fontSize: '0.95rem' }}>
                    {formatCurrency(Number(exp.amount) || 0, currencySymbol)}
                  </strong>
                </div>
              ))}
            </div>

            {/* Total */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                backgroundColor: 'var(--rose-50)',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1rem',
              }}
            >
              <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--rose-800)' }}>
                Total Expenses
              </span>
              <strong style={{ fontSize: '1.15rem', color: 'var(--rose-700)' }}>
                {formatCurrency(
                  (viewingRecordExpenses.expenses || []).reduce((s, x) => s + (Number(x.amount) || 0), 0),
                  currencySymbol
                )}
              </strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="btn-primary"
                onClick={() => setViewingRecordExpenses(null)}
                style={{ fontSize: '0.85rem', padding: '0.4rem 1rem' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReportsPage;
