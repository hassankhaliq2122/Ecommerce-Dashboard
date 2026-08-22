import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import OrdersPage from './pages/OrdersPage';
import ProductsPage from './pages/ProductsPage';
import ExpensesPage from './pages/ExpensesPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';

import {
  loadStoredMonthlyRecords,
  saveStoredMonthlyRecords,
  loadStoredProducts,
  saveStoredProducts,
  loadStoredCustomers,
  saveStoredCustomers,
  loadStoredTheme,
  saveStoredTheme,
  loadStoredSettings,
  saveStoredSettings,
  resetAllData,
} from './utils/storage';
import { INITIAL_NOTIFICATIONS, INITIAL_MONTHLY_RECORDS, INITIAL_PRODUCTS, INITIAL_CUSTOMERS } from './data/initialData';
import { api } from './services/api';
import './App.css';

function App() {
  // Authentication State
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem('shoplytics_auth_user');
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  });

  const [monthlyRecords, setMonthlyRecords] = useState(loadStoredMonthlyRecords);
  const [products, setProducts] = useState(loadStoredProducts);
  const [customers, setCustomers] = useState(loadStoredCustomers);
  const [settings, setSettings] = useState(loadStoredSettings);
  const [theme, setTheme] = useState(loadStoredTheme);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const [activePage, setActivePage] = useState('dashboard');
  const [selectedMonth, setSelectedMonth] = useState('2026-08');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDbConnected, setIsDbConnected] = useState(false);

  // Sync Theme with DOM
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    saveStoredTheme(theme);
  }, [theme]);

  // Load from MongoDB Atlas on mount
  useEffect(() => {
    const fetchBackendData = async () => {
      try {
        const health = await api.checkHealth();
        if (health) {
          setIsDbConnected(true);
          const [dbRecords, dbProducts, dbCustomers, dbSettings] = await Promise.allSettled([
            api.getMonthlyRecords(),
            api.getProducts(),
            api.getCustomers(),
            api.getSettings(),
          ]);

          if (dbRecords.status === 'fulfilled' && Array.isArray(dbRecords.value)) {
            setMonthlyRecords(dbRecords.value.length > 0 ? dbRecords.value : INITIAL_MONTHLY_RECORDS);
            saveStoredMonthlyRecords(dbRecords.value);
          }
          if (dbProducts.status === 'fulfilled' && Array.isArray(dbProducts.value)) {
            setProducts(dbProducts.value);
            saveStoredProducts(dbProducts.value);
          }
          if (dbCustomers.status === 'fulfilled' && Array.isArray(dbCustomers.value)) {
            setCustomers(dbCustomers.value);
            saveStoredCustomers(dbCustomers.value);
          }
          if (dbSettings.status === 'fulfilled' && dbSettings.value && dbSettings.value.storeName) {
            setSettings(dbSettings.value);
            saveStoredSettings(dbSettings.value);
          }
        }
      } catch (err) {
        console.log('Using local cached storage:', err);
      }
    };

    fetchBackendData();
  }, []);

  // Save to LocalStorage as cache
  useEffect(() => {
    saveStoredMonthlyRecords(monthlyRecords);
  }, [monthlyRecords]);

  useEffect(() => {
    saveStoredProducts(products);
  }, [products]);

  useEffect(() => {
    saveStoredCustomers(customers);
  }, [customers]);

  useEffect(() => {
    saveStoredSettings(settings);
  }, [settings]);

  // Logout Handler
  const handleLogout = () => {
    localStorage.removeItem('shoplytics_auth_user');
    localStorage.removeItem('shoplytics_auth_token');
    sessionStorage.removeItem('shoplytics_auth_user');
    sessionStorage.removeItem('shoplytics_auth_token');
    setCurrentUser(null);
  };

  // Financial Actions (Optimistic UI + MongoDB Sync)
  const addExpense = async (newExpense) => {
    const expenseWithId = {
      ...newExpense,
      id: Date.now(),
    };
    setMonthlyRecords((prev) =>
      prev.map((record) => {
        if (record.month === selectedMonth) {
          return {
            ...record,
            expenses: [...(record.expenses || []), expenseWithId],
          };
        }
        return record;
      })
    );

    try {
      await api.addExpense(selectedMonth, expenseWithId);
    } catch (err) {
      console.warn('Backend sync failed, saved locally:', err);
    }
  };

  const deleteExpense = async (id) => {
    setMonthlyRecords((prev) =>
      prev.map((record) => {
        if (record.month === selectedMonth) {
          return {
            ...record,
            expenses: (record.expenses || []).filter((expense) => expense.id !== id),
          };
        }
        return record;
      })
    );

    try {
      await api.deleteExpense(selectedMonth, id);
    } catch (err) {
      console.warn('Backend sync failed, saved locally:', err);
    }
  };

  const updateExpense = async (updatedExpense) => {
    setMonthlyRecords((prev) =>
      prev.map((record) => {
        if (record.month === selectedMonth) {
          return {
            ...record,
            expenses: (record.expenses || []).map((expense) => {
              if (expense.id === updatedExpense.id) {
                return updatedExpense;
              }
              return expense;
            }),
          };
        }
        return record;
      })
    );

    try {
      await api.updateExpense(selectedMonth, updatedExpense);
    } catch (err) {
      console.warn('Backend sync failed, saved locally:', err);
    }
  };

  const updateRevenue = async (newRevenue) => {
    setMonthlyRecords((prev) =>
      prev.map((record) => {
        if (record.month === selectedMonth) {
          return {
            ...record,
            revenue: newRevenue,
          };
        }
        return record;
      })
    );

    try {
      await api.updateRevenue(selectedMonth, newRevenue);
    } catch (err) {
      console.warn('Backend sync failed, saved locally:', err);
    }
  };

  const updateCost = async (newCost) => {
    setMonthlyRecords((prev) =>
      prev.map((record) => {
        if (record.month === selectedMonth) {
          return {
            ...record,
            productCost: newCost,
          };
        }
        return record;
      })
    );

    try {
      await api.updateProductCost(selectedMonth, newCost);
    } catch (err) {
      console.warn('Backend sync failed, saved locally:', err);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    setMonthlyRecords((prev) =>
      prev.map((record) => {
        if (record.month === selectedMonth) {
          return {
            ...record,
            orders: (record.orders || []).map((ord) => {
              if (ord.id === orderId) {
                return { ...ord, status: newStatus };
              }
              return ord;
            }),
          };
        }
        return record;
      })
    );

    try {
      await api.updateOrderStatus(selectedMonth, orderId, newStatus);
    } catch (err) {
      console.warn('Backend sync failed, saved locally:', err);
    }
  };

  const addProduct = async (newProduct) => {
    setProducts((prev) => [newProduct, ...prev]);
    try {
      await api.createProduct(newProduct);
    } catch (err) {
      console.warn('Backend sync failed, saved locally:', err);
    }
  };

  const handleSaveSettings = async (newSettings) => {
    setSettings(newSettings);
    try {
      await api.updateSettings(newSettings);
    } catch (err) {
      console.warn('Backend sync failed, saved locally:', err);
    }
  };

  const handleSaveDateRange = async (recordData) => {
    setMonthlyRecords((prev) => {
      const exists = prev.some((r) => r.month === recordData.month);
      if (exists) {
        return prev.map((r) => (r.month === recordData.month ? { ...r, ...recordData } : r));
      }
      return [...prev, recordData];
    });
    setSelectedMonth(recordData.month);

    try {
      await api.saveDateRangeRecord(recordData);
    } catch (err) {
      console.warn('Backend sync failed, saved locally:', err);
    }
  };

  const handleDeleteDateRange = async (monthKey) => {
    setMonthlyRecords((prev) => {
      const filtered = prev.filter((r) => r.month !== monthKey);
      if (selectedMonth === monthKey && filtered.length > 0) {
        setSelectedMonth(filtered[0].month);
      }
      return filtered;
    });

    try {
      await api.deleteRecord(monthKey);
    } catch (err) {
      console.warn('Backend delete failed, updated locally:', err);
    }
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleResetData = async () => {
    try {
      await api.resetDatabase();
    } catch (err) {
      console.warn('Backend reset failed, resetting local state:', err);
    }
    resetAllData();
    setMonthlyRecords(INITIAL_MONTHLY_RECORDS);
    setProducts(INITIAL_PRODUCTS);
    setCustomers(INITIAL_CUSTOMERS);
    alert('Dashboard and MongoDB Atlas database cleared and reset!');
  };

  // If user is not authenticated, display AuthPage (Login/Signup with hardcoded credentials)
  if (!currentUser) {
    return <AuthPage onLoginSuccess={(user) => setCurrentUser(user)} theme={theme} />;
  }

  // Page titles
  const getPageInfo = () => {
    switch (activePage) {
      case 'orders':
        return { title: 'Orders', breadcrumb: 'Management / Orders' };
      case 'products':
        return { title: 'Products', breadcrumb: 'Catalog / Products' };
      case 'reports':
        return { title: 'Financial Reports', breadcrumb: 'Analytics / Reports' };
      case 'expenses':
        return { title: 'Operating Expenses', breadcrumb: 'Finance / Expenses' };
      case 'settings':
        return { title: 'Settings', breadcrumb: 'System / Settings' };
      case 'dashboard':
      default:
        return { title: 'Dashboard', breadcrumb: 'Analytics / Overview' };
    }
  };

  const { title, breadcrumb } = getPageInfo();

  const currentRecord = monthlyRecords.find((r) => r.month === selectedMonth) || {};
  const globalSearchData = {
    products,
    orders: currentRecord.orders || [],
    expenses: currentRecord.expenses || [],
  };

  const lowStockCount = products.filter((p) => p.stock <= 30).length;
  const currentOrdersCount = (currentRecord.orders || []).length;

  return (
    <div className="app-container">
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        unreadOrdersCount={currentOrdersCount}
        lowStockCount={lowStockCount}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      <div className="main-wrapper">
        <Navbar
          pageTitle={title}
          breadcrumb={breadcrumb}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          theme={theme}
          onToggleTheme={toggleTheme}
          notifications={notifications}
          onMarkAllNotificationsRead={markAllNotificationsRead}
          onNavigate={setActivePage}
          globalSearchData={globalSearchData}
          currentUser={currentUser}
          onLogout={handleLogout}
        />

        <main className="content-area">
          {activePage === 'dashboard' && (
            <Dashboard
              monthlyRecords={monthlyRecords}
              selectedMonth={selectedMonth}
              setSelectedMonth={setSelectedMonth}
              onAddExpense={addExpense}
              onDeleteExpense={deleteExpense}
              onUpdateExpense={updateExpense}
              onUpdateRevenue={updateRevenue}
              onUpdateCost={updateCost}
              onUpdateOrderStatus={updateOrderStatus}
              onSaveDateRange={handleSaveDateRange}
              onDeleteDateRange={handleDeleteDateRange}
              products={products}
              currencySymbol={settings.currency || '$'}
            />
          )}

          {activePage === 'orders' && (
            <OrdersPage
              monthlyRecords={monthlyRecords}
              selectedMonth={selectedMonth}
              onUpdateOrderStatus={updateOrderStatus}
              currencySymbol={settings.currency || '$'}
            />
          )}

          {activePage === 'products' && (
            <ProductsPage
              products={products}
              onAddProduct={addProduct}
              currencySymbol={settings.currency || '$'}
            />
          )}

          {activePage === 'reports' && (
            <ReportsPage
              monthlyRecords={monthlyRecords}
              selectedMonth={selectedMonth}
              setSelectedMonth={setSelectedMonth}
              onSaveDateRange={handleSaveDateRange}
              onDeleteDateRange={handleDeleteDateRange}
              onNavigateToDashboard={() => setActivePage('dashboard')}
              currencySymbol={settings.currency || '$'}
            />
          )}

          {activePage === 'expenses' && (
            <ExpensesPage
              monthlyRecords={monthlyRecords}
              selectedMonth={selectedMonth}
              setSelectedMonth={setSelectedMonth}
              onAddExpense={addExpense}
              onDeleteExpense={deleteExpense}
              onUpdateExpense={updateExpense}
              currencySymbol={settings.currency || '$'}
            />
          )}

          {activePage === 'settings' && (
            <SettingsPage
              settings={settings}
              onSaveSettings={handleSaveSettings}
              theme={theme}
              onToggleTheme={toggleTheme}
              onResetAllData={handleResetData}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;