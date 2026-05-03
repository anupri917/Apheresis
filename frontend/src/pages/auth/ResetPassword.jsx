import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Timer, CheckCircle } from 'lucide-react';

const ResetPassword = () => {
  const [formData, setFormData] = useState({ token: '', newPassword: '', confirmPassword: '' });
  const [timeLeft, setTimeLeft] = useState(120);
  const [status, setStatus] = useState({ type: '', msg: '' });
  const navigate = useNavigate();

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      setStatus({ type: 'error', msg: 'Passwords do not match' });
      return;
    }
    if (timeLeft <= 0) {
      setStatus({ type: 'error', msg: 'Token expired. Please request a new one.' });
      return;
    }

    try {
      await api.post('/auth/reset-password', {
        token: formData.token,
        newPassword: formData.newPassword
      });
      setStatus({ type: 'success', msg: 'Password reset successful! Redirecting to login...' });
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setStatus({ type: 'error', msg: err.response?.data || 'Reset failed' });
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 70px)', padding: '2rem', background: 'var(--bg-color)' }}>
      <div className="card glass" style={{ width: '100%', maxWidth: '450px', padding: '2.5rem', borderRadius: '24px' }}>
        <h2 style={{ textAlign: 'center', color: 'var(--primary-dark)', fontSize: '2rem', marginBottom: '1rem' }}>Reset Password</h2>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          color: timeLeft < 30 ? 'var(--danger)' : 'var(--primary)',
          fontWeight: 'bold',
          marginBottom: '2rem',
          fontSize: '1.2rem'
        }}>
          <Timer size={20} /> Time Remaining: {formatTime(timeLeft)}
        </div>

        {status.msg && (
          <div style={{
            background: status.type === 'success' ? 'var(--success)' : 'var(--danger)',
            color: 'white',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }}>
            {status.type === 'success' && <CheckCircle size={18} />} {status.msg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.2rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Reset Token</label>
            <input
              type="text"
              value={formData.token}
              onChange={(e) => setFormData({...formData, token: e.target.value})}
              required
              placeholder="Paste token from email"
              style={{ padding: '12px', width: '100%' }}
            />
          </div>

          <div style={{ marginBottom: '1.2rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>New Password</label>
            <div style={{ position: 'relative' }}>
              <Lock style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
              <input
                type="password"
                value={formData.newPassword}
                onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                required
                placeholder="••••••••"
                style={{ padding: '12px 12px 12px 40px', width: '100%' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Confirm Password</label>
            <div style={{ position: 'relative' }}>
              <Lock style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                required
                placeholder="••••••••"
                style={{ padding: '12px 12px 12px 40px', width: '100%' }}
              />
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={timeLeft <= 0} style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}>
            Reset Password
          </button>
        </form>

        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <Link to="/forgot-password" style={{ color: 'var(--primary)', textDecoration: 'none' }}>
            Request a new token
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;