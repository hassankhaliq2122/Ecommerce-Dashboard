import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { formatCurrency, formatNumber } from '../utils/formatters';

function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendContext = 'vs last month',
  isCurrency = true,
  currencySymbol = '$',
  iconColor = 'var(--brand-500)',
  iconBg = 'rgba(99, 102, 241, 0.1)',
  prefix = '',
  suffix = '',
}) {
  const isPositive = typeof trend === 'number' && trend > 0;
  const isNegative = typeof trend === 'number' && trend < 0;

  const displayValue =
    typeof value === 'number'
      ? isCurrency
        ? formatCurrency(value, currencySymbol)
        : `${prefix}${formatNumber(value)}${suffix}`
      : `${prefix}${value || 0}${suffix}`;

  return (
    <div className="kpi-card">
      <div className="kpi-card-header">
        <span className="kpi-title">{title}</span>
        {Icon && (
          <div
            className="kpi-icon-pill"
            style={{ backgroundColor: iconBg, color: iconColor }}
          >
            <Icon size={18} />
          </div>
        )}
      </div>

      <div className="kpi-value">{displayValue}</div>

      {trend !== undefined && trend !== null && (
        <div className="kpi-trend-box">
          {isPositive && (
            <span className="trend-positive" style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
              <TrendingUp size={14} /> +{Math.abs(trend).toFixed(1)}%
            </span>
          )}
          {isNegative && (
            <span className="trend-negative" style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
              <TrendingDown size={14} /> -{Math.abs(trend).toFixed(1)}%
            </span>
          )}
          {!isPositive && !isNegative && (
            <span className="trend-neutral" style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
              <Minus size={14} /> 0.0%
            </span>
          )}
          <span className="trend-context">{trendContext}</span>
        </div>
      )}
    </div>
  );
}

export default StatCard;