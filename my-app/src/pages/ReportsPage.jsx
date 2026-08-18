import React, { useState } from 'react';
import StatCard from '../components/StatCard';
import { formatCurrency, formatMonthYear, formatShortMonth } from '../utils/formatters';
import {
  FileText,
  Download,
  Printer,
  Calendar,
  TrendingUp,
  DollarSign,
  Receipt,
  Percent,
  X,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

function ReportsPage({ monthlyRecords = [], currencySymbol = '$' }) {
  const [timeframe, setTimeframe] = useState('6M');
  const [startMonth, setStartMonth] = useState('');
  const [endMonth, setEndMonth] = useState('');

  // Filter records based on timeframe or custom date range
  const getFilteredRecords = () => {
    if (timeframe === 'custom') {
      return monthlyRecords.filter((r) => {
        if (startMonth && r.month < startMonth) return false;
        if (endMonth && r.month > endMonth) return false;
        return true;
      });
    }

    switch (timeframe) {
      case '3M':
        return monthlyRecords.slice(-3);
      case '6M':
        return monthlyRecords.slice(-6);
      case '1Y':
      default:
        return monthlyRecords;
    }
  };

  const records = getFilteredRecords();

  const totalRevenue = records.reduce((sum, r) => sum + (r.revenue || 0), 0);
  const totalCost = records.reduce((sum, r) => sum + (r.productCost || 0), 0);
  const totalExpenses = records.reduce(
    (sum, r) => sum + (r.expenses || []).reduce((expSum, e) => expSum + (Number(e.amount) || 0), 0),
    0
  );
  const totalProfit = totalRevenue - totalCost - totalExpenses;
  const overallMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

  const chartData = records.map((r) => {
    const expenses = (r.expenses || []).reduce((s, e) => s + (Number(e.amount) || 0), 0);
    const profit = (r.revenue || 0) - (r.productCost || 0) - expenses;
    return {
      name: formatShortMonth(r.month),
      month: r.month,
      Revenue: r.revenue || 0,
      COGS: r.productCost || 0,
      Expenses: expenses,
      Profit: profit,
    };
  });

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <h2 className="welcome-title">Executive Financial Reports</h2>
          <p className="welcome-subtitle">
            Comprehensive P&L statements, multi-period trends, and custom timeframe auditing
          </p>
        </div>

        <div className="header-controls">
          <div style={{ display: 'flex', gap: '0.25rem', backgroundColor: 'var(--bg-card)', padding: '0.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', flexWrap: 'wrap' }}>
            {[
              { id: '3M', label: 'Last 3M' },
              { id: '6M', label: 'Last 6M' },
              { id: '1Y', label: 'Full Year' },
              { id: 'custom', label: 'Custom Range' },
            ].map((tf) => (
              <button
                key={tf.id}
                className={timeframe === tf.id ? 'btn-primary' : 'btn-secondary'}
                style={{ fontSize: '0.75rem', padding: '0.25rem 0.65rem', borderRadius: 'var(--radius-sm)' }}
                onClick={() => setTimeframe(tf.id)}
              >
                {tf.label}
              </button>
            ))}
          </div>

          <button
            className="btn-secondary"
            onClick={() => window.print()}
          >
            <Printer size={16} /> Print Statement
          </button>
          <button
            className="btn-primary"
            onClick={() => alert('Exporting full P&L spreadsheet...')}
          >
            <Download size={16} /> Export Report
          </button>
        </div>
      </div>

      {/* Custom Date Range Sub-Bar */}
      {timeframe === 'custom' && (
        <div className="table-card" style={{ padding: '0.85rem 1.25rem', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Calendar size={15} color="var(--brand-500)" />
              Custom Date Range:
            </span>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <span>From Period:</span>
              <input
                type="month"
                className="form-input"
                style={{ width: '150px', padding: '0.3rem 0.5rem', fontSize: '0.75rem' }}
                value={startMonth}
                onChange={(e) => setStartMonth(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <span>To Period:</span>
              <input
                type="month"
                className="form-input"
                style={{ width: '150px', padding: '0.3rem 0.5rem', fontSize: '0.75rem' }}
                value={endMonth}
                onChange={(e) => setEndMonth(e.target.value)}
              />
            </div>

            {(startMonth || endMonth) && (
              <button
                className="btn-icon"
                onClick={() => {
                  setStartMonth('');
                  setEndMonth('');
                }}
                title="Clear Custom Range"
                style={{ color: 'var(--rose-600)' }}
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Aggregate KPI Cards */}
      <div className="kpi-grid">
        <StatCard
          title="Period Gross Revenue"
          value={totalRevenue}
          icon={DollarSign}
          isCurrency={true}
          currencySymbol={currencySymbol}
          iconColor="#4f46e5"
        />
        <StatCard
          title="Cost of Goods (COGS)"
          value={totalCost}
          icon={Receipt}
          isCurrency={true}
          currencySymbol={currencySymbol}
          iconColor="#f59e0b"
          iconBg="rgba(245, 158, 11, 0.1)"
        />
        <StatCard
          title="Operating Expenses"
          value={totalExpenses}
          icon={Receipt}
          isCurrency={true}
          currencySymbol={currencySymbol}
          iconColor="#e11d48"
          iconBg="rgba(225, 29, 72, 0.1)"
        />
        <StatCard
          title="Period Net Profit"
          value={totalProfit}
          icon={TrendingUp}
          isCurrency={true}
          currencySymbol={currencySymbol}
          iconColor="#10b981"
          iconBg="rgba(16, 185, 129, 0.1)"
        />
      </div>

      {/* Multi-Period Comparison Chart */}
      <div className="chart-card" style={{ marginBottom: '1.75rem' }}>
        <div className="card-header-row">
          <div className="card-title-group">
            <h3>Revenue vs Expense Distribution</h3>
            <p className="card-subtitle">Financial performance trajectory across selected timeframe</p>
          </div>
        </div>

        <div className="chart-container-box" style={{ height: '320px' }}>
          {chartData.length === 0 ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
              No records found for this custom date range
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} />
                <YAxis
                  stroke="var(--text-muted)"
                  fontSize={12}
                  tickLine={false}
                  tickFormatter={(val) => `${currencySymbol}${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
                />
                <Tooltip
                  formatter={(value) => [formatCurrency(value, currencySymbol), '']}
                />
                <Legend wrapperStyle={{ paddingTop: '10px' }} />
                <Bar dataKey="Revenue" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                <Bar dataKey="COGS" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Expenses" fill="#e11d48" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Profit" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Monthly Financial Breakdown Statement Table */}
      <div className="table-card">
        <div className="card-header-row">
          <div className="card-title-group">
            <h3>Profit & Loss Statement Breakdown</h3>
            <p className="card-subtitle">Historical performance audit ledger</p>
          </div>
        </div>

        <div className="table-responsive-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Period</th>
                <th>Gross Revenue</th>
                <th>Product Cost (COGS)</th>
                <th>Operating Expenses</th>
                <th>Net Profit</th>
                <th>Margin (%)</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {records.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                    No financial statements in this custom range
                  </td>
                </tr>
              ) : (
                records.map((r) => {
                  const exps = (r.expenses || []).reduce((s, e) => s + (Number(e.amount) || 0), 0);
                  const prof = (r.revenue || 0) - (r.productCost || 0) - exps;
                  const mrg = r.revenue > 0 ? (prof / r.revenue) * 100 : 0;
                  return (
                    <tr key={r.month}>
                      <td>
                        <strong>{formatMonthYear(r.month)}</strong>
                      </td>
                      <td>
                        <span style={{ fontWeight: 600, color: 'var(--brand-600)' }}>
                          {formatCurrency(r.revenue, currencySymbol)}
                        </span>
                      </td>
                      <td>
                        <span style={{ color: 'var(--amber-600)' }}>
                          -{formatCurrency(r.productCost, currencySymbol)}
                        </span>
                      </td>
                      <td>
                        <span style={{ color: 'var(--rose-600)' }}>
                          -{formatCurrency(exps, currencySymbol)}
                        </span>
                      </td>
                      <td>
                        <strong style={{ color: prof >= 0 ? 'var(--emerald-600)' : 'var(--rose-600)' }}>
                          {formatCurrency(prof, currencySymbol)}
                        </strong>
                      </td>
                      <td>
                        <span style={{ fontWeight: 700 }}>
                          {mrg.toFixed(1)}%
                        </span>
                      </td>
                      <td>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '0.2rem 0.5rem',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            backgroundColor: mrg >= 25 ? 'var(--emerald-50)' : 'var(--amber-50)',
                            color: mrg >= 25 ? 'var(--emerald-600)' : 'var(--amber-600)',
                          }}
                        >
                          {mrg >= 25 ? 'Target Achieved' : 'Operational'}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ReportsPage;
