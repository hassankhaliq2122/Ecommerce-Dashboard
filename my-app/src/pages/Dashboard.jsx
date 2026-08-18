import React, { useState } from 'react';
import StatCard from '../components/StatCard';
import MonthSelector from '../components/MonthSelector';
import AddDateRangeModal from '../components/AddDateRangeModal';
import RevenueForm from '../components/RevenueForm';
import ProductCostForm from '../components/ProductCostForm';
import ExpenseForm from '../components/ExpenseForm';
import EditExpenseForm from '../components/EditExpenseForm';
import ExpenseList from '../components/ExpenseList';
import SearchExpenses from '../components/SearchExpense';
import RevenueChart from '../components/charts/RevenueChart';
import ProfitChart from '../components/charts/ProfitChart';
import SalesDonutChart from '../components/charts/SalesDonutChart';
import FinancialSummaryCard from '../components/financial/FinancialSummaryCard';
import RecentOrders from '../components/orders/RecentOrders';
import TopProducts from '../components/products/TopProducts';

import {
  DollarSign,
  ShoppingCart,
  TrendingUp,
  Receipt,
  Percent,
  Wallet,
  Calendar,
  X,
} from 'lucide-react';
import { calculatePercentageChange, formatCurrency } from '../utils/formatters';

function Dashboard({
  monthlyRecords = [],
  selectedMonth,
  setSelectedMonth,
  onAddExpense,
  onDeleteExpense,
  onUpdateExpense,
  onUpdateRevenue,
  onUpdateCost,
  onUpdateOrderStatus,
  onSaveDateRange,
  onDeleteDateRange,
  products = [],
  currencySymbol = '$',
}) {
  const [editingExpense, setEditingExpense] = useState(null);
  const [searchText, setSearchText] = useState('');
  
  // Custom Date Range Modal State
  const [isAddDateRangeOpen, setIsAddDateRangeOpen] = useState(false);
  const [editingDateRangeRecord, setEditingDateRangeRecord] = useState(null);
  const [filterMode, setFilterMode] = useState('month');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  // Fallback safe record if month is missing or empty
  const defaultRecord = {
    month: selectedMonth || '2026-08',
    revenue: 0,
    revenueTarget: 30000,
    productCost: 0,
    expenses: [],
    orders: [],
    ordersCount: 0,
    conversionRate: 3.5,
  };

  const selectedRecord =
    monthlyRecords.find((rec) => rec.month === selectedMonth) || defaultRecord;

  // Monthly mode calculations
  const currentIndex = monthlyRecords.findIndex((rec) => rec.month === selectedMonth);
  const previousRecord = currentIndex > 0 ? monthlyRecords[currentIndex - 1] : null;

  // Compute metrics based on filterMode
  let expensesList = [];
  let ordersList = [];
  let revenue = 0;
  let productCost = 0;
  let totalOrders = 0;

  if (filterMode === 'month') {
    expensesList = selectedRecord.expenses || [];
    ordersList = selectedRecord.orders || [];
    revenue = Number(selectedRecord.revenue) || 0;
    productCost = Number(selectedRecord.productCost) || 0;
    totalOrders = selectedRecord.ordersCount || ordersList.length || 0;
  } else {
    // Custom Date Range aggregation across all records
    const allExpenses = monthlyRecords.flatMap((r) => r.expenses || []);
    const allOrders = monthlyRecords.flatMap((r) => r.orders || []);

    expensesList = allExpenses.filter((exp) => {
      if (customStartDate && exp.date && exp.date < customStartDate) return false;
      if (customEndDate && exp.date && exp.date > customEndDate) return false;
      return true;
    });

    ordersList = allOrders.filter((ord) => {
      if (customStartDate && ord.date && ord.date < customStartDate) return false;
      if (customEndDate && ord.date && ord.date > customEndDate) return false;
      return true;
    });

    // Compute revenue from orders or records in custom range
    const matchingRecords = monthlyRecords.filter((r) => {
      const monthStart = `${r.month}-01`;
      const monthEnd = `${r.month}-31`;
      if (customStartDate && monthEnd < customStartDate) return false;
      if (customEndDate && monthStart > customEndDate) return false;
      return true;
    });

    const ordersRevenue = ordersList.reduce((sum, o) => sum + (o.status !== 'Cancelled' && o.status !== 'Refunded' ? o.amount : 0), 0);
    revenue = ordersRevenue > 0 ? ordersRevenue : matchingRecords.reduce((sum, r) => sum + (r.revenue || 0), 0);
    productCost = matchingRecords.reduce((sum, r) => sum + (r.productCost || 0), 0);
    totalOrders = ordersList.length;
  }

  const totalExpenses = expensesList.reduce((acc, exp) => acc + (Number(exp.amount) || 0), 0);
  const profit = revenue - productCost - totalExpenses;

  // Previous comparisons
  const prevExpensesList = previousRecord ? previousRecord.expenses || [] : [];
  const prevTotalExpenses = prevExpensesList.reduce((acc, exp) => acc + (Number(exp.amount) || 0), 0);
  const prevRevenue = previousRecord ? Number(previousRecord.revenue) || 0 : 0;
  const prevProductCost = previousRecord ? Number(previousRecord.productCost) || 0 : 0;
  const prevProfit = prevRevenue - prevProductCost - prevTotalExpenses;
  const prevTotalOrders = previousRecord ? previousRecord.ordersCount || (previousRecord.orders || []).length : 0;

  const averageOrderValue = totalOrders > 0 ? revenue / totalOrders : 0;
  const prevAov = prevTotalOrders > 0 ? prevRevenue / prevTotalOrders : 0;

  const profitMargin = revenue > 0 ? (profit / revenue) * 100 : 0;
  const prevProfitMargin = prevRevenue > 0 ? (prevProfit / prevRevenue) * 100 : 0;

  // Trends
  const revenueTrend = calculatePercentageChange(revenue, prevRevenue);
  const profitTrend = calculatePercentageChange(profit, prevProfit);
  const expensesTrend = calculatePercentageChange(totalExpenses, prevTotalExpenses);
  const ordersTrend = calculatePercentageChange(totalOrders, prevTotalOrders);
  const aovTrend = calculatePercentageChange(averageOrderValue, prevAov);

  // Search filtering on active expenses list
  const filteredExpenses = expensesList.filter((expense) => {
    const query = (searchText || '').toLowerCase();
    const nameMatch = (expense.name || '').toLowerCase().includes(query);
    const categoryMatch = (expense.category || '').toLowerCase().includes(query);
    return nameMatch || categoryMatch;
  });

  const availableMonths = monthlyRecords.map((r) => r.month);

  return (
    <div>
      {/* Header with Greeting & Custom Date / Month Selector */}
      <div className="dashboard-header">
        <div>
          <h2 className="welcome-title">Good morning, Admin</h2>
          <p className="welcome-subtitle">
            {filterMode === 'custom' && (customStartDate || customEndDate)
              ? `Showing metrics for custom range: ${customStartDate || 'Start'} to ${customEndDate || 'Present'}`
              : "Here's what's happening with your store today."}
          </p>
        </div>

        <div className="header-controls" style={{ width: '100%' }}>
          <MonthSelector
            selectedMonth={selectedMonth}
            onMonthChange={setSelectedMonth}
            monthlyRecords={monthlyRecords}
            onOpenAddModal={() => {
              setEditingDateRangeRecord(null);
              setIsAddDateRangeOpen(true);
            }}
            onOpenEditModal={(rec) => {
              setEditingDateRangeRecord(rec);
              setIsAddDateRangeOpen(true);
            }}
            onDeleteRecord={onDeleteDateRange}
            currencySymbol={currencySymbol}
          />
        </div>
      </div>

      {/* 6 Premium KPI Stat Cards */}
      <div className="kpi-grid">
        <StatCard
          title="Total Revenue"
          value={revenue}
          icon={DollarSign}
          trend={filterMode === 'month' && previousRecord ? revenueTrend : undefined}
          isCurrency={true}
          currencySymbol={currencySymbol}
          iconBg="rgba(79, 70, 229, 0.1)"
          iconColor="#4f46e5"
        />

        <StatCard
          title="Total Orders"
          value={totalOrders}
          icon={ShoppingCart}
          trend={filterMode === 'month' && previousRecord ? ordersTrend : undefined}
          isCurrency={false}
          iconBg="rgba(59, 130, 246, 0.1)"
          iconColor="#3b82f6"
        />

        <StatCard
          title="Net Profit"
          value={profit}
          icon={TrendingUp}
          trend={filterMode === 'month' && previousRecord ? profitTrend : undefined}
          isCurrency={true}
          currencySymbol={currencySymbol}
          iconBg="rgba(16, 185, 129, 0.1)"
          iconColor="#10b981"
        />

        <StatCard
          title="Total Expenses"
          value={totalExpenses}
          icon={Receipt}
          trend={filterMode === 'month' && previousRecord ? expensesTrend : undefined}
          isCurrency={true}
          currencySymbol={currencySymbol}
          iconBg="rgba(225, 29, 72, 0.1)"
          iconColor="#e11d48"
        />

        <StatCard
          title="Avg. Order Value"
          value={averageOrderValue}
          icon={Wallet}
          trend={filterMode === 'month' && previousRecord ? aovTrend : undefined}
          isCurrency={true}
          currencySymbol={currencySymbol}
          iconBg="rgba(245, 158, 11, 0.1)"
          iconColor="#f59e0b"
        />

        <StatCard
          title="Net Profit Margin"
          value={`${profitMargin.toFixed(1)}%`}
          icon={Percent}
          trend={filterMode === 'month' && previousRecord ? profitMargin - prevProfitMargin : undefined}
          isCurrency={false}
          iconBg="rgba(14, 165, 233, 0.1)"
          iconColor="#0ea5e9"
        />
      </div>

      {/* Revenue and Profit Charts */}
      <div className="charts-grid-equal">
        <RevenueChart records={monthlyRecords} currencySymbol={currencySymbol} />
        <ProfitChart records={monthlyRecords} currencySymbol={currencySymbol} />
      </div>

      {/* Financial Statement & Order Status Donut */}
      <div className="charts-grid">
        <FinancialSummaryCard
          revenue={revenue}
          productCost={productCost}
          totalExpenses={totalExpenses}
          currencySymbol={currencySymbol}
        />
        <SalesDonutChart orders={ordersList} />
      </div>

      {/* Financial Management Forms */}
      <div className="management-grid">
        <RevenueForm
          currentRevenue={revenue}
          targetRevenue={selectedRecord.revenueTarget || 30000}
          onUpdateRevenue={onUpdateRevenue}
          currencySymbol={currencySymbol}
        />
        <ProductCostForm
          currentCost={productCost}
          revenue={revenue}
          onUpdateCost={onUpdateCost}
          currencySymbol={currencySymbol}
        />
        <ExpenseForm
          onAddExpense={onAddExpense}
          currencySymbol={currencySymbol}
        />
      </div>

      {/* Search and Expense List */}
      <div style={{ marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Expense Items</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Manage and search operating expenses
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <SearchExpenses
              searchText={searchText}
              onSearchChange={setSearchText}
            />
          </div>
        </div>

        <ExpenseList
          expenses={filteredExpenses}
          onDeleteExpense={onDeleteExpense}
          onEditExpense={(id) => {
            const exp = expensesList.find((e) => e.id === id);
            setEditingExpense(exp);
          }}
          currencySymbol={currencySymbol}
        />
      </div>

      {/* Recent Orders & Top Products */}
      <RecentOrders
        orders={ordersList}
        currencySymbol={currencySymbol}
        onUpdateOrderStatus={onUpdateOrderStatus}
      />

      <TopProducts
        products={products}
        currencySymbol={currencySymbol}
      />

      {/* Edit Expense Modal */}
      <EditExpenseForm
        expense={editingExpense}
        onUpdateExpense={(updated) => {
          onUpdateExpense(updated);
          setEditingExpense(null);
        }}
        onCancel={() => setEditingExpense(null)}
        currencySymbol={currencySymbol}
      />

      {/* Add / Edit Custom Date Range Modal */}
      <AddDateRangeModal
        isOpen={isAddDateRangeOpen}
        onClose={() => {
          setIsAddDateRangeOpen(false);
          setEditingDateRangeRecord(null);
        }}
        onSave={onSaveDateRange}
        onDelete={onDeleteDateRange}
        initialRecord={editingDateRangeRecord}
        currencySymbol={currencySymbol}
      />
    </div>
  );
}

export default Dashboard;
