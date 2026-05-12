import React, { useState } from 'react';
import axios from 'axios';

const API = 'http://127.0.0.1:8000';

function Login({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [role, setRole] = useState('student');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      if (role === 'teacher') {
        onLogin({ name: 'Teacher', email: form.email }, 'teacher');
        return;
      }
      if (isRegister) {
        const res = await axios.post(`${API}/api/students/register`, form);
        onLogin({ ...res.data, email: form.email }, 'student');
      } else {
        const res = await axios.post(`${API}/api/students/login`, {
          email: form.email,
          password: form.password
        });
        onLogin({ ...res.data, email: form.email }, 'student');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Adaptive Learning Engine</h1>
        <p style={styles.subtitle}>AI-powered personalized learning</p>

        <div style={styles.roleToggle}>
          <button
            style={{ ...styles.roleBtn, ...(role === 'student' ? styles.roleActive : {}) }}
            onClick={() => setRole('student')}
          >Student</button>
          <button
            style={{ ...styles.roleBtn, ...(role === 'teacher' ? styles.roleActive : {}) }}
            onClick={() => setRole('teacher')}
          >Teacher</button>
        </div>

        {role === 'student' && (
          <div style={styles.tabToggle}>
            <span
              style={{ ...styles.tab, ...(isRegister ? {} : styles.tabActive) }}
              onClick={() => setIsRegister(false)}
            >Login</span>
            <span
              style={{ ...styles.tab, ...(isRegister ? styles.tabActive : {}) }}
              onClick={() => setIsRegister(true)}
            >Register</span>
          </div>
        )}

        {isRegister && role === 'student' && (
          <input
            style={styles.input}
            placeholder="Full Name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />
        )}

        <input
          style={styles.input}
          placeholder="Email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
        />
        <input
          style={styles.input}
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
        />

        {error && <p style={styles.error}>{error}</p>}

        <button style={styles.button} onClick={handleSubmit} disabled={loading}>
          {loading ? 'Please wait...' : (role === 'teacher' ? 'Enter as Teacher' : (isRegister ? 'Register' : 'Login'))}
        </button>
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
  },
  card: {
    background: 'white',
    borderRadius: '16px',
    padding: '40px',
    width: '400px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
  },
  title: {
    textAlign: 'center',
    color: '#333',
    marginBottom: '8px',
    fontSize: '24px',
  },
  subtitle: {
    textAlign: 'center',
    color: '#888',
    marginBottom: '24px',
    fontSize: '14px',
  },
  roleToggle: {
    display: 'flex',
    marginBottom: '20px',
    borderRadius: '8px',
    overflow: 'hidden',
    border: '1px solid #ddd',
  },
  roleBtn: {
    flex: 1,
    padding: '10px',
    border: 'none',
    background: 'white',
    cursor: 'pointer',
    fontSize: '14px',
  },
  roleActive: {
    background: '#667eea',
    color: 'white',
  },
  tabToggle: {
    display: 'flex',
    marginBottom: '20px',
    gap: '16px',
  },
  tab: {
    cursor: 'pointer',
    color: '#888',
    fontSize: '14px',
    paddingBottom: '4px',
  },
  tabActive: {
    color: '#667eea',
    borderBottom: '2px solid #667eea',
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    padding: '12px',
    marginBottom: '12px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '14px',
    boxSizing: 'border-box',
  },
  button: {
    width: '100%',
    padding: '14px',
    background: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer',
    marginTop: '8px',
  },
  error: {
    color: 'red',
    fontSize: '13px',
    marginBottom: '8px',
  },
};

export default Login;