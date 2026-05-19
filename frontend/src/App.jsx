import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import StudentDashboard from './components/StudentDashboard';
import TeacherDashboard from './components/TeacherDashboard';
import AdminDashboard from './components/AdminDashboard';

function ProtectedRoute({ children, allowedRoles, user }) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'student') return <Navigate to="/student" replace />;
    if (user.role === 'teacher') return <Navigate to="/teacher" replace />;
    if (user.role === 'admin') return <Navigate to="/admin" replace />;
    return <Navigate to="/login" replace />;
  }
  
  return children;
}
function AppContent() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    console.log('User logged in:', userData);
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    
    // Route based on role
    if (userData.role === 'student') {
      navigate('/student');
    } else if (userData.role === 'teacher') {
      navigate('/teacher');
    } else if (userData.role === 'admin') {
      navigate('/admin');
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login onLogin={handleLogin} />} />
      
      <Route 
        path="/student" 
        element={
          <ProtectedRoute allowedRoles={['student']} user={user}>
            <StudentDashboard user={user} onLogout={handleLogout} />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/teacher" 
        element={
          <ProtectedRoute allowedRoles={['teacher']} user={user}>
            <TeacherDashboard user={user} onLogout={handleLogout} />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute allowedRoles={['admin']} user={user}>
            <AdminDashboard user={user} onLogout={handleLogout} />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}

// Main App component - wraps everything in Router
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;