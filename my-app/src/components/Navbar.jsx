import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Search,
  Bell,
  Sun,
  Moon,
  User,
  Settings,
  LogOut,
  ShoppingBag,
  Receipt,
  Package,
} from 'lucide-react';
import NotificationDropdown from './notifications/NotificationDropdown';

function Navbar({
  pageTitle = 'Dashboard',
  breadcrumb = 'Home / Dashboard',
  onOpenMobileSidebar,
  theme = 'light',
  onToggleTheme,
  notifications = [],
  onMarkAllNotificationsRead,
  onNavigate,
  currentUser = null,
  onLogout,
  globalSearchData = { products: [], expenses: [], orders: [] },
}) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const searchRef = useRef(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Filter global search
  const q = searchQuery.toLowerCase().trim();
  const matchedProducts = q
    ? (globalSearchData.products || []).filter((p) => p.name.toLowerCase().includes(q)).slice(0, 3)
    : [];
  const matchedOrders = q
    ? (globalSearchData.orders || []).filter((o) => o.id.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q)).slice(0, 3)
    : [];
  const matchedExpenses = q
    ? (globalSearchData.expenses || []).filter((e) => e.name.toLowerCase().includes(q)).slice(0, 3)
    : [];

  const hasSearchResults = matchedProducts.length > 0 || matchedOrders.length > 0 || matchedExpenses.length > 0;

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button
          className="mobile-toggle-btn"
          onClick={onOpenMobileSidebar}
          aria-label="Open mobile menu"
        >
          <Menu size={20} />
        </button>

        <div className="page-title-box">
          <span className="page-breadcrumb">{breadcrumb}</span>
          <h1>{pageTitle}</h1>
        </div>
      </div>

      <div className="navbar-search-container" ref={searchRef}>
        <div className="search-input-wrapper">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="global-search-input"
            placeholder="Search orders, products, expenses..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearchDropdown(true);
            }}
            onFocus={() => setShowSearchDropdown(true)}
          />
        </div>

        {showSearchDropdown && searchQuery.trim() && (
          <div className="search-dropdown">
            {!hasSearchResults ? (
              <div style={{ padding: '0.75rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                No matching results found
              </div>
            ) : (
              <>
                {matchedProducts.length > 0 && (
                  <div className="search-result-group">
                    <div className="search-result-header">Products</div>
                    {matchedProducts.map((p) => (
                      <div
                        key={p.id}
                        className="search-result-item"
                        onClick={() => {
                          onNavigate && onNavigate('products');
                          setShowSearchDropdown(false);
                          setSearchQuery('');
                        }}
                      >
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <Package size={14} color="var(--brand-500)" />
                          {p.name}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>${p.price}</span>
                      </div>
                    ))}
                  </div>
                )}

                {matchedOrders.length > 0 && (
                  <div className="search-result-group">
                    <div className="search-result-header">Orders</div>
                    {matchedOrders.map((o) => (
                      <div
                        key={o.id}
                        className="search-result-item"
                        onClick={() => {
                          onNavigate && onNavigate('orders');
                          setShowSearchDropdown(false);
                          setSearchQuery('');
                        }}
                      >
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <ShoppingBag size={14} color="var(--emerald-500)" />
                          {o.id} - {o.customer}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>${o.amount}</span>
                      </div>
                    ))}
                  </div>
                )}

                {matchedExpenses.length > 0 && (
                  <div className="search-result-group">
                    <div className="search-result-header">Expenses</div>
                    {matchedExpenses.map((e) => (
                      <div
                        key={e.id}
                        className="search-result-item"
                        onClick={() => {
                          onNavigate && onNavigate('expenses');
                          setShowSearchDropdown(false);
                          setSearchQuery('');
                        }}
                      >
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <Receipt size={14} color="var(--rose-500)" />
                          {e.name}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--rose-600)' }}>-${e.amount}</span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      <div className="navbar-right">
        {/* Dark/Light Mode Toggle */}
        <button
          className="icon-btn"
          onClick={onToggleTheme}
          aria-label="Toggle theme mode"
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notifications */}
        <div style={{ position: 'relative' }} ref={notifRef}>
          <button
            className="icon-btn"
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Notifications"
            title="Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && <span className="unread-badge" />}
          </button>

          {showNotifications && (
            <NotificationDropdown
              notifications={notifications}
              onMarkAllRead={() => {
                if (onMarkAllNotificationsRead) onMarkAllNotificationsRead();
              }}
              onNotificationClick={(id) => {
                setShowNotifications(false);
              }}
            />
          )}
        </div>

        {/* Profile Avatar & Dropdown */}
        <div style={{ position: 'relative' }} ref={profileRef}>
          <button
            className="icon-btn"
            style={{ padding: 0, overflow: 'hidden' }}
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            aria-label="User profile menu"
          >
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
              alt="Admin"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </button>

          {showProfileMenu && (
            <div className="profile-dropdown-menu" onClick={(e) => e.stopPropagation()}>
              <div style={{ padding: '0.6rem 0.75rem', borderBottom: '1px solid var(--border-color)' }}>
                <strong style={{ fontSize: '0.85rem', display: 'block', color: 'var(--text-primary)' }}>
                  {currentUser ? currentUser.name : 'Admin User'}
                </strong>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {currentUser ? currentUser.email : 'admin@shoplytics.io'}
                </span>
              </div>

              <button
                className="profile-menu-item"
                onClick={() => {
                  if (onNavigate) onNavigate('settings');
                  setShowProfileMenu(false);
                }}
              >
                <Settings size={15} color="var(--text-secondary)" />
                Settings & Store
              </button>

              <button
                className="profile-menu-item"
                onClick={() => {
                  setShowProfileMenu(false);
                  if (onLogout) onLogout();
                }}
                style={{ color: 'var(--rose-600)' }}
              >
                <LogOut size={15} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;