import React from 'react';
import {
  LayoutDashboard,
  CalendarDays,
  ShoppingCart,
  Package,
  Users,
  BarChart3,
  DollarSign,
  TrendingUp,
  Receipt,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  CreditCard,
  LogOut,
} from 'lucide-react';

function Sidebar({
  activePage = 'dashboard',
  onNavigate,
  isCollapsed = false,
  onToggleCollapse,
  isMobileOpen = false,
  onCloseMobile,
  unreadOrdersCount = 0,
  lowStockCount = 0,
  currentUser = null,
  onLogout,
}) {
  const handleNavClick = (pageId) => {
    if (onNavigate) {
      onNavigate(pageId);
    }
    if (isMobileOpen && onCloseMobile) {
      onCloseMobile();
    }
  };

  const navGroups = [
    {
      title: 'Main',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'reports', label: 'Reports', icon: FileText },
        { id: 'orders', label: 'Orders', icon: ShoppingCart, badge: unreadOrdersCount > 0 ? unreadOrdersCount : null },
        { id: 'products', label: 'Products', icon: Package, badge: lowStockCount > 0 ? `${lowStockCount} low` : null },
      ],
    },
    {
      title: 'Finance',
      items: [
        { id: 'expenses', label: 'Expenses', icon: Receipt },
      ],
    },
    {
      title: 'Management',
      items: [
        { id: 'settings', label: 'Settings', icon: Settings },
      ],
    },
  ];

  return (
    <>
      <div
        className={`mobile-overlay ${isMobileOpen ? 'visible' : ''}`}
        onClick={onCloseMobile}
      />

      <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''} ${isMobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <div className="brand-container">
            <div className="brand-icon-wrapper">
              <TrendingUp size={20} />
            </div>
            {!isCollapsed && (
              <div className="brand-text">
                <span className="brand-title">Shoplytics</span>
                <span className="brand-subtitle">Analytics Pro</span>
              </div>
            )}
          </div>

          <button
            className="sidebar-collapse-btn"
            onClick={onToggleCollapse}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        <nav className="sidebar-nav">
          {navGroups.map((group) => (
            <div key={group.title} className="nav-group">
              {!isCollapsed && <div className="nav-group-title">{group.title}</div>}
              <ul className="nav-list">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activePage === item.id;
                  return (
                    <li key={item.id}>
                      <button
                        className={`nav-item-btn ${isActive ? 'active' : ''}`}
                        onClick={() => handleNavClick(item.id)}
                        title={isCollapsed ? item.label : undefined}
                      >
                        <Icon size={18} className="nav-icon" />
                        {!isCollapsed && <span>{item.label}</span>}
                        {!isCollapsed && item.badge && (
                          <span className="nav-badge">{item.badge}</span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {!isCollapsed && (
          <div className="sidebar-footer">
            <div className="user-profile-widget" style={{ justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                  alt="Store Admin"
                  className="user-avatar"
                />
                <div className="user-info">
                  <span className="user-name">{currentUser ? currentUser.name : 'Admin Store'}</span>
                  <span className="user-role">
                    <span className="user-status-dot" />
                    Online
                  </span>
                </div>
              </div>

              {onLogout && (
                <button
                  type="button"
                  className="btn-icon"
                  onClick={onLogout}
                  title="Logout"
                  style={{ color: 'var(--rose-600)', border: 'none', background: 'transparent' }}
                >
                  <LogOut size={16} />
                </button>
              )}
            </div>
          </div>
        )}
      </aside>
    </>
  );
}

export default Sidebar;
