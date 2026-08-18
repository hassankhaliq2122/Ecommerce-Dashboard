import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { formatCurrency, formatShortMonth } from '../../utils/formatters';

const CustomTooltip = ({ active, payload, label, currencySymbol }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-chart-tooltip">
        <div className="tooltip-title">{label}</div>
        {payload.map((entry, index) => (
          <div key={`item-${index}`} className="tooltip-row">
            <span style={{ color: entry.color, fontWeight: 600 }}>{entry.name}:</span>
            <span style={{ fontWeight: 700 }}>
              {formatCurrency(entry.value, currencySymbol)}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

function RevenueChart({ records = [], currencySymbol = '$' }) {
  // Transform monthly records into chart format
  const chartData = records.map((rec) => {
    const totalExp = (rec.expenses || []).reduce((acc, exp) => acc + (Number(exp.amount) || 0), 0);
    return {
      name: formatShortMonth(rec.month),
      month: rec.month,
      Revenue: rec.revenue || 0,
      Expenses: totalExp,
      ProductCost: rec.productCost || 0,
    };
  });

  return (
    <div className="chart-card">
      <div className="card-header-row">
        <div className="card-title-group">
          <h3>Revenue vs Expenses Trend</h3>
          <p className="card-subtitle">Monthly cash flow and operating overhead trajectory</p>
        </div>
      </div>

      <div className="chart-container-box">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
            <XAxis
              dataKey="name"
              stroke="var(--text-muted)"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: 'var(--border-color)' }}
            />
            <YAxis
              stroke="var(--text-muted)"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: 'var(--border-color)' }}
              tickFormatter={(val) => `${currencySymbol}${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
            />
            <Tooltip content={<CustomTooltip currencySymbol={currencySymbol} />} />
            <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '13px' }} />
            <Line
              type="monotone"
              dataKey="Revenue"
              stroke="#4f46e5"
              strokeWidth={3}
              dot={{ r: 4, fill: '#4f46e5', strokeWidth: 2, stroke: '#ffffff' }}
              activeDot={{ r: 6, fill: '#4f46e5' }}
            />
            <Line
              type="monotone"
              dataKey="Expenses"
              stroke="#e11d48"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={{ r: 3, fill: '#e11d48' }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default RevenueChart;
