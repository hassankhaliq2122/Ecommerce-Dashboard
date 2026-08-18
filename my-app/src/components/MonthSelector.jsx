import React from 'react';
import { Calendar, Plus, Edit2, Trash2, CheckCircle, ChevronRight } from 'lucide-react';
import { formatCurrency, formatMonthYear } from '../utils/formatters';

function MonthSelector({
  selectedMonth,
  onMonthChange,
  monthlyRecords = [],
  onOpenAddModal,
  onOpenEditModal,
  onDeleteRecord,
  currencySymbol = '$',
}) {
  // Format period label cleanly
  const getPeriodLabel = (record) => {
    if (record.label) return record.label;
    if (record.startDate && record.endDate) {
      try {
        const d1 = new Date(record.startDate + 'T00:00:00');
        const d2 = new Date(record.endDate + 'T00:00:00');
        const s = d1.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
        const e = d2.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
        return `${s} - ${e}`;
      } catch (err) {
        return `${record.startDate} - ${record.endDate}`;
      }
    }
    return formatMonthYear(record.month) || record.month;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', width: '100%' }}>
      {/* Top Action Header for Date Ranges */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.6rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ padding: '0.35rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--brand-100)', color: 'var(--brand-600)' }}>
            <Calendar size={16} />
          </div>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
            Saved Date Ranges / Periods:
          </span>
        </div>

        {onOpenAddModal && (
          <button
            type="button"
            className="btn-primary"
            onClick={onOpenAddModal}
            style={{
              padding: '0.35rem 0.75rem',
              fontSize: '0.8rem',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontWeight: 600,
              boxShadow: '0 2px 8px rgba(99, 102, 241, 0.25)',
            }}
          >
            <Plus size={15} />
            <span>Add Date Range (e.g. 3 Jul - 3 Aug)</span>
          </button>
        )}
      </div>

      {/* Horizontal Tabs Container */}
      <div
        className="date-range-tabs-container"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          overflowX: 'auto',
          padding: '0.3rem 0.2rem',
          scrollbarWidth: 'thin',
        }}
      >
        {monthlyRecords.length === 0 ? (
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', italic: 'true' }}>
            No date ranges saved yet. Click "+ Add Date Range" above to create one.
          </div>
        ) : (
          monthlyRecords.map((record) => {
            const isSelected = record.month === selectedMonth;
            const label = getPeriodLabel(record);

            // Compute net profit for pill preview
            const rev = Number(record.revenue) || 0;
            const cost = Number(record.productCost) || 0;
            const exp = (record.expenses || []).reduce((acc, e) => acc + (Number(e.amount) || 0), 0);
            const netProfit = rev - cost - exp;

            return (
              <div
                key={record.month}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.35rem 0.75rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: isSelected ? 'var(--brand-600)' : 'var(--bg-card)',
                  color: isSelected ? '#ffffff' : 'var(--text-main)',
                  border: isSelected ? '1px solid var(--brand-600)' : '1px solid var(--border-color)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontSize: '0.8rem',
                  fontWeight: isSelected ? 600 : 500,
                  whiteSpace: 'nowrap',
                  boxShadow: isSelected
                    ? '0 4px 12px rgba(99, 102, 241, 0.3)'
                    : '0 1px 3px rgba(0, 0, 0, 0.05)',
                  userSelect: 'none',
                }}
                onClick={() => onMonthChange && onMonthChange(record.month)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  {isSelected && <CheckCircle size={14} color="#ffffff" />}
                  <span>{label}</span>
                </div>

                {/* Profit Badge preview */}
                <span
                  style={{
                    fontSize: '0.7rem',
                    padding: '0.15rem 0.4rem',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: isSelected
                      ? 'rgba(255, 255, 255, 0.2)'
                      : netProfit >= 0
                      ? 'var(--emerald-50)'
                      : 'var(--rose-50)',
                    color: isSelected
                      ? '#ffffff'
                      : netProfit >= 0
                      ? 'var(--emerald-700)'
                      : 'var(--rose-700)',
                    fontWeight: 600,
                  }}
                >
                  {formatCurrency(netProfit, currencySymbol)}
                </span>

                {/* Action buttons (Edit & Delete) for this tab */}
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', marginLeft: '0.2rem' }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {onOpenEditModal && (
                    <button
                      type="button"
                      title="Edit this date range data"
                      style={{
                        background: 'none',
                        border: 'none',
                        color: isSelected ? 'rgba(255,255,255,0.85)' : 'var(--text-muted)',
                        cursor: 'pointer',
                        padding: '0.15rem',
                        display: 'flex',
                        alignItems: 'center',
                        borderRadius: 'var(--radius-sm)',
                      }}
                      onClick={() => onOpenEditModal(record)}
                    >
                      <Edit2 size={13} />
                    </button>
                  )}

                  {onDeleteRecord && monthlyRecords.length > 1 && (
                    <button
                      type="button"
                      title="Delete this date range tab"
                      style={{
                        background: 'none',
                        border: 'none',
                        color: isSelected ? 'rgba(255,255,255,0.85)' : 'var(--rose-500)',
                        cursor: 'pointer',
                        padding: '0.15rem',
                        display: 'flex',
                        alignItems: 'center',
                        borderRadius: 'var(--radius-sm)',
                      }}
                      onClick={() => {
                        if (window.confirm(`Delete saved tab for "${label}"?`)) {
                          onDeleteRecord(record.month);
                        }
                      }}
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default MonthSelector;