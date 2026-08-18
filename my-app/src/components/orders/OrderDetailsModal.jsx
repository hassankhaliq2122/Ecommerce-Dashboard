import React from 'react';
import Modal from '../ui/Modal';
import OrderStatusBadge from './OrderStatusBadge';
import { formatCurrency } from '../../utils/formatters';
import { Package, User, CreditCard, Calendar, ShoppingBag } from 'lucide-react';

function OrderDetailsModal({ order, isOpen, onClose, currencySymbol = '$', onUpdateStatus }) {
  if (!order) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Order Details: ${order.id}`}
      footer={
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Change Status:</span>
            <select
              value={order.status}
              onChange={(e) => onUpdateStatus && onUpdateStatus(order.id, e.target.value)}
              className="form-input"
              style={{ padding: '0.35rem 0.6rem', fontSize: '0.8rem', width: 'auto' }}
            >
              <option value="Completed">Completed</option>
              <option value="Processing">Processing</option>
              <option value="Pending">Pending</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Refunded">Refunded</option>
            </select>
          </div>
          <button className="btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Order Total</span>
            <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {formatCurrency(order.amount, currencySymbol)}
            </span>
          </div>
          <OrderStatusBadge status={order.status} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <User size={18} color="var(--brand-500)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Customer</span>
              <strong style={{ fontSize: '0.875rem' }}>{order.customer}</strong>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{order.email || 'customer@example.com'}</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <Calendar size={18} color="var(--brand-500)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Order Date</span>
              <strong style={{ fontSize: '0.875rem' }}>{order.date}</strong>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <ShoppingBag size={18} color="var(--brand-500)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Product</span>
              <strong style={{ fontSize: '0.875rem' }}>{order.product}</strong>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <CreditCard size={18} color="var(--brand-500)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Payment Method</span>
              <strong style={{ fontSize: '0.875rem' }}>{order.paymentMethod || 'Credit Card'}</strong>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default OrderDetailsModal;
