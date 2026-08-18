import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
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

function ProfitChart({ records = [], currencySymbol = '$' }) {
  const chartData = records.map((rec) => {
    const totalExp = (rec.expenses || []).reduce((acc, exp) => acc + (Number(exp.amount) || 0), 0);
    const netProfit = (rec.revenue || 0) - (rec.productCost || 0) - totalExp;
    return {
      name: rec.label || formatShortMonth(rec.month) || rec.month,
      month: rec.month,
      Profit: netProfit,
      Revenue: rec.revenue || 0,
      ProductCost: rec.productCost || 0,
      Expenses: totalExp,
    };
  });

  return (
    <div className="chart-card">
      <div className="card-header-row">
        <div className="card-title-group">
          <h3>Net Profit Analytics</h3>
          <p className="card-subtitle">Bottom line earnings after COGS and operating expenses</p>
        </div>
      </div>

      <div className="chart-container-box">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
            </defs>
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
            <Area
              type="monotone"
              dataKey="Profit"
              stroke="#10b981"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#profitGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default ProfitChart;
