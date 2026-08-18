import React from 'react';
import { CheckCircle2, AlertTriangle, Info, Bell, Check } from 'lucide-react';

function NotificationDropdown({ notifications, onMarkAllRead, onNotificationClick }) {
  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={16} color="var(--emerald-500)" />;
      case 'warning':
        return <AlertTriangle size={16} color="var(--amber-500)" />;
      case 'info':
      default:
        return <Info size={16} color="var(--brand-500)" />;
    }
  };

  return (
    <div className="notification-popover" onClick={(e) => e.stopPropagation()}>
      <div className="notification-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Bell size={16} />
          <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Notifications</span>
        </div>
        <button
          className="btn-secondary"
          style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
          onClick={onMarkAllRead}
        >
          <Check size={12} /> Mark all read
        </button>
      </div>

      <div className="notification-list">
        {notifications.length === 0 ? (
          <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            No new notifications
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              className={`notification-item ${!notif.read ? 'unread' : ''}`}
              onClick={() => onNotificationClick && onNotificationClick(notif.id)}
            >
              <div style={{ marginTop: '2px', flexShrink: 0 }}>
                {getIcon(notif.type)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.2rem' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.825rem', color: 'var(--text-primary)' }}>
                    {notif.title}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    {notif.time}
                  </span>
                </div>
                <p style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  {notif.message}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default NotificationDropdown;
