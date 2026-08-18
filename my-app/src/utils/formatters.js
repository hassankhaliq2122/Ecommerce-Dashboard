// Currency, Date, and Metric formatting utilities for Shoplytics

export const formatCurrency = (amount, currencySymbol = '$') => {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return `${currencySymbol}0`;
  }
  return `${currencySymbol}${Number(amount).toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
};

export const formatNumber = (num) => {
  if (num === undefined || num === null || isNaN(num)) return '0';
  return Number(num).toLocaleString('en-US');
};

export const formatPercent = (value, decimals = 1) => {
  if (value === undefined || value === null || isNaN(value)) return '0.0%';
  const prefix = value > 0 ? '+' : '';
  return `${prefix}${Number(value).toFixed(decimals)}%`;
};

export const formatMonthYear = (monthStr) => {
  if (!monthStr) return '';
  const [year, month] = monthStr.split('-');
  const date = new Date(parseInt(year, 10), parseInt(month, 10) - 1, 1);
  return date.toLocaleString('en-US', { month: 'long', year: 'numeric' });
};

export const formatShortMonth = (monthStr) => {
  if (!monthStr) return '';
  const [year, month] = monthStr.split('-');
  const date = new Date(parseInt(year, 10), parseInt(month, 10) - 1, 1);
  return date.toLocaleString('en-US', { month: 'short' });
};

export const calculatePercentageChange = (current, previous) => {
  if (!previous || previous === 0) {
    if (!current || current === 0) return 0;
    return 100;
  }
  return ((current - previous) / previous) * 100;
};
