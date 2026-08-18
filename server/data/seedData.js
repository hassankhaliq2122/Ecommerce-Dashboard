export const INITIAL_PRODUCTS = [];

export const INITIAL_CUSTOMERS = [];

export const INITIAL_MONTHLY_RECORDS = [
  {
    month: '2026-08',
    revenue: 0,
    revenueTarget: 30000,
    productCost: 0,
    ordersCount: 0,
    conversionRate: 0,
    expenses: [],
    orders: [],
  },
];

export const INITIAL_SETTINGS = {
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
