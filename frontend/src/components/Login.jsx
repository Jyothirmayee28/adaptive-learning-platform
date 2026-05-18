import React, { useState } from 'react';
import axios from 'axios';
import { Eye, EyeOff, Mail, Lock, User, AlertCircle } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

function Login({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [role, setRole] = useState('student');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (!form.email || !form.password) {
      setError('Email and password are required');
      setLoading(false);
      return;
    }

    if (isRegister && !form.name) {
      setError('Name is required for registration');
      setLoading(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    // Password validation (at least 6 characters)
    if (isRegister && form.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }
    
    try {
      // Handle Teacher and Admin roles (bypass backend)
      if (role === 'teacher') {
        onLogin({ 
          name: form.name || 'Teacher Demo', 
          email: form.email, 
          role: 'teacher',
          student_id: 0
        });
        return;
      }

      if (role === 'admin') {
        onLogin({ 
          name: form.name || 'Admin Demo', 
          email: form.email, 
          role: 'admin',
          student_id: 0
        });
        return;
      }

      // Handle Student role (needs backend)
      if (isRegister) {
       console.log('Attempting registration to:', `${API_URL}/api/students/register`);
       const registerRes = await axios.post(`${API_URL}/api/students/register`, {
          name: form.name,
          email: form.email,
          password: form.password
        });
        
        console.log('Registration successful:', registerRes.data);
        alert('Registration successful! Please login.');
        setIsRegister(false);
        setForm({ name: '', email: '', password: '' });
      } else {
        console.log('Attempting login to:', `${API_URL}/api/students/login`);
        console.log('With data:', { email: form.email });
        
        // Login existing student
        const loginRes = await axios.post(`${API_URL}/api/students/login`, {
          email: form.email,
          password: form.password
        });
        
        console.log('Login successful:', loginRes.data);
        const userData = loginRes.data;
        userData.role = 'student';
        onLogin(userData);
      }
    } catch (err) {
      console.error('Full error:', err);
      console.error('Error response:', err.response);
      console.error('Error message:', err.message);
      console.error('Error code:', err.code);
      
      if (err.response?.status === 401) {
        setError('Invalid email or password');
      } else if (err.response?.status === 400) {
        setError(err.response.data.detail || 'Email already registered');
      } else if (err.code === 'ERR_NETWORK' || err.message === 'Network Error') {
        setError('Cannot connect to server. Make sure backend is running at http://127.0.0.1:8000');
      } else {
        setError(`Error: ${err.response?.data?.detail || err.message || 'Something went wrong'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setResetMessage('');
    
    if (!resetEmail) {
      setResetMessage('Please enter your email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(resetEmail)) {
      setResetMessage('Please enter a valid email address');
      return;
    }

    // Mock password reset (replace with actual API call)
    setTimeout(() => {
      setResetMessage('Password reset link sent to your email!');
      setTimeout(() => {
        setShowForgotPassword(false);
        setResetEmail('');
        setResetMessage('');
      }, 2000);
    }, 1000);
  };

  if (showForgotPassword) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <button 
            onClick={() => setShowForgotPassword(false)}
            style={styles.backButton}
          >
            ← Back to Login
          </button>

          <h1 style={styles.title}>Reset Password</h1>
          <p style={styles.subtitle}>Enter your email to receive a reset link</p>

          <form onSubmit={handleForgotPassword} style={styles.form}>
            <div style={styles.inputGroup}>
              <Mail style={styles.inputIcon} size={20} />
              <input
                style={styles.input}
                type="email"
                placeholder="Email Address"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                required
              />
            </div>

            {resetMessage && (
              <div style={{
                ...styles.message,
                backgroundColor: resetMessage.includes('sent') ? '#10B981' : '#EF4444'
              }}>
                {resetMessage}
              </div>
            )}

            <button 
              type="submit" 
              style={styles.button}
            >
              Send Reset Link
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>🎓 LearnAI Platform</h1>
          <p style={styles.subtitle}>AI-powered Python, Data Science & ML Learning</p>
        </div>

        {/* Role Toggle */}
        <div style={styles.roleToggle}>
          <button
            type="button"
            style={{ 
              ...styles.roleBtn, 
              ...(role === 'student' ? styles.roleActive : {}) 
            }}
            onClick={() => setRole('student')}
          >
            👨‍🎓 Student
          </button>
          <button
            type="button"
            style={{ 
              ...styles.roleBtn, 
              ...(role === 'teacher' ? styles.roleActive : {}) 
            }}
            onClick={() => setRole('teacher')}
          >
            👨‍🏫 Teacher
          </button>
          <button
            type="button"
            style={{ 
              ...styles.roleBtn, 
              ...(role === 'admin' ? styles.roleActive : {}) 
            }}
            onClick={() => setRole('admin')}
          >
            👑 Admin
          </button>
        </div>

        {/* Login/Register Toggle */}
        {role === 'student' && (
          <div style={styles.tabToggle}>
            <span
              style={{ 
                ...styles.tab, 
                ...(isRegister ? {} : styles.tabActive) 
              }}
              onClick={() => {
                setIsRegister(false);
                setError('');
              }}
            >
              Login
            </span>
            <span
              style={{ 
                ...styles.tab, 
                ...(isRegister ? styles.tabActive : {}) 
              }}
              onClick={() => {
                setIsRegister(true);
                setError('');
              }}
            >
              Register
            </span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          {isRegister && role === 'student' && (
            <div style={styles.inputGroup}>
              <User style={styles.inputIcon} size={20} />
              <input
                style={styles.input}
                placeholder="Full Name *"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required={isRegister}
              />
            </div>
          )}

          <div style={styles.inputGroup}>
            <Mail style={styles.inputIcon} size={20} />
            <input
              style={styles.input}
              type="email"
              placeholder="Email Address *"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <Lock style={styles.inputIcon} size={20} />
            <input
              style={styles.input}
              type={showPassword ? 'text' : 'password'}
              placeholder="Password *"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={styles.eyeButton}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {isRegister && role === 'student' && (
            <div style={styles.passwordHint}>
              <AlertCircle size={14} style={{ marginRight: '6px' }} />
              Password must be at least 6 characters long
            </div>
          )}

          {/* Forgot Password Link */}
          {!isRegister && role === 'student' && (
            <div style={styles.forgotPasswordContainer}>
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                style={styles.forgotPasswordLink}
              >
                Forgot Password?
              </button>
            </div>
          )}

          {error && (
            <div style={styles.error}>
              <AlertCircle size={16} style={{ marginRight: '8px' }} />
              {error}
            </div>
          )}

          <button 
            type="submit"
            style={styles.button} 
            disabled={loading}
          >
            {loading ? (
              '⏳ Please wait...'
            ) : (
              role === 'admin' ? '👑 Enter as Admin' :
              role === 'teacher' ? '👨‍🏫 Enter as Teacher' : 
              (isRegister ? '✨ Create Account' : '🚀 Login')
            )}
          </button>
        </form>

        {/* Terms and Privacy */}
        {isRegister && (
          <p style={styles.terms}>
            By registering, you agree to our{' '}
            <a href="#" style={styles.link}>Terms of Service</a> and{' '}
            <a href="#" style={styles.link}>Privacy Policy</a>
          </p>
        )}

        {/* Help Text */}
        {role === 'admin' && !isRegister && (
          <p style={styles.hint}>
            💡 Admin: Enter any credentials to continue
          </p>
        )}

        {role === 'teacher' && !isRegister && (
          <p style={styles.hint}>
            💡 Teacher: Enter any credentials to continue
          </p>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    padding: '20px',
  },
  card: {
    background: 'white',
    borderRadius: '20px',
    padding: '48px',
    width: '100%',
    maxWidth: '480px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
  },
  header: {
    textAlign: 'center',
    marginBottom: '32px',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: '8px',
    letterSpacing: '-0.5px',
  },
  subtitle: {
    fontSize: '14px',
    color: '#64748B',
    fontWeight: '400',
  },
  roleToggle: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '8px',
    marginBottom: '24px',
    padding: '8px',
    background: '#F8FAFC',
    borderRadius: '12px',
  },
  roleBtn: {
    padding: '12px 8px',
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
    borderRadius: '8px',
    transition: 'all 0.2s ease',
    color: '#64748B',
  },
  roleActive: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
  },
  tabToggle: {
    display: 'flex',
    marginBottom: '24px',
    gap: '24px',
    justifyContent: 'center',
  },
  tab: {
    cursor: 'pointer',
    color: '#94A3B8',
    fontSize: '15px',
    paddingBottom: '8px',
    fontWeight: '500',
    transition: 'all 0.2s ease',
  },
  tabActive: {
    color: '#667eea',
    borderBottom: '3px solid #667eea',
    fontWeight: '600',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  inputGroup: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: '16px',
    color: '#94A3B8',
    pointerEvents: 'none',
  },
  input: {
    width: '100%',
    padding: '14px 16px 14px 48px',
    border: '1px solid #E2E8F0',
    borderRadius: '12px',
    fontSize: '15px',
    boxSizing: 'border-box',
    transition: 'all 0.2s ease',
    fontFamily: 'inherit',
    outline: 'none',
  },
  eyeButton: {
    position: 'absolute',
    right: '16px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#94A3B8',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'color 0.2s ease',
  },
  passwordHint: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '12px',
    color: '#64748B',
    padding: '8px 12px',
    background: '#F1F5F9',
    borderRadius: '8px',
  },
  forgotPasswordContainer: {
    textAlign: 'right',
    marginTop: '-8px',
  },
  forgotPasswordLink: {
    background: 'none',
    border: 'none',
    color: '#667eea',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    padding: '0',
    textDecoration: 'none',
  },
  error: {
    display: 'flex',
    alignItems: 'center',
    color: '#EF4444',
    fontSize: '13px',
    padding: '12px',
    background: '#FEE2E2',
    borderRadius: '8px',
    fontWeight: '500',
  },
  message: {
    padding: '12px',
    borderRadius: '8px',
    fontSize: '14px',
    color: 'white',
    fontWeight: '500',
    textAlign: 'center',
  },
  button: {
    width: '100%',
    padding: '16px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '8px',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
  },
  backButton: {
    background: 'none',
    border: 'none',
    color: '#667eea',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    padding: '8px 0',
    marginBottom: '20px',
  },
  terms: {
    fontSize: '12px',
    color: '#64748B',
    textAlign: 'center',
    marginTop: '16px',
    lineHeight: '1.6',
  },
  link: {
    color: '#667eea',
    textDecoration: 'none',
    fontWeight: '600',
  },
  hint: {
    marginTop: '16px',
    fontSize: '13px',
    color: '#64748B',
    textAlign: 'center',
    background: '#F8FAFC',
    padding: '12px',
    borderRadius: '8px',
    fontWeight: '500',
  },
};

export default Login;