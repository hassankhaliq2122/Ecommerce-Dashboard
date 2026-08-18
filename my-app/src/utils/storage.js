// LocalStorage synchronization utilities for Shoplytics
import { INITIAL_MONTHLY_RECORDS, INITIAL_PRODUCTS, INITIAL_CUSTOMERS } from '../data/initialData';

const RECORDS_KEY = 'shoplytics_monthly_records_v2';
const PRODUCTS_KEY = 'shoplytics_products_v2';
const CUSTOMERS_KEY = 'shoplytics_customers_v2';
const THEME_KEY = 'shoplytics_theme_v2';
const SETTINGS_KEY = 'shoplytics_settings_v2';

export const loadStoredMonthlyRecords = () => {
  try {
    const raw = localStorage.getItem(RECORDS_KEY);
    if (raw === null) return INITIAL_MONTHLY_RECORDS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_MONTHLY_RECORDS;
  } catch (err) {
    return INITIAL_MONTHLY_RECORDS;
  }
};

export const saveStoredMonthlyRecords = (records) => {
  try {
    localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
  } catch (err) {
    console.error('Error saving monthly records to storage:', err);
  }
};

export const loadStoredProducts = () => {
  try {
    const raw = localStorage.getItem(PRODUCTS_KEY);
    if (raw === null) return INITIAL_PRODUCTS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_PRODUCTS;
  } catch (err) {
    return INITIAL_PRODUCTS;
  }
};

export const saveStoredProducts = (products) => {
  try {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  } catch (err) {
    console.error('Error saving products:', err);
  }
};

export const loadStoredCustomers = () => {
  try {
    const raw = localStorage.getItem(CUSTOMERS_KEY);
    if (raw === null) return INITIAL_CUSTOMERS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_CUSTOMERS;
  } catch (err) {
    return INITIAL_CUSTOMERS;
  }
};

export const saveStoredCustomers = (customers) => {
  try {
    localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(customers));
  } catch (err) {
    console.error('Error saving customers:', err);
  }
};

export const loadStoredTheme = () => {
  try {
    return localStorage.getItem(THEME_KEY) || 'light';
  } catch (err) {
    return 'light';
  }
};

export const saveStoredTheme = (theme) => {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (err) {
    console.error('Error saving theme:', err);
  }
};

export const loadStoredSettings = () => {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) {
      return {
        storeName: 'My Store',
        storeDomain: 'mystore.com',
        currency: '$',
        currencyCode: 'USD',
        taxRate: 0,
        emailNotifications: true,
        orderAlerts: true,
        adminName: 'Admin',
        adminEmail: 'admin@mystore.com',
      };
    }
    return JSON.parse(raw);
  } catch (err) {
    return {
      storeName: 'My Store',
      storeDomain: 'mystore.com',
      currency: '$',
      currencyCode: 'USD',
      taxRate: 0,
      emailNotifications: true,
      orderAlerts: true,
      adminName: 'Admin',
      adminEmail: 'admin@mystore.com',
    };
  }
};

export const saveStoredSettings = (settings) => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (err) {
    console.error('Error saving settings:', err);
  }
};

export const resetAllData = () => {
  try {
    localStorage.removeItem(RECORDS_KEY);
    localStorage.removeItem(PRODUCTS_KEY);
    localStorage.removeItem(CUSTOMERS_KEY);
    localStorage.removeItem(SETTINGS_KEY);
    // Also remove old v1 keys if any
    localStorage.removeItem('shoplytics_monthly_records_v1');
    localStorage.removeItem('shoplytics_products_v1');
    localStorage.removeItem('shoplytics_customers_v1');
    localStorage.removeItem('shoplytics_settings_v1');
    return true;
  } catch (err) {
    console.error('Error resetting data:', err);
    return false;
  }
};
