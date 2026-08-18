import React from 'react';
import Badge from '../ui/Badge';
import { formatCurrency, formatNumber } from '../../utils/formatters';
import { Star, Package, ShoppingCart } from 'lucide-react';

function ProductCard({ product, currencySymbol = '$', onQuickAction }) {
  const isLowStock = product.stock <= 30;
  const isOutOfStock = product.stock === 0;

  let stockBadge = <Badge variant="success">In Stock ({product.stock})</Badge>;
  if (isOutOfStock) {
    stockBadge = <Badge variant="danger">Out of Stock</Badge>;
  } else if (isLowStock) {
    stockBadge = <Badge variant="warning">Low Stock ({product.stock})</Badge>;
  }

  return (
    <div className="product-card">
      <div className="product-image-container">
        <img
          src={product.image}
          alt={product.name}
          className="product-image"
          loading="lazy"
          onError={(e) => {
            // Fallback image if network fails
            e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&auto=format&fit=crop&q=80';
          }}
        />
        <div className="product-badge-float">
          {stockBadge}
        </div>
      </div>

      <div className="product-content">
        <div className="product-meta">
          <span>{product.category}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#f59e0b' }}>
            <Star size={13} fill="#f59e0b" color="#f59e0b" />
            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{product.rating}</span>
          </div>
        </div>

        <h4 className="product-title">{product.name}</h4>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
          SKU: {product.sku || 'SKU-GEN-01'}
        </div>

        <div className="product-metrics-row">
          <div>
            <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', display: 'block' }}>Revenue</span>
            <strong style={{ fontSize: '0.9rem', color: 'var(--brand-600)' }}>
              {formatCurrency(product.revenue || product.price * product.ordersCount, currencySymbol)}
            </strong>
          </div>
          <div>
            <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', display: 'block' }}>Sales</span>
            <strong style={{ fontSize: '0.9rem' }}>{formatNumber(product.ordersCount)} units</strong>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', display: 'block' }}>Price</span>
            <span className="product-price">{formatCurrency(product.price, currencySymbol)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
