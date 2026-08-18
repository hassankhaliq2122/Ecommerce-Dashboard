import React, { useState } from 'react';
import StatCard from '../components/StatCard';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';
import { formatCurrency, formatNumber } from '../utils/formatters';
import {
  Users,
  UserPlus,
  UserCheck,
  CreditCard,
  Search,
  Mail,
  MapPin,
  Calendar,
  X,
  Filter,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

function CustomersPage({ customers = [], currencySymbol = '$' }) {
  const [activeType, setActiveType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilterPreset, setDateFilterPreset] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Handle Preset change
  const handlePresetChange = (preset) => {
    setDateFilterPreset(preset);
    const now = new Date();
    const formatDate = (d) => d.toISOString().split('T')[0];

    if (preset === 'all') {
      setStartDate('');
      setEndDate('');
    } else if (preset === '30days') {
      const past = new Date();
      past.setDate(now.getDate() - 30);
      setStartDate(formatDate(past));
      setEndDate(formatDate(now));
    } else if (preset === '90days') {
      const past = new Date();
      past.setDate(now.getDate() - 90);
      setStartDate(formatDate(past));
      setEndDate(formatDate(now));
    } else if (preset === 'thisYear') {
      const start = new Date(now.getFullYear(), 0, 1);
      setStartDate(formatDate(start));
      setEndDate(formatDate(now));
    }
  };

  const filteredCustomers = customers.filter((cust) => {
    // Type filter
    if (activeType !== 'All') {
      if (activeType === 'VIP' && cust.status !== 'VIP') return false;
      if (activeType !== 'VIP' && cust.type !== activeType) return false;
    }

    // Custom Date Range filter on joinDate
    if (startDate && cust.joinDate) {
      if (cust.joinDate < startDate) return false;
    }
    if (endDate && cust.joinDate) {
      if (cust.joinDate > endDate) return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        cust.name.toLowerCase().includes(q) ||
        cust.email.toLowerCase().includes(q) ||
        (cust.location && cust.location.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const totalCustomers = filteredCustomers.length;
  const newCustomers = filteredCustomers.filter((c) => c.type === 'New').length;
  const returningCustomers = filteredCustomers.filter((c) => c.type === 'Returning').length;
  const totalSpend = filteredCustomers.reduce((sum, c) => sum + (c.totalSpend || 0), 0);
  const avgCustomerValue = totalCustomers > 0 ? totalSpend / totalCustomers : 0;

  const chartData = filteredCustomers.map((c) => ({
    name: c.name.split(' ')[0],
    spend: c.totalSpend || 0,
    orders: c.ordersCount || 0,
  }));

  const clearDateFilter = () => {
    setDateFilterPreset('all');
    setStartDate('');
    setEndDate('');
  };

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <h2 className="welcome-title">Customer Analytics & Directory</h2>
          <p className="welcome-subtitle">
            Customer lifetime value, cohort retention, and registration date filters
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <StatCard
          title="Total Customers"
          value={totalCustomers}
          icon={Users}
          isCurrency={false}
          iconColor="#4f46e5"
        />
        <StatCard
          title="New Acquisition"
          value={newCustomers}
          icon={UserPlus}
          isCurrency={false}
          iconColor="#10b981"
          iconBg="rgba(16, 185, 129, 0.1)"
        />
        <StatCard
          title="Returning Buyers"
          value={returningCustomers}
          icon={UserCheck}
          isCurrency={false}
          iconColor="#3b82f6"
          iconBg="rgba(59, 130, 246, 0.1)"
        />
        <StatCard
          title="Avg. Customer Value (LTV)"
          value={avgCustomerValue}
          icon={CreditCard}
          isCurrency={true}
          currencySymbol={currencySymbol}
          iconColor="#f59e0b"
          iconBg="rgba(245, 158, 11, 0.1)"
        />
      </div>

      {/* Date Filter & Toolbar Bar */}
      <div className="table-card" style={{ padding: '1rem 1.25rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Calendar size={15} color="var(--brand-500)" />
                Join Date:
              </span>
              <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                {[
                  { id: 'all', label: 'All Time' },
                  { id: '30days', label: 'Last 30 Days' },
                  { id: '90days', label: 'Last 90 Days' },
                  { id: 'thisYear', label: 'This Year' },
                  { id: 'custom', label: 'Custom Range' },
                ].map((preset) => (
                  <button
                    key={preset.id}
                    className={dateFilterPreset === preset.id ? 'btn-primary' : 'btn-secondary'}
                    style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem' }}
                    onClick={() => handlePresetChange(preset.id)}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Date Inputs */}
            {(dateFilterPreset === 'custom' || startDate || endDate) && (
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
                      setDateFilterPreset('custom');
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
                      setDateFilterPreset('custom');
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
      </div>

      {/* Spend Distribution Chart */}
      {chartData.length > 0 && (
        <div className="chart-card" style={{ marginBottom: '1.75rem' }}>
          <div className="card-header-row">
            <div className="card-title-group">
              <h3>Top Customer Spend Distribution</h3>
              <p className="card-subtitle">Lifetime gross merchandise value by account</p>
            </div>
          </div>
          <div className="chart-container-box">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} />
                <YAxis
                  stroke="var(--text-muted)"
                  fontSize={12}
                  tickLine={false}
                  tickFormatter={(val) => `${currencySymbol}${val}`}
                />
                <Tooltip
                  formatter={(val) => [formatCurrency(val, currencySymbol), 'Total Spend']}
                />
                <Bar dataKey="spend" fill="#4f46e5" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Customers Table */}
      <div className="table-card">
        <div className="table-toolbar">
          <div style={{ display: 'flex', gap: '0.35rem' }}>
            {['All', 'Returning', 'New', 'VIP'].map((type) => (
              <button
                key={type}
                className={activeType === type ? 'btn-primary' : 'btn-secondary'}
                style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
                onClick={() => setActiveType(type)}
              >
                {type}
              </button>
            ))}
          </div>

          <div style={{ position: 'relative', width: '260px' }}>
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
              placeholder="Search customer name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {filteredCustomers.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No customers found"
            description="No customer records match your selected date range or filter criteria."
            actionLabel={startDate || endDate || searchQuery ? 'Clear Filters' : undefined}
            onAction={clearDateFilter}
          />
        ) : (
          <div className="table-responsive-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Customer Profile</th>
                  <th>Location</th>
                  <th>Status / Tier</th>
                  <th>Orders Placed</th>
                  <th>Lifetime Spend</th>
                  <th>Member Since</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <img
                          src={c.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80'}
                          alt={c.name}
                          style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                          }}
                        />
                        <div>
                          <div style={{ fontWeight: 600 }}>{c.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <Mail size={12} /> {c.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                        <MapPin size={13} color="var(--text-muted)" />
                        {c.location || 'United States'}
                      </div>
                    </td>
                    <td>
                      <Badge variant={c.status === 'VIP' ? 'warning' : c.type === 'New' ? 'info' : 'success'}>
                        {c.status === 'VIP' ? 'VIP Client' : c.type === 'New' ? 'New Customer' : 'Returning'}
                      </Badge>
                    </td>
                    <td>
                      <span style={{ fontWeight: 600 }}>{c.ordersCount} orders</span>
                    </td>
                    <td>
                      <strong style={{ color: 'var(--emerald-600)' }}>
                        {formatCurrency(c.totalSpend, currencySymbol)}
                      </strong>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {c.joinDate}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default CustomersPage;
