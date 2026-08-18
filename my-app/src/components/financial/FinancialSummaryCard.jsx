import React from 'react';
import { formatCurrency, formatPercent } from '../../utils/formatters';
import { DollarSign, Package, Receipt, TrendingUp, HelpCircle } from 'lucide-react';
import Badge from '../ui/Badge';

function FinancialSummaryCard({ revenue = 0, productCost = 0, totalExpenses = 0, currencySymbol = '$' }) {
  const profit = revenue - productCost - totalExpenses;
  const margin = revenue > 0 ? (profit / revenue) * 100 : 0;
  const costRatio = revenue > 0 ? (productCost / revenue) * 100 : 0;
  const expenseRatio = revenue > 0 ? (totalExpenses / revenue) * 100 : 0;

  return (
    <div className="financial-summary-card">
      <div className="card-header-row">
        <div className="card-title-group">
          <h3>Financial Breakdown</h3>
          <p className="card-subtitle">Monthly statement and profit margin analysis</p>
        </div>
        <Badge variant={margin >= 25 ? 'success' : margin >= 10 ? 'warning' : 'danger'}>
          {margin >= 25 ? 'Healthy Margin' : margin >= 10 ? 'Moderate' : 'Low Margin'}
        </Badge>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <div className="breakdown-row">
          <span className="breakdown-label">
            <DollarSign size={16} color="var(--brand-500)" />
            Gross Revenue
          </span>
          <span className="breakdown-value" style={{ color: 'var(--brand-600)' }}>
            {formatCurrency(revenue, currencySymbol)}
          </span>
        </div>

        <div className="breakdown-row">
          <span className="breakdown-label">
            <Package size={16} color="var(--amber-500)" />
            Product Cost (COGS)
          </span>
          <span className="breakdown-value subtraction">
            -{formatCurrency(productCost, currencySymbol)}
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '0.35rem' }}>
              ({costRatio.toFixed(1)}%)
            </span>
          </span>
        </div>

        <div className="breakdown-row">
          <span className="breakdown-label">
            <Receipt size={16} color="var(--rose-500)" />
            Operating Expenses (OpEx)
          </span>
          <span className="breakdown-value subtraction">
            -{formatCurrency(totalExpenses, currencySymbol)}
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '0.35rem' }}>
              ({expenseRatio.toFixed(1)}%)
            </span>
          </span>
        </div>

        <div className="breakdown-row" style={{ paddingTop: '0.85rem', marginTop: '0.25rem', borderTop: '2px solid var(--border-color)' }}>
          <span className="breakdown-label" style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
            <TrendingUp size={18} color="var(--emerald-600)" />
            Net Profit
          </span>
          <span className="breakdown-value total" style={{ color: profit >= 0 ? 'var(--emerald-600)' : 'var(--rose-600)' }}>
            {profit < 0 ? '-' : ''}{formatCurrency(Math.abs(profit), currencySymbol)}
          </span>
        </div>
      </div>

      <div className="margin-progress-wrapper">
        <div className="margin-header-row">
          <span style={{ color: 'var(--text-secondary)' }}>Net Profit Margin</span>
          <span style={{ color: margin >= 0 ? 'var(--emerald-600)' : 'var(--rose-600)', fontWeight: 800 }}>
            {margin.toFixed(1)}%
          </span>
        </div>
        <div className="progress-track">
          <div
            className="progress-bar-fill"
            style={{
              width: `${Math.min(Math.max(margin, 0), 100)}%`,
              background: margin < 0 ? 'var(--rose-500)' : undefined,
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default FinancialSummaryCard;
