import React, { useState } from 'react';
import Login from './components/Login';
import StudentDashboard from './components/StudentDashboard';
import TeacherDashboard from './components/TeacherDashboard';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  const handleLogin = (userData, userRole) => {
    setUser(userData);
    setRole(userRole);
  };

  const handleLogout = () => {
    setUser(null);
    setRole(null);
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="App">
      {role === 'student' ? (
        <StudentDashboard user={user} onLogout={handleLogout} />
      ) : (
        <TeacherDashboard user={user} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;