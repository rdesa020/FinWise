import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './style.css';

function SignUp() {
  const [form, setForm] = useState({ email: '', password: '', confirmPassword: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL || ''}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      if (response.ok) {
        navigate('/signin');
      } else {
        setErrorMessage('Error creating account. Email may already be in use.');
      }
    } catch (error) {
      setErrorMessage('Error creating account. Please try again.');
      console.error('Sign up error:', error);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon">
            <img
              src="/FINWISE.png"
              alt="FinWise"
              onError={e => { e.target.style.display = 'none'; }}
            />
          </div>
          <h1>Create account</h1>
          <p className="auth-subtitle">Start tracking your finances today</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="auth-field">
            <label>Email</label>
            <div className="auth-input-wrapper">
              <span className="auth-input-icon">✉</span>
              <input
                className="auth-input"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
              />
            </div>
          </div>

          <div className="auth-field">
            <label>Password</label>
            <div className="auth-input-wrapper">
              <span className="auth-input-icon">🔒</span>
              <input
                className="auth-input"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
              />
            </div>
          </div>

          <div className="auth-field">
            <label>Confirm Password</label>
            <div className="auth-input-wrapper">
              <span className="auth-input-icon">🔒</span>
              <input
                className="auth-input"
                type="password"
                placeholder="••••••••"
                value={form.confirmPassword}
                onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
              />
            </div>
          </div>

          {errorMessage && <p className="auth-error">{errorMessage}</p>}

          <button type="submit" className="auth-btn">Create account</button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/signin">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
