import React, { useState } from 'react';
import { formatCurrency } from '../utils/formatters';
import Badge from './ui/Badge';
import EmptyState from './ui/EmptyState';
import Modal from './ui/Modal';
import { Edit2, Trash2, Receipt, AlertTriangle } from 'lucide-react';

function ExpenseList({ expenses = [], onDeleteExpense, onEditExpense, currencySymbol = '$' }) {
  const [deletingId, setDeletingId] = useState(null);

  const confirmDelete = () => {
    if (deletingId && onDeleteExpense) {
      onDeleteExpense(deletingId);
      setDeletingId(null);
    }
  };

  return (
    <div className="table-card">
      <div className="card-header-row">
        <div className="card-title-group">
          <h3>Operating Expenses</h3>
          <p className="card-subtitle">Detailed itemization of overhead and variable costs</p>
        </div>
        <Badge variant="neutral">
          {expenses.length} {expenses.length === 1 ? 'Record' : 'Records'}
        </Badge>
      </div>

      {expenses.length === 0 ? (
        <EmptyState
          icon={Receipt}
          title="No expenses recorded"
          description="No expenses added for this month matching your query."
        />
      ) : (
        <div className="table-responsive-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Expense Description</th>
                <th>Category</th>
                <th>Date</th>
                <th>Amount</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr key={expense.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: 'var(--rose-50)',
                          color: 'var(--rose-600)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <Receipt size={16} />
                      </div>
                      <span style={{ fontWeight: 600 }}>{expense.name}</span>
                    </div>
                  </td>
                  <td>
                    <Badge variant="neutral">
                      {expense.category || 'General'}
                    </Badge>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {expense.date || 'Current'}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 700, color: 'var(--rose-600)', fontVariantNumeric: 'tabular-nums' }}>
                      -{formatCurrency(expense.amount, currencySymbol)}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                      <button
                        className="btn-icon"
                        title="Edit Expense"
                        onClick={() => onEditExpense && onEditExpense(expense.id)}
                        aria-label={`Edit ${expense.name}`}
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        className="btn-icon"
                        style={{ color: 'var(--rose-600)' }}
                        title="Delete Expense"
                        onClick={() => setDeletingId(expense.id)}
                        aria-label={`Delete ${expense.name}`}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(deletingId)}
        onClose={() => setDeletingId(null)}
        title="Confirm Expense Deletion"
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', width: '100%' }}>
            <button className="btn-secondary" onClick={() => setDeletingId(null)}>
              Cancel
            </button>
            <button className="btn-danger" onClick={confirmDelete}>
              Delete Expense
            </button>
          </div>
        }
      >
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              backgroundColor: 'var(--rose-50)',
              color: 'var(--rose-600)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <AlertTriangle size={22} />
          </div>
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
              Are you sure you want to delete this expense?
            </h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              This will update your monthly profit and total expense calculations immediately.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default ExpenseList;
