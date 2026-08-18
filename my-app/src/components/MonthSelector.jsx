import React from 'react';
import { CalendarDays, Calendar, X } from 'lucide-react';
import { formatMonthYear } from '../utils/formatters';

function MonthSelector({
  selectedMonth,
  onMonthChange,
  availableMonths = [],
  filterMode = 'month', // 'month' | 'custom'
  onFilterModeChange,
  startDate = '',
  endDate = '',
  onStartDateChange,
  onEndDateChange,
  onClearCustomDates,
}) {
  const defaultMonths = [
    '2026-01',
    '2026-02',
    '2026-03',
    '2026-04',
    '2026-05',
    '2026-06',
    '2026-07',
    '2026-08',
  ];

  const monthsToRender = availableMonths.length > 0 ? availableMonths : defaultMonths;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
      {/* Mode Switcher */}
      {onFilterModeChange && (
        <div style={{ display: 'flex', backgroundColor: 'var(--bg-card)', padding: '0.2rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <button
            type="button"
            className={filterMode === 'month' ? 'btn-primary' : 'btn-secondary'}
            style={{ fontSize: '0.75rem', padding: '0.25rem 0.65rem', borderRadius: 'var(--radius-sm)', border: 'none' }}
            onClick={() => onFilterModeChange('month')}
          >
            By Month
          </button>
          <button
            type="button"
            className={filterMode === 'custom' ? 'btn-primary' : 'btn-secondary'}
            style={{ fontSize: '0.75rem', padding: '0.25rem 0.65rem', borderRadius: 'var(--radius-sm)', border: 'none' }}
            onClick={() => onFilterModeChange('custom')}
          >
            Custom Dates
          </button>
        </div>
      )}

      {filterMode === 'month' ? (
        <div className="month-selector-wrapper">
          <div className="month-selector-label">
            <CalendarDays size={16} color="var(--brand-500)" />
            <span>Period:</span>
          </div>

          <select
            className="month-dropdown-select"
            value={selectedMonth}
            onChange={(event) => {
              if (onMonthChange) {
                onMonthChange(event.target.value);
              }
            }}
            aria-label="Select month"
          >
            {monthsToRender.map((m) => (
              <option key={m} value={m}>
                {formatMonthYear(m)}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <div className="month-selector-wrapper" style={{ gap: '0.5rem', padding: '0.3rem 0.65rem' }}>
          <div className="month-selector-label">
            <Calendar size={16} color="var(--brand-500)" />
            <span>Range:</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <input
              type="date"
              className="form-input"
              style={{ width: '130px', padding: '0.25rem 0.4rem', fontSize: '0.75rem', height: '30px' }}
              value={startDate}
              placeholder="From"
              onChange={(e) => onStartDateChange && onStartDateChange(e.target.value)}
            />
            <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>-</span>
            <input
              type="date"
              className="form-input"
              style={{ width: '130px', padding: '0.25rem 0.4rem', fontSize: '0.75rem', height: '30px' }}
              value={endDate}
              placeholder="To"
              onChange={(e) => onEndDateChange && onEndDateChange(e.target.value)}
            />
            {(startDate || endDate) && onClearCustomDates && (
              <button
                type="button"
                className="btn-icon"
                onClick={onClearCustomDates}
                title="Reset custom date range"
                style={{ padding: '0.25rem', color: 'var(--rose-600)' }}
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default MonthSelector;