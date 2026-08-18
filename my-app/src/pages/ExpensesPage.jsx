import React, { useState } from 'react';
import MonthSelector from '../components/MonthSelector';
import ExpenseForm from '../components/ExpenseForm';
import EditExpenseForm from '../components/EditExpenseForm';
import ExpenseList from '../components/ExpenseList';
import SearchExpenses from '../components/SearchExpense';
import StatCard from '../components/StatCard';
import { formatCurrency } from '../utils/formatters';
import {
  Receipt,
  Download,
  PieChart as PieIcon,
  Tag,
  TrendingDown,
  Calendar,
  X,
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts';

const CATEGORY_COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

function ExpensesPage({
  monthlyRecords = [],
  selectedMonth,
  setSelectedMonth,
  onAddExpense,
  onDeleteExpense,
  onUpdateExpense,
  currencySymbol = '$',
}) {
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [editingExpense, setEditingExpense] = useState(null);

  const currentRecord =
    monthlyRecords.find((r) => r.month === selectedMonth) || { expenses: [], revenue: 0, productCost: 0 };
  const expenses = currentRecord.expenses || [];

  // Filter categories
  const categories = ['All', ...Array.from(new Set(expenses.map((e) => e.category || 'General')))];

  const filteredExpenses = expenses.filter((e) => {
    if (selectedCategory !== 'All' && (e.category || 'General') !== selectedCategory) {
      return false;
    }
    if (minAmount && Number(e.amount) < Number(minAmount)) return false;
    if (maxAmount && Number(e.amount) > Number(maxAmount)) return false;

    // Date range filter
    if (startDate && e.date && e.date < startDate) return false;
    if (endDate && e.date && e.date > endDate) return false;

    if (searchText.trim()) {
      const q = searchText.toLowerCase();
      const matchName = (e.name || '').toLowerCase().includes(q);
      const matchCat = (e.category || '').toLowerCase().includes(q);
      return matchName || matchCat;
    }
    return true;
  });

  const totalExpenseAmount = filteredExpenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  const avgExpense = filteredExpenses.length > 0 ? totalExpenseAmount / filteredExpenses.length : 0;
  const largestExpense = filteredExpenses.reduce((max, e) => Math.max(max, Number(e.amount) || 0), 0);

  // Group by category for donut chart
  const categoryGroups = filteredExpenses.reduce((acc, exp) => {
    const cat = exp.category || 'General';
    acc[cat] = (acc[cat] || 0) + Number(exp.amount || 0);
    return acc;
  }, {});

  const chartData = Object.entries(categoryGroups).map(([name, value]) => ({
    name,
    value,
  }));

  const availableMonths = monthlyRecords.map((r) => r.month);

  const clearDateFilter = () => {
    setStartDate('');
    setEndDate('');
  };

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <h2 className="welcome-title">Operating Expenses Management</h2>
          <p className="welcome-subtitle">
            Itemize, categorize, and track operational overhead for {selectedMonth}
          </p>
        </div>

        <div className="header-controls">
          <MonthSelector
            selectedMonth={selectedMonth}
            onMonthChange={setSelectedMonth}
            availableMonths={availableMonths}
          />
          <button
            className="btn-secondary"
            onClick={() => alert(`Exporting expenses report for ${selectedMonth}`)}
          >
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <StatCard
          title="Total Period Expenses"
          value={totalExpenseAmount}
          icon={Receipt}
          isCurrency={true}
          currencySymbol={currencySymbol}
          iconColor="#e11d48"
          iconBg="rgba(225, 29, 72, 0.1)"
        />
        <StatCard
          title="Total Expense Items"
          value={filteredExpenses.length}
          icon={Tag}
          isCurrency={false}
          iconColor="#4f46e5"
        />
        <StatCard
          title="Average Item Cost"
          value={avgExpense}
          icon={TrendingDown}
          isCurrency={true}
          currencySymbol={currencySymbol}
          iconColor="#f59e0b"
          iconBg="rgba(245, 158, 11, 0.1)"
        />
        <StatCard
          title="Largest Single Item"
          value={largestExpense}
          icon={Receipt}
          isCurrency={true}
          currencySymbol={currencySymbol}
          iconColor="#0ea5e9"
          iconBg="rgba(14, 165, 233, 0.1)"
        />
      </div>

      {/* Form & Category Breakdown Chart */}
      <div className="charts-grid-equal" style={{ alignItems: 'flex-start' }}>
        <ExpenseForm onAddExpense={onAddExpense} currencySymbol={currencySymbol} />

        <div className="chart-card">
          <div className="card-header-row">
            <div className="card-title-group">
              <h3>Expense Breakdown by Category</h3>
              <p className="card-subtitle">Spending distribution for {selectedMonth}</p>
            </div>
          </div>

          <div style={{ height: '220px' }}>
            {chartData.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                No expenses recorded this month
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {chartData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [formatCurrency(value, currencySymbol), 'Amount']}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', justifyContent: 'center', marginTop: '0.5rem' }}>
            {chartData.map((entry, idx) => (
              <div key={entry.name} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem' }}>
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: CATEGORY_COLORS[idx % CATEGORY_COLORS.length],
                  }}
                />
                <span>{entry.name}:</span>
                <strong>{formatCurrency(entry.value, currencySymbol)}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filtering Toolbar with Date Inputs */}
      <div className="table-card" style={{ padding: '1rem 1.25rem', marginBottom: '1.5rem' }}>
        <div className="table-toolbar" style={{ marginBottom: 0 }}>
          <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                className={selectedCategory === cat ? 'btn-primary' : 'btn-secondary'}
                style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <SearchExpenses
              searchText={searchText}
              onSearchChange={setSearchText}
              placeholder="Search expenses..."
            />

            {/* Custom Date Filters */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <Calendar size={14} color="var(--brand-500)" />
              <input
                type="date"
                className="form-input"
                style={{ width: '130px', fontSize: '0.75rem', padding: '0.35rem 0.5rem' }}
                placeholder="From"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <span>-</span>
              <input
                type="date"
                className="form-input"
                style={{ width: '130px', fontSize: '0.75rem', padding: '0.35rem 0.5rem' }}
                placeholder="To"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
              {(startDate || endDate) && (
                <button
                  className="btn-icon"
                  onClick={clearDateFilter}
                  title="Clear Date Filter"
                  style={{ color: 'var(--rose-600)' }}
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <input
              type="number"
              className="form-input"
              style={{ width: '85px', fontSize: '0.8rem', padding: '0.4rem 0.6rem' }}
              placeholder="Min $"
              value={minAmount}
              onChange={(e) => setMinAmount(e.target.value)}
            />
            <input
              type="number"
              className="form-input"
              style={{ width: '85px', fontSize: '0.8rem', padding: '0.4rem 0.6rem' }}
              placeholder="Max $"
              value={maxAmount}
              onChange={(e) => setMaxAmount(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Expense List Table */}
      <ExpenseList
        expenses={filteredExpenses}
        onDeleteExpense={onDeleteExpense}
        onEditExpense={(id) => {
          const exp = expenses.find((e) => e.id === id);
          setEditingExpense(exp);
        }}
        currencySymbol={currencySymbol}
      />

      {/* Edit Expense Modal */}
      <EditExpenseForm
        expense={editingExpense}
        onUpdateExpense={(updated) => {
          onUpdateExpense(updated);
          setEditingExpense(null);
        }}
        onCancel={() => setEditingExpense(null)}
        currencySymbol={currencySymbol}
      />
    </div>
  );
}

export default ExpensesPage;
