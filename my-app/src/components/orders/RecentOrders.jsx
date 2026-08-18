import React, { useState } from 'react';
import OrderStatusBadge from './OrderStatusBadge';
import OrderDetailsModal from './OrderDetailsModal';
import EmptyState from '../ui/EmptyState';
import { formatCurrency } from '../../utils/formatters';
import { ShoppingBag, Eye, Calendar, X } from 'lucide-react';

function RecentOrders({ orders = [], currencySymbol = '$', onUpdateOrderStatus }) {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const filteredOrders = orders.filter((ord) => {
    if (filterStatus !== 'All' && ord.status.toLowerCase() !== filterStatus.toLowerCase()) {
      return false;
    }
    if (startDate && ord.date && ord.date < startDate) return false;
    if (endDate && ord.date && ord.date > endDate) return false;
    return true;
  });

  return (
    <div className="table-card">
      <div className="card-header-row">
        <div className="card-title-group">
          <h3>Recent Orders</h3>
          <p className="card-subtitle">Real-time customer transactions and fulfillment status</p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Custom Date Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <Calendar size={14} color="var(--brand-500)" />
            <input
              type="date"
              className="form-input"
              style={{ width: '125px', padding: '0.35rem 0.5rem', fontSize: '0.75rem' }}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder="From"
            />
            <span>-</span>
            <input
              type="date"
              className="form-input"
              style={{ width: '125px', padding: '0.35rem 0.5rem', fontSize: '0.75rem' }}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder="To"
            />
            {(startDate || endDate) && (
              <button
                className="btn-icon"
                onClick={() => {
                  setStartDate('');
                  setEndDate('');
                }}
                title="Clear Date Filter"
                style={{ color: 'var(--rose-600)' }}
              >
                <X size={14} />
              </button>
            )}
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="form-input"
            style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', width: 'auto' }}
          >
            <option value="All">All Statuses</option>
            <option value="Completed">Completed</option>
            <option value="Processing">Processing</option>
            <option value="Pending">Pending</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Refunded">Refunded</option>
          </select>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="No orders found"
          description="There are no recent orders matching your current status and date filters."
          actionLabel={startDate || endDate || filterStatus !== 'All' ? 'Reset Filters' : undefined}
          onAction={() => {
            setStartDate('');
            setEndDate('');
            setFilterStatus('All');
          }}
        />
      ) : (
        <div className="table-responsive-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Product</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td>
                    <span style={{ fontWeight: 700, color: 'var(--brand-600)' }}>
                      {order.id}
                    </span>
                  </td>
                  <td>
                    <div>
                      <div style={{ fontWeight: 600 }}>{order.customer}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {order.email}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span style={{ color: 'var(--text-secondary)' }}>
                      {order.product}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                      {formatCurrency(order.amount, currencySymbol)}
                    </span>
                  </td>
                  <td>
                    <OrderStatusBadge status={order.status} />
                  </td>
                  <td>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {order.date}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      className="btn-icon"
                      title="View Details"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <Eye size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          isOpen={Boolean(selectedOrder)}
          onClose={() => setSelectedOrder(null)}
          currencySymbol={currencySymbol}
          onUpdateStatus={(orderId, newStatus) => {
            if (onUpdateOrderStatus) {
              onUpdateOrderStatus(orderId, newStatus);
            }
            setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
          }}
        />
      )}
    </div>
  );
}

export default RecentOrders;
