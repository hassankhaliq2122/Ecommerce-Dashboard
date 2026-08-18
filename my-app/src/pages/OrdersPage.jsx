import React, { useState } from 'react';
import OrderStatusBadge from '../components/orders/OrderStatusBadge';
import OrderDetailsModal from '../components/orders/OrderDetailsModal';
import StatCard from '../components/StatCard';
import EmptyState from '../components/ui/EmptyState';
import { formatCurrency, formatNumber } from '../utils/formatters';
import {
  ShoppingCart,
  CheckCircle,
  Clock,
  Search,
  Eye,
  Download,
  Calendar,
  X,
  ShoppingBag,
} from 'lucide-react';

function OrdersPage({ monthlyRecords = [], selectedMonth, onUpdateOrderStatus, currencySymbol = '$' }) {
  // Aggregate all orders across records, defaulting to current month first
  const currentRecord = monthlyRecords.find((r) => r.month === selectedMonth) || monthlyRecords[monthlyRecords.length - 1] || {};
  const allOrders = currentRecord.orders || [];

  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [sortBy, setSortBy] = useState('date-desc');
  const [datePreset, setDatePreset] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleDatePresetChange = (preset) => {
    setDatePreset(preset);
    const now = new Date();
    const formatDate = (d) => d.toISOString().split('T')[0];

    if (preset === 'all') {
      setStartDate('');
      setEndDate('');
    } else if (preset === '7days') {
      const past = new Date();
      past.setDate(now.getDate() - 7);
      setStartDate(formatDate(past));
      setEndDate(formatDate(now));
    } else if (preset === '30days') {
      const past = new Date();
      past.setDate(now.getDate() - 30);
      setStartDate(formatDate(past));
      setEndDate(formatDate(now));
    } else if (preset === 'thisMonth') {
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      setStartDate(formatDate(start));
      setEndDate(formatDate(now));
    }
  };

  const clearDateFilter = () => {
    setDatePreset('all');
    setStartDate('');
    setEndDate('');
  };

  const filteredOrders = allOrders
    .filter((order) => {
      if (activeTab !== 'All' && order.status.toLowerCase() !== activeTab.toLowerCase()) {
        return false;
      }

      // Date range filter
      if (startDate && order.date && order.date < startDate) return false;
      if (endDate && order.date && order.date > endDate) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchId = order.id.toLowerCase().includes(q);
        const matchCustomer = order.customer.toLowerCase().includes(q);
        const matchProduct = order.product.toLowerCase().includes(q);
        return matchId || matchCustomer || matchProduct;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'amount-desc') return b.amount - a.amount;
      if (sortBy === 'amount-asc') return a.amount - b.amount;
      return new Date(b.date) - new Date(a.date);
    });

  const totalOrders = filteredOrders.length;
  const completedOrders = filteredOrders.filter((o) => o.status === 'Completed').length;
  const pendingOrders = filteredOrders.filter((o) => o.status === 'Pending' || o.status === 'Processing').length;
  const totalRevenue = filteredOrders.reduce((sum, o) => sum + (o.status !== 'Cancelled' && o.status !== 'Refunded' ? o.amount : 0), 0);

  const tabs = ['All', 'Completed', 'Processing', 'Pending', 'Cancelled', 'Refunded'];

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <h2 className="welcome-title">Orders Management</h2>
          <p className="welcome-subtitle">
            Track, filter, and manage store fulfillment and customer transactions
          </p>
        </div>

        <div className="header-controls">
          <button
            className="btn-secondary"
            onClick={() => alert('Exporting filtered orders CSV')}
          >
            <Download size={16} /> Export Orders
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        <StatCard
          title="Filtered Orders"
          value={totalOrders}
          icon={ShoppingCart}
          isCurrency={false}
          iconColor="#4f46e5"
        />
        <StatCard
          title="Completed"
          value={completedOrders}
          icon={CheckCircle}
          isCurrency={false}
          iconColor="#10b981"
          iconBg="rgba(16, 185, 129, 0.1)"
        />
        <StatCard
          title="Pending / Processing"
          value={pendingOrders}
          icon={Clock}
          isCurrency={false}
          iconColor="#f59e0b"
          iconBg="rgba(245, 158, 11, 0.1)"
        />
        <StatCard
          title="Net Order Revenue"
          value={totalRevenue}
          icon={ShoppingBag}
          isCurrency={true}
          currencySymbol={currencySymbol}
          iconColor="#0ea5e9"
          iconBg="rgba(14, 165, 233, 0.1)"
        />
      </div>

      {/* Date Filter Toolbar */}
      <div className="table-card" style={{ padding: '1rem 1.25rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Calendar size={15} color="var(--brand-500)" />
              Order Date:
            </span>
            <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
              {[
                { id: 'all', label: 'All Orders' },
                { id: '7days', label: 'Last 7 Days' },
                { id: '30days', label: 'Last 30 Days' },
                { id: 'thisMonth', label: 'This Month' },
                { id: 'custom', label: 'Custom Range' },
              ].map((preset) => (
                <button
                  key={preset.id}
                  className={datePreset === preset.id ? 'btn-primary' : 'btn-secondary'}
                  style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem' }}
                  onClick={() => handleDatePresetChange(preset.id)}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {(datePreset === 'custom' || startDate || endDate) && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <span>From:</span>
                <input
                  type="date"
                  className="form-input"
                  style={{ width: '135px', padding: '0.3rem 0.5rem', fontSize: '0.75rem' }}
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    setDatePreset('custom');
                  }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <span>To:</span>
                <input
                  type="date"
                  className="form-input"
                  style={{ width: '135px', padding: '0.3rem 0.5rem', fontSize: '0.75rem' }}
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    setDatePreset('custom');
                  }}
                />
              </div>

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
          )}
        </div>
      </div>

      {/* Orders Table Container */}
      <div className="table-card">
        {/* Tab filters and Search */}
        <div className="table-toolbar">
          <div style={{ display: 'flex', gap: '0.35rem', overflowX: 'auto', paddingBottom: '4px' }}>
            {tabs.map((tab) => (
              <button
                key={tab}
                className={activeTab === tab ? 'btn-primary' : 'btn-secondary'}
                style={{ fontSize: '0.8rem', padding: '0.4rem 0.85rem' }}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', width: '240px' }}>
              <Search
                size={14}
                style={{
                  position: 'absolute',
                  left: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                }}
              />
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: '2.2rem', fontSize: '0.8rem', padding: '0.4rem 0.6rem 0.4rem 2.2rem' }}
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="form-input"
              style={{ width: 'auto', fontSize: '0.8rem', padding: '0.4rem 0.6rem' }}
            >
              <option value="date-desc">Newest First</option>
              <option value="amount-desc">Highest Amount</option>
              <option value="amount-asc">Lowest Amount</option>
            </select>
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <EmptyState
            icon={ShoppingCart}
            title="No orders found"
            description="Try selecting a different status filter, date range, or clearing your search term."
            actionLabel={startDate || endDate || searchQuery || activeTab !== 'All' ? 'Reset Filters' : undefined}
            onAction={() => {
              clearDateFilter();
              setActiveTab('All');
              setSearchQuery('');
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
                  <th>Payment</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <strong style={{ color: 'var(--brand-600)' }}>{order.id}</strong>
                    </td>
                    <td>
                      <div>
                        <div style={{ fontWeight: 600 }}>{order.customer}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{order.email}</div>
                      </div>
                    </td>
                    <td>{order.product}</td>
                    <td>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        {order.paymentMethod || 'Credit Card'}
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
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{order.date}</span>
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
      </div>

      {/* Order Details Modal */}
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

export default OrdersPage;
