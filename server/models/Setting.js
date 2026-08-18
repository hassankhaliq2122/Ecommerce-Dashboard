import mongoose from 'mongoose';

const SettingSchema = new mongoose.Schema(
  {
    storeName: { type: String, default: 'Aura Collective' },
    storeDomain: { type: String, default: 'auracollective.store' },
    currency: { type: String, default: '$' },
    currencyCode: { type: String, default: 'USD' },
    taxRate: { type: Number, default: 8.5 },
    emailNotifications: { type: Boolean, default: true },
    orderAlerts: { type: Boolean, default: true },
    adminName: { type: String, default: 'Admin' },
    adminEmail: { type: String, default: 'admin@shoplytics.io' },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Setting', SettingSchema);
