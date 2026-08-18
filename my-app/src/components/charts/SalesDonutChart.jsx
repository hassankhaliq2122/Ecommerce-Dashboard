import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

const STATUS_COLORS = {
  Completed: '#10b981',
  Processing: '#3b82f6',
  Pending: '#f59e0b',
  Cancelled: '#ef4444',
  Refunded: '#64748b',
};

function SalesDonutChart({ orders = [] }) {
  // Aggregate count by status
  const counts = orders.reduce((acc, order) => {
    const st = order.status || 'Pending';
    acc[st] = (acc[st] || 0) + 1;
    return acc;
  }, {});

  const data = Object.entries(counts).map(([name, value]) => ({
    name,
    value,
  }));

  const totalOrders = orders.length;

  return (
    <div className="chart-card">
      <div className="card-header-row">
        <div className="card-title-group">
          <h3>Order Status Distribution</h3>
          <p className="card-subtitle">Fulfillment breakdown for this month</p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '240px' }}>
        {data.length === 0 ? (
          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No orders data</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                innerRadius={60}
                outerRadius={85}
                paddingAngle={4}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={STATUS_COLORS[entry.name] || '#6366f1'}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => [
                  `${value} orders (${((value / totalOrders) * 100).toFixed(0)}%)`,
                  name,
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center', marginTop: '0.5rem' }}>
        {data.map((entry) => (
          <div key={entry.name} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem' }}>
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: STATUS_COLORS[entry.name] || '#6366f1',
              }}
            />
            <span style={{ color: 'var(--text-secondary)' }}>{entry.name}:</span>
            <strong style={{ color: 'var(--text-primary)' }}>{entry.value}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SalesDonutChart;
