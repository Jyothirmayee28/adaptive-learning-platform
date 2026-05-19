import React from 'react';
import { Home, BookOpen, FileText, Target, BarChart3, Trophy, MessageSquare, MessageCircle, Map, Award, Clock, LogOut } from 'lucide-react';

function Sidebar({ activeView, setActiveView, user, onLogout }) {
  const menuItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'roadmap', icon: Map, label: 'Learning Roadmap' },
    { id: 'quiz', icon: Target, label: 'Quiz Assessment' },
    { id: 'progress', icon: BarChart3, label: 'Progress Analytics' },
    { id: 'achievements', icon: Award, label: 'Achievements' },
    { id: 'spaced', icon: Clock, label: 'Spaced Repetition' },
    { id: 'chat', icon: MessageSquare, label: 'AI Study Buddy' },
    { id: 'curriculum', icon: BookOpen, label: 'Full Curriculum' },
    { id: 'content-library', icon: BookOpen, label: 'Content Library' },
  ];

  return (
    <div style={styles.sidebar}>
      {/* Logo/Header with Gradient */}
      <div style={styles.header}>
        <div style={styles.logoContainer}>
          <span style={styles.logo}>🎓</span>
          <span style={styles.brandName}>LearnAI</span>
        </div>
      </div>

      {/* User Info Card */}
      <div style={styles.userSection}>
        <div style={styles.avatar}>
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div style={styles.userInfo}>
          <div style={styles.userName}>{user.name}</div>
          <div style={styles.userRole}>✨ Premium Student</div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav style={styles.nav}>
        <div style={styles.navLabel}>MAIN MENU</div>
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            style={{
              ...styles.menuItem,
              ...(activeView === item.id ? styles.menuItemActive : {})
            }}
            onMouseEnter={(e) => {
              if (activeView !== item.id) {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                e.currentTarget.style.transform = 'translateX(4px)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeView !== item.id) {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.transform = 'translateX(0)';
              }
            }}
          >
            <item.icon size={18} style={styles.menuIcon} />
            <span style={styles.menuLabel}>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Logout Button */}
      <button onClick={onLogout} style={styles.logoutButton}>
        <LogOut size={18} style={styles.logoutIcon} />
        <span>Logout</span>
      </button>
    </div>
  );
}

const styles = {
  sidebar: {
    width: '280px',
    height: '100vh',
    background: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    flexDirection: 'column',
    padding: '16px 12px',
    position: 'fixed',
    left: 0,
    top: 0,
    overflowY: 'auto',
    boxShadow: '4px 0 24px rgba(0, 0, 0, 0.1)',
  },
  header: {
    marginBottom: '16px',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 14px',
    background: 'rgba(255, 255, 255, 0.15)',
    borderRadius: '14px',
    backdropFilter: 'blur(10px)',
  },
  logo: {
    fontSize: '28px',
  },
  brandName: {
    fontSize: '22px',
    fontWeight: '700',
    color: 'white',
    letterSpacing: '-0.5px',
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 14px',
    background: 'rgba(255, 255, 255, 0.15)',
    borderRadius: '14px',
    marginBottom: '16px',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
  },
  avatar: {
    width: '42px',
    height: '42px',
    borderRadius: '50%',
    background: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#667eea',
    fontSize: '18px',
    fontWeight: '700',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: '15px',
    fontWeight: '600',
    color: 'white',
    marginBottom: '2px',
  },
  userRole: {
    fontSize: '11px',
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: '500',
  },
  nav: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    overflowY: 'auto',
  },
  navLabel: {
    fontSize: '10px',
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.6)',
    letterSpacing: '1px',
    padding: '6px 14px',
    marginBottom: '4px',
  },
  menuItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 14px',
    background: 'transparent',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: '14px',
    fontWeight: '500',
    textAlign: 'left',
  },
  menuItemActive: {
    background: 'rgba(255, 255, 255, 0.25)',
    color: 'white',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    fontWeight: '600',
  },
  menuIcon: {
    flexShrink: 0,
  },
  menuLabel: {
    flex: 1,
  },
  logoutButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    padding: '12px 14px',
    background: 'rgba(239, 68, 68, 0.2)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '10px',
    cursor: 'pointer',
    color: 'white',
    fontSize: '14px',
    fontWeight: '600',
    marginTop: '12px',
    transition: 'all 0.2s ease',
  },
  logoutIcon: {
    flexShrink: 0,
  },
};

export default Sidebar;