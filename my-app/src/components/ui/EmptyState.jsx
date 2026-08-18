import React from 'react';
import { Inbox } from 'lucide-react';

function EmptyState({
  icon: Icon = Inbox,
  title = 'No records found',
  description = 'There are no items to display at this moment.',
  actionLabel,
  onAction,
}) {
  return (
    <div className="empty-state-box">
      <Icon className="empty-state-icon" />
      <h4 className="empty-state-title">{title}</h4>
      <p className="empty-state-text">{description}</p>
      {actionLabel && onAction && (
        <button className="btn-primary" onClick={onAction} style={{ marginTop: '0.5rem' }}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export default EmptyState;
