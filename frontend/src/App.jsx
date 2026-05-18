import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import StudentDashboard from './components/StudentDashboard';
import TeacherDashboard from './components/TeacherDashboard';
import AdminDashboard from './components/AdminDashboard';

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route 
          path="/login" 
          element={
            user ? (
              // If already logged in, redirect to appropriate dashboard
              user.role === 'teacher' ? <Navigate to="/teacher" /> :
              user.role === 'admin' ? <Navigate to="/admin" /> :
              <Navigate to="/student" />
            ) : (
              <Login onLogin={handleLogin} />
            )
          } 
        />

        {/* Protected Routes - Redirect to login if not authenticated */}
        <Route 
          path="/student" 
          element={
            user && user.role === 'student' ? (
              <StudentDashboard user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          } 
        />

        <Route 
          path="/teacher" 
          element={
            user && user.role === 'teacher' ? (
              <TeacherDashboard user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          } 
        />

        <Route 
          path="/admin" 
          element={
            user && user.role === 'admin' ? (
              <AdminDashboard user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          } 
        />

        {/* Catch all - redirect to landing page */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;