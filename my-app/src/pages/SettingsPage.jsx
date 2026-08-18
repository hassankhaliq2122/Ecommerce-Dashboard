import React, { useState } from 'react';
import {
  Store,
  User,
  DollarSign,
  Bell,
  Sun,
  Moon,
  RotateCcw,
  Check,
  ShieldAlert,
} from 'lucide-react';
import Modal from '../components/ui/Modal';

function SettingsPage({
  settings,
  onSaveSettings,
  theme,
  onToggleTheme,
  onResetAllData,
}) {
  const [formData, setFormData] = useState(settings);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSaveSettings) {
      onSaveSettings(formData);
    }
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleConfirmReset = () => {
    if (onResetAllData) {
      onResetAllData();
    }
    setIsResetModalOpen(false);
  };

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <h2 className="welcome-title">Store Settings & Preferences</h2>
          <p className="welcome-subtitle">
            Configure currency, store branding, notification alerts, and theme preferences
          </p>
        </div>

        <div className="header-controls">
          {savedSuccess && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--emerald-600)', fontSize: '0.85rem', fontWeight: 600 }}>
              <Check size={16} /> Preferences Saved
            </span>
          )}
          <button className="btn-primary" onClick={handleSubmit}>
            Save All Changes
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '850px' }}>
        {/* Store Profile */}
        <div className="form-card">
          <div className="card-header-row">
            <div className="card-title-group">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Store size={18} color="var(--brand-500)" />
                Store Information
              </h3>
              <p className="card-subtitle">General store identity and web domain</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Store Name</label>
              <input
                type="text"
                className="form-input"
                value={formData.storeName || ''}
                onChange={(e) => handleChange('storeName', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Store Domain</label>
              <input
                type="text"
                className="form-input"
                value={formData.storeDomain || ''}
                onChange={(e) => handleChange('storeDomain', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Currency & Financial Locale */}
        <div className="form-card">
          <div className="card-header-row">
            <div className="card-title-group">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <DollarSign size={18} color="var(--emerald-500)" />
                Currency & Localization
              </h3>
              <p className="card-subtitle">Set active store currency symbol and formatting</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Display Currency</label>
              <select
                className="form-input"
                value={formData.currency || '$'}
                onChange={(e) => {
                  const val = e.target.value;
                  const codeMap = { '$': 'USD', '€': 'EUR', '£': 'GBP', '¥': 'JPY' };
                  handleChange('currency', val);
                  handleChange('currencyCode', codeMap[val] || 'USD');
                }}
              >
                <option value="$">$ - US Dollar (USD)</option>
                <option value="€">€ - Euro (EUR)</option>
                <option value="£">£ - British Pound (GBP)</option>
                <option value="¥">¥ - Japanese Yen (JPY)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Standard Tax Rate (%)</label>
              <input
                type="number"
                step="0.1"
                className="form-input"
                value={formData.taxRate || 0}
                onChange={(e) => handleChange('taxRate', Number(e.target.value))}
              />
            </div>
          </div>
        </div>

        {/* Admin Account */}
        <div className="form-card">
          <div className="card-header-row">
            <div className="card-title-group">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <User size={18} color="var(--sky-500)" />
                Admin Account
              </h3>
              <p className="card-subtitle">User credentials for dashboard administration</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Admin Name</label>
              <input
                type="text"
                className="form-input"
                value={formData.adminName || 'Admin'}
                onChange={(e) => handleChange('adminName', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Admin Email</label>
              <input
                type="email"
                className="form-input"
                value={formData.adminEmail || 'admin@shoplytics.io'}
                onChange={(e) => handleChange('adminEmail', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Appearance & Theme */}
        <div className="form-card">
          <div className="card-header-row">
            <div className="card-title-group">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                {theme === 'dark' ? <Moon size={18} color="var(--brand-400)" /> : <Sun size={18} color="var(--amber-500)" />}
                Appearance & Theme
              </h3>
              <p className="card-subtitle">Select color mode and visual theme</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              type="button"
              className={theme === 'light' ? 'btn-primary' : 'btn-secondary'}
              onClick={() => {
                if (theme !== 'light') onToggleTheme();
              }}
              style={{ flex: 1, padding: '0.75rem' }}
            >
              <Sun size={18} /> Light Mode
            </button>
            <button
              type="button"
              className={theme === 'dark' ? 'btn-primary' : 'btn-secondary'}
              onClick={() => {
                if (theme !== 'dark') onToggleTheme();
              }}
              style={{ flex: 1, padding: '0.75rem' }}
            >
              <Moon size={18} /> Dark Mode
            </button>
          </div>
        </div>

        {/* Danger Zone / Reset */}
        <div className="form-card" style={{ borderColor: 'var(--rose-200)', backgroundColor: 'var(--rose-50)' }}>
          <div className="card-header-row">
            <div className="card-title-group">
              <h3 style={{ color: 'var(--rose-600)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <ShieldAlert size={18} />
                Data Management
              </h3>
              <p className="card-subtitle" style={{ color: 'var(--text-secondary)' }}>
                Reset all sample financial records, inventory items, and orders back to pristine demo state.
              </p>
            </div>
          </div>

          <button
            type="button"
            className="btn-danger"
            onClick={() => setIsResetModalOpen(true)}
          >
            <RotateCcw size={15} /> Reset All Data to Demo Defaults
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        title="Reset All Dashboard Data?"
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', width: '100%' }}>
            <button className="btn-secondary" onClick={() => setIsResetModalOpen(false)}>
              Cancel
            </button>
            <button className="btn-danger" onClick={handleConfirmReset}>
              Yes, Reset Everything
            </button>
          </div>
        }
      >
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          This will purge all custom revenue entries, product costs, added expenses, and restore the default 8-month Shoplytics demonstration records.
        </p>
      </Modal>
    </div>
  );
}

export default SettingsPage;
