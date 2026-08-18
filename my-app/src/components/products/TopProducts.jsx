import React from 'react';
import { formatCurrency, formatNumber } from '../../utils/formatters';
import Badge from '../ui/Badge';
import { Star, TrendingUp, Package } from 'lucide-react';

function TopProducts({ products = [], currencySymbol = '$' }) {
  // Sort products by revenue descending
  const sorted = [...products].sort((a, b) => (b.revenue || 0) - (a.revenue || 0)).slice(0, 5);

  return (
    <div className="table-card">
      <div className="card-header-row">
        <div className="card-title-group">
          <h3>Top Performing Products</h3>
          <p className="card-subtitle">Highest grossing inventory items this period</p>
        </div>
      </div>

      <div className="table-responsive-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Units Sold</th>
              <th>Total Revenue</th>
              <th>Rating</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((prod) => (
              <tr key={prod.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <img
                      src={prod.image}
                      alt={prod.name}
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: 'var(--radius-sm)',
                        objectFit: 'cover',
                        backgroundColor: 'var(--bg-subtle)',
                        flexShrink: 0,
                      }}
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&auto=format&fit=crop&q=80';
                      }}
                    />
                    <div>
                      <div style={{ fontWeight: 600 }}>{prod.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{prod.sku}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <Badge variant="neutral">{prod.category}</Badge>
                </td>
                <td>
                  <span style={{ fontWeight: 600 }}>{formatCurrency(prod.price, currencySymbol)}</span>
                </td>
                <td>
                  <span
                    style={{
                      fontWeight: 600,
                      color: prod.stock <= 30 ? 'var(--amber-600)' : 'var(--text-secondary)',
                    }}
                  >
                    {prod.stock} left
                  </span>
                </td>
                <td>
                  <span style={{ fontWeight: 600 }}>{formatNumber(prod.ordersCount)}</span>
                </td>
                <td>
                  <span style={{ fontWeight: 700, color: 'var(--emerald-600)' }}>
                    {formatCurrency(prod.revenue || prod.price * prod.ordersCount, currencySymbol)}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#f59e0b', fontWeight: 600 }}>
                    <Star size={13} fill="#f59e0b" color="#f59e0b" />
                    <span>{prod.rating}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TopProducts;
