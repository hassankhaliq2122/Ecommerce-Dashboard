import React, { useState } from 'react';
import {
  TrendingUp,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Zap,
  BarChart3,
  Loader2,
} from 'lucide-react';
import { api } from '../services/api';

function AuthPage({ onLoginSuccess, theme = 'light' }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanEmail || !cleanPass) {
      setError('Please provide both email and password.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.login(cleanEmail, cleanPass);

      if (response && response.token && response.user) {
        if (rememberMe) {
          localStorage.setItem('shoplytics_auth_token', response.token);
          localStorage.setItem('shoplytics_auth_user', JSON.stringify(response.user));
        } else {
          sessionStorage.setItem('shoplytics_auth_token', response.token);
          sessionStorage.setItem('shoplytics_auth_user', JSON.stringify(response.user));
        }
        onLoginSuccess(response.user);
      } else {
        throw new Error('Authentication failed');
      }
    } catch (err) {
      setError(err.message || 'Invalid credentials or server error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* Left Brand Panel */}
      <div className="auth-brand-pane">
        <div className="auth-brand-header">
          <div className="sidebar-logo-icon">
            <TrendingUp size={22} color="#ffffff" />
          </div>
          <span className="auth-brand-title">Shoplytics</span>
        </div>

        <div className="auth-hero-text">
          <h2>Precision Financial & E-Commerce Analytics</h2>
          <p>
            Track multi-period gross margins, real-time operating expenses, and order fulfillment in a single unified dashboard.
          </p>
        </div>

        <div className="auth-feature-list">
          <div className="auth-feature-item">
            <div className="auth-feature-icon">
              <BarChart3 size={18} />
            </div>
            <div>
              <strong>Executive P&L Statements</strong>
              <p>Automated profit margin calculations and revenue forecasting.</p>
            </div>
          </div>

          <div className="auth-feature-item">
            <div className="auth-feature-icon">
              <Zap size={18} />
            </div>
            <div>
              <strong>Production-Grade MongoDB Cloud Sync</strong>
              <p>JWT authenticated API with bcrypt password encryption.</p>
            </div>
          </div>

          <div className="auth-feature-item">
            <div className="auth-feature-icon">
              <ShieldCheck size={18} />
            </div>
            <div>
              <strong>Brute-Force & Rate Limiting Protection</strong>
              <p>Secure token expiration and rate-limited authentication endpoints.</p>
            </div>
          </div>
        </div>

        <div className="auth-footer-note">
          © 2026 Shoplytics Analytics Inc. Enterprise Dashboard v2.0
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="auth-form-pane">
        <div className="auth-card">
          <div className="auth-header">
            <h3>Admin Sign In</h3>
            <p>
              Enter your authorized credentials to access your financial dashboard
            </p>
          </div>

          {error && (
            <div className="auth-error-box">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="auth-input-wrapper">
                <Mail size={16} className="auth-input-icon" />
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  className="form-input auth-input"
                  placeholder="admin@shoplytics.io"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label">Password</label>
              </div>
              <div className="auth-input-wrapper">
                <Lock size={16} className="auth-input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  autoComplete="current-password"
                  className="form-input auth-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="auth-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '0.5rem 0 1.25rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ accentColor: 'var(--brand-500)' }}
                />
                Remember me
              </label>

              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Protected by 256-bit SSL
              </span>
            </div>

            <button
              type="submit"
              className="btn-primary auth-submit-btn"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.775rem', color: 'var(--text-muted)' }}>
            Authorized personnel only. Access is monitored and logged.
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
