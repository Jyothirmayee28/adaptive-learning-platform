import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

function AdminDashboard({ user, onLogout }) {
  const [darkMode, setDarkMode] = useState(false);
  const [students, setStudents] = useState([]);
  const [analytics, setAnalytics] = useState({
    total_students: 0,
    avg_completion: 0,
    avg_score: 0,
    total_hours: 0,
    recent_activity: [],
    top_performers: []
  });
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      console.log('Fetching admin data...');
      
      const studentsRes = await axios.get(`${API}/api/admin/students`);
      console.log('Students data:', studentsRes.data);
      console.log('Students COUNT:', studentsRes.data.length);

      const analyticsRes = await axios.get(`${API}/api/admin/analytics`);
      console.log('Analytics data:', analyticsRes.data);
      console.log('FULL ANALYTICS:', JSON.stringify(analyticsRes.data, null, 2));

      setStudents(studentsRes.data);
      setAnalytics(analyticsRes.data);

      console.log('State after setting:', {
      students: studentsRes.data,
      analytics: analyticsRes.data
    });
    
    } catch (err) {
      console.error('Error loading admin data:', err);
      setAnalytics({ 
        total_students: 0, 
        avg_completion: 0, 
        avg_score: 0, 
        total_hours: 0,
        recent_activity: [],
        top_performers: []
      });
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const theme = darkMode ? darkTheme : lightTheme;

  if (loading) {
    return (
      <div style={{...styles.app, ...theme.background}}>
        <div style={styles.loading}>Loading admin dashboard...</div>
      </div>
    );
  }

  return (
    <div style={{...styles.app, ...theme.background}}>
      {/* Navigation Bar */}
      <nav style={{...styles.navbar, ...theme.navbar}}>
        <div style={styles.navContent}>
          <div style={styles.navLeft}>
            <div style={styles.logo}>
              <span style={styles.logoIcon}>🎓</span>
              <span style={{...styles.logoText, ...theme.text}}>LearnAI Admin</span>
            </div>
          </div>
          
          <div style={styles.navRight}>
            <button 
              style={{...styles.darkModeBtn, ...theme.card}}
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
            
            <div style={styles.adminBadge}>
              <span style={styles.adminIcon}>👑</span>
              <span style={{...styles.adminName, ...theme.text}}>{user.name}</span>
            </div>
            
            <button 
              style={{...styles.logoutBtn, ...theme.button}}
              onClick={onLogout}
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      <div style={styles.container}>
        {/* Stats Overview */}
        <div style={styles.statsGrid}>
          <StatCard
            icon="👥"
            label="Total Students"
            value={analytics.total_students}
            trend="+12%"
            theme={theme}
          />
          <StatCard
            icon="✅"
            label="Avg Completion"
            value={`${analytics.avg_completion}%`}
            trend="+5%"
            theme={theme}
          />
          <StatCard
            icon="⭐"
            label="Avg Score"
            value={`${analytics.avg_score}%`}
            trend="+8%"
            theme={theme}
          />
          <StatCard
            icon="⏱️"
            label="Total Hours"
            value={analytics.total_hours}
            trend="+15%"
            theme={theme}
          />
        </div>

        {/* Tab Navigation */}
        <div style={{...styles.tabNav, ...theme.card}}>
          <button
            style={activeTab === 'overview' ? {...styles.tabActive, ...theme.tabActive} : {...styles.tab, ...theme.tab}}
            onClick={() => setActiveTab('overview')}
          >
            📊 Overview
          </button>
          <button
            style={activeTab === 'students' ? {...styles.tabActive, ...theme.tabActive} : {...styles.tab, ...theme.tab}}
            onClick={() => setActiveTab('students')}
          >
            👥 Students
          </button>
          <button
            style={activeTab === 'performance' ? {...styles.tabActive, ...theme.tabActive} : {...styles.tab, ...theme.tab}}
            onClick={() => setActiveTab('performance')}
          >
            📈 Performance
          </button>
          <button
            style={activeTab === 'settings' ? {...styles.tabActive, ...theme.tabActive} : {...styles.tab, ...theme.tab}}
            onClick={() => setActiveTab('settings')}
          >
            ⚙️ Settings
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <OverviewTab analytics={analytics} theme={theme} />
        )}

        {activeTab === 'students' && (
          <StudentsTab 
            students={students} 
            theme={theme}
            onSelectStudent={setSelectedStudent}
          />
        )}

        {activeTab === 'performance' && (
          <PerformanceTab students={students} analytics={analytics} theme={theme} />
        )}

        {activeTab === 'settings' && (
          <SettingsTab theme={theme} />
        )}
      </div>

      <style>{fontImport + animations}</style>
    </div>
  );
}

// Overview Tab Component
function OverviewTab({ analytics, theme }) {
  return (
    <div style={styles.tabContent}>
      <div style={styles.gridTwoColumn}>
        <div style={{...styles.card, ...theme.card}}>
          <h3 style={{...styles.cardTitle, ...theme.text}}>Recent Activity</h3>
          <div style={styles.activityList}>
            {analytics.recent_activity && analytics.recent_activity.length > 0 ? (
              analytics.recent_activity.map((activity, i) => (
                <div key={i} style={{...styles.activityItem, ...theme.activityItem}}>
                  <span style={styles.activityIcon}>✅</span>
                  <div style={styles.activityContent}>
                    <p style={{...styles.activityText, ...theme.text}}>{activity.student_name}</p>
                    <p style={{...styles.activityAction, ...theme.textMuted}}>{activity.action}</p>
                    <span style={{...styles.activityTime, ...theme.textMuted}}>{activity.timestamp}</span>
                  </div>
                  <div style={styles.activityScore}>{activity.score}%</div>
                </div>
              ))
            ) : (
              <div style={{...styles.emptyState, ...theme.textMuted}}>
                No recent activity yet. Students will appear here after taking quizzes.
              </div>
            )}
          </div>
        </div>

        <div style={{...styles.card, ...theme.card}}>
          <h3 style={{...styles.cardTitle, ...theme.text}}>Top Performers</h3>
          <div style={styles.leaderboard}>
            {analytics.top_performers && analytics.top_performers.length > 0 ? (
              analytics.top_performers.map((performer, i) => (
                <div key={i} style={{...styles.leaderboardItem, ...theme.leaderboardItem}}>
                  <div style={styles.rank}>{i + 1}</div>
                  <div style={styles.studentInfo}>
                    <p style={{...styles.studentName, ...theme.text}}>{performer.name}</p>
                    <p style={{...styles.studentMeta, ...theme.textMuted}}>
                      {performer.completed_topics} topics • {performer.avg_score}%
                    </p>
                  </div>
                  <div style={styles.trophy}>🏆</div>
                </div>
              ))
            ) : (
              <div style={{...styles.emptyState, ...theme.textMuted}}>
                No top performers yet. Data will appear as students complete topics.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Students Tab Component
function StudentsTab({ students, theme, onSelectStudent }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || student.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div style={styles.tabContent}>
      {/* Search and Filter */}
      <div style={{...styles.toolbar, ...theme.card}}>
        <input
          type="text"
          placeholder="Search students..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{...styles.searchInput, ...theme.input}}
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{...styles.filterSelect, ...theme.input}}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Students Table */}
      <div style={{...styles.tableCard, ...theme.card}}>
        {filteredStudents.length > 0 ? (
          <table style={styles.table}>
            <thead>
              <tr style={{...styles.tableHeader, ...theme.tableHeader}}>
                <th style={styles.th}>Student</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Progress</th>
                <th style={styles.th}>Avg Score</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student, i) => (
                <tr key={i} style={{...styles.tableRow, ...theme.tableRow}}>
                  <td style={{...styles.td, ...theme.text}}>
                    <div style={styles.studentCell}>
                      <div style={styles.avatar}>{student.name.charAt(0)}</div>
                      {student.name}
                    </div>
                  </td>
                  <td style={{...styles.td, ...theme.textMuted}}>{student.email}</td>
                  <td style={{...styles.td, ...theme.text}}>
                    <div style={styles.progressBar}>
                      <div 
                        style={{
                          ...styles.progressFill, 
                          width: `${(student.completed_topics / 14) * 100}%`
                        }}
                      ></div>
                    </div>
                    <span style={{...styles.progressText, ...theme.textMuted}}>
                      {student.completed_topics}/14
                    </span>
                  </td>
                  <td style={{...styles.td, ...theme.text}}>{student.avg_score}%</td>
                  <td style={{...styles.td}}>
                    <span style={student.status === 'active' ? styles.statusActive : styles.statusInactive}>
                      {student.status}
                    </span>
                  </td>
                  <td style={{...styles.td}}>
                    <button 
                      style={{...styles.actionBtn, ...theme.actionBtn}}
                      onClick={() => onSelectStudent(student)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={{...styles.emptyState, ...theme.textMuted, padding: '60px'}}>
            No students found
          </div>
        )}
      </div>
    </div>
  );
}

// Performance Tab Component
function PerformanceTab({ students, analytics, theme }) {
  return (
    <div style={styles.tabContent}>
      <div style={{...styles.card, ...theme.card}}>
        <h3 style={{...styles.cardTitle, ...theme.text}}>Performance Metrics</h3>
        <p style={{...styles.cardDescription, ...theme.textMuted}}>
          Aggregate performance data across all students
        </p>
        
        <div style={styles.metricsGrid}>
          <div style={{...styles.metricCard, ...theme.metricCard}}>
            <p style={{...styles.metricLabel, ...theme.textMuted}}>Average Completion Rate</p>
            <p style={{...styles.metricValue, ...theme.text}}>{analytics.avg_completion}%</p>
            <div style={styles.metricBar}>
              <div style={{...styles.metricFill, width: `${analytics.avg_completion}%`}}></div>
            </div>
          </div>

          <div style={{...styles.metricCard, ...theme.metricCard}}>
            <p style={{...styles.metricLabel, ...theme.textMuted}}>Average Quiz Score</p>
            <p style={{...styles.metricValue, ...theme.text}}>{analytics.avg_score}%</p>
            <div style={styles.metricBar}>
              <div style={{...styles.metricFill, width: `${analytics.avg_score}%`}}></div>
            </div>
          </div>

          <div style={{...styles.metricCard, ...theme.metricCard}}>
            <p style={{...styles.metricLabel, ...theme.textMuted}}>Total Study Hours</p>
            <p style={{...styles.metricValue, ...theme.text}}>{analytics.total_hours}h</p>
            <div style={styles.metricBar}>
              <div style={{...styles.metricFill, width: '74%'}}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Settings Tab Component
function SettingsTab({ theme }) {
  const [settings, setSettings] = useState({
    autoEnroll: true,
    emailNotifications: false,
    aiDifficulty: true
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedSettings = localStorage.getItem('adminSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleToggle = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    setSaved(false);
  };

  const handleSave = () => {
    localStorage.setItem('adminSettings', JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div style={styles.tabContent}>
      <div style={{...styles.card, ...theme.card}}>
        <div style={styles.settingsHeader}>
          <div>
            <h3 style={{...styles.cardTitle, ...theme.text}}>Platform Settings</h3>
            <p style={{...styles.cardDescription, ...theme.textMuted}}>
              Configure platform-wide preferences and behaviors
            </p>
          </div>
          {saved && (
            <div style={styles.savedBadge}>
              ✓ Settings Saved
            </div>
          )}
        </div>
        
        <div style={styles.settingsList}>
          <div style={{...styles.settingItem, ...theme.settingItem}}>
            <div>
              <h4 style={{...styles.settingTitle, ...theme.text}}>Auto-Enrollment</h4>
              <p style={{...styles.settingDesc, ...theme.textMuted}}>
                Automatically enroll new students in the curriculum
              </p>
            </div>
            <label style={styles.switchLabel}>
              <input 
                type="checkbox" 
                checked={settings.autoEnroll}
                onChange={() => handleToggle('autoEnroll')}
                style={styles.switchInput}
              />
              <span 
                style={{
                  ...styles.switchSlider,
                  background: settings.autoEnroll ? '#667eea' : '#CBD5E1'
                }}
              ></span>
            </label>
          </div>

          <div style={{...styles.settingItem, ...theme.settingItem}}>
            <div>
              <h4 style={{...styles.settingTitle, ...theme.text}}>Email Notifications</h4>
              <p style={{...styles.settingDesc, ...theme.textMuted}}>
                Send progress reports to students weekly
              </p>
            </div>
            <label style={styles.switchLabel}>
              <input 
                type="checkbox" 
                checked={settings.emailNotifications}
                onChange={() => handleToggle('emailNotifications')}
                style={styles.switchInput}
              />
              <span 
                style={{
                  ...styles.switchSlider,
                  background: settings.emailNotifications ? '#667eea' : '#CBD5E1'
                }}
              ></span>
            </label>
          </div>

          <div style={{...styles.settingItem, ...theme.settingItem}}>
            <div>
              <h4 style={{...styles.settingTitle, ...theme.text}}>AI Difficulty Adjustment</h4>
              <p style={{...styles.settingDesc, ...theme.textMuted}}>
                Allow AI to automatically adjust difficulty levels
              </p>
            </div>
            <label style={styles.switchLabel}>
              <input 
                type="checkbox" 
                checked={settings.aiDifficulty}
                onChange={() => handleToggle('aiDifficulty')}
                style={styles.switchInput}
              />
              <span 
                style={{
                  ...styles.switchSlider,
                  background: settings.aiDifficulty ? '#667eea' : '#CBD5E1'
                }}
              ></span>
            </label>
          </div>
        </div>

        <button 
          style={{...styles.saveButton, ...theme.primaryButton}}
          onClick={handleSave}
          onMouseEnter={(e) => e.target.style.opacity = '0.9'}
          onMouseLeave={(e) => e.target.style.opacity = '1'}
        >
          💾 Save Settings
        </button>
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({ icon, label, value, trend, theme }) {
  return (
    <div 
      style={{...styles.statCard, ...theme.card}}
      onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
    >
      <div style={styles.statHeader}>
        <span style={styles.statIcon}>{icon}</span>
        <span style={styles.trendPositive}>{trend}</span>
      </div>
      <p style={{...styles.statValue, ...theme.text}}>{value}</p>
      <p style={{...styles.statLabel, ...theme.textMuted}}>{label}</p>
    </div>
  );
}

// Theme Objects
const lightTheme = {
  background: { background: '#FAFBFC' },
  navbar: { 
    background: 'rgba(255, 255, 255, 0.85)', 
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid rgba(0, 0, 0, 0.06)'
  },
  card: { 
    background: '#FFFFFF', 
    border: '1px solid rgba(0, 0, 0, 0.06)',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)'
  },
  text: { color: '#0F172A' },
  textMuted: { color: '#64748B' },
  button: {
    background: 'rgba(0, 0, 0, 0.05)',
    color: '#64748B'
  },
  input: {
    background: '#FFFFFF',
    border: '1px solid rgba(0, 0, 0, 0.1)',
    color: '#0F172A'
  },
  tab: {
    color: '#64748B'
  },
  tabActive: {
    color: '#667eea',
    borderBottom: '2px solid #667eea'
  },
  tableHeader: {
    background: '#F8FAFC',
    borderBottom: '1px solid rgba(0, 0, 0, 0.06)'
  },
  tableRow: {
    borderBottom: '1px solid rgba(0, 0, 0, 0.04)'
  },
  activityItem: {
    background: '#F8FAFC'
  },
  leaderboardItem: {
    background: '#F8FAFC'
  },
  metricCard: {
    background: '#F8FAFC'
  },
  settingItem: {
    borderBottom: '1px solid rgba(0, 0, 0, 0.06)'
  },
  actionBtn: {
    background: 'rgba(102, 126, 234, 0.1)',
    color: '#667eea'
  },
  primaryButton: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
  }
};

const darkTheme = {
  background: { background: '#0B1120' },
  navbar: { 
    background: 'rgba(15, 23, 42, 0.85)', 
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.06)'
  },
  card: { 
    background: 'rgba(15, 23, 42, 0.6)', 
    border: '1px solid rgba(255, 255, 255, 0.08)',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
  },
  text: { color: '#F1F5F9' },
  textMuted: { color: '#94A3B8' },
  button: {
    background: 'rgba(255, 255, 255, 0.06)',
    color: '#94A3B8'
  },
  input: {
    background: 'rgba(15, 23, 42, 0.6)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    color: '#F1F5F9'
  },
  tab: {
    color: '#94A3B8'
  },
  tabActive: {
    color: '#667eea',
    borderBottom: '2px solid #667eea'
  },
  tableHeader: {
    background: 'rgba(15, 23, 42, 0.8)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
  },
  tableRow: {
    borderBottom: '1px solid rgba(255, 255, 255, 0.04)'
  },
  activityItem: {
    background: 'rgba(15, 23, 42, 0.4)'
  },
  leaderboardItem: {
    background: 'rgba(15, 23, 42, 0.4)'
  },
  metricCard: {
    background: 'rgba(15, 23, 42, 0.4)'
  },
  settingItem: {
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
  },
  actionBtn: {
    background: 'rgba(102, 126, 234, 0.15)',
    color: '#667eea'
  },
  primaryButton: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
  }
};

const fontImport = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
`;

const animations = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

// Styles
const styles = {
  app: {
    minHeight: '100vh',
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    transition: 'background 0.3s ease'
  },
  
  navbar: {
    position: 'sticky',
    top: 0,
    zIndex: 100,
    transition: 'all 0.3s ease'
  },
  navContent: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '16px 32px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  navLeft: {
    display: 'flex',
    alignItems: 'center'
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  logoIcon: {
    fontSize: '28px'
  },
  logoText: {
    fontSize: '20px',
    fontWeight: '700',
    letterSpacing: '-0.5px'
  },
  navRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  darkModeBtn: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '18px',
    transition: 'all 0.2s ease'
  },
  adminBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    background: 'rgba(102, 126, 234, 0.1)',
    borderRadius: '10px'
  },
  adminIcon: {
    fontSize: '18px'
  },
  adminName: {
    fontSize: '14px',
    fontWeight: '600'
  },
  logoutBtn: {
    padding: '8px 20px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s ease'
  },
  
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '32px'
  },
  
  loading: {
    textAlign: 'center',
    padding: '100px 20px',
    fontSize: '18px',
    color: '#667eea'
  },
  
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '24px',
    marginBottom: '32px'
  },
  statCard: {
    padding: '24px',
    borderRadius: '12px',
    transition: 'all 0.2s ease'
  },
  statHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px'
  },
  statIcon: {
    fontSize: '32px'
  },
  trendPositive: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#10B981'
  },
  statValue: {
    fontSize: '32px',
    fontWeight: '700',
    marginBottom: '4px',
    letterSpacing: '-0.5px'
  },
  statLabel: {
    fontSize: '14px',
    fontWeight: '500'
  },
  
  tabNav: {
    display: 'flex',
    gap: '8px',
    padding: '8px',
    borderRadius: '12px',
    marginBottom: '32px'
  },
  tab: {
    padding: '12px 24px',
    background: 'transparent',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.2s ease'
  },
  tabActive: {
    padding: '12px 24px',
    background: 'transparent',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600'
  },
  
  tabContent: {
    animation: 'fadeIn 0.3s ease'
  },
  
  gridTwoColumn: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '24px'
  },
  
  card: {
    padding: '28px',
    borderRadius: '12px',
    transition: 'all 0.3s ease'
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '20px',
    letterSpacing: '-0.3px'
  },
  cardDescription: {
    fontSize: '14px',
    marginBottom: '24px'
  },
  
  activityList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  activityItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px',
    borderRadius: '10px'
  },
  activityIcon: {
    fontSize: '24px'
  },
  activityContent: {
    flex: 1
  },
  activityText: {
    fontSize: '14px',
    fontWeight: '600',
    margin: '0 0 2px 0'
  },
  activityAction: {
    fontSize: '13px',
    margin: '0 0 4px 0'
  },
  activityTime: {
    fontSize: '12px'
  },
  activityScore: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#10B981'
  },
  
  leaderboard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  leaderboardItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '16px',
    borderRadius: '10px'
  },
  rank: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: '700'
  },
  studentInfo: {
    flex: 1
  },
  studentName: {
    fontSize: '14px',
    fontWeight: '600',
    margin: '0 0 4px 0'
  },
  studentMeta: {
    fontSize: '12px',
    margin: 0
  },
  trophy: {
    fontSize: '24px'
  },
  
  emptyState: {
    textAlign: 'center',
    padding: '40px 20px',
    fontSize: '14px'
  },
  
  toolbar: {
    display: 'flex',
    gap: '16px',
    padding: '16px',
    borderRadius: '12px',
    marginBottom: '24px'
  },
  searchInput: {
    flex: 1,
    padding: '12px 16px',
    borderRadius: '10px',
    fontSize: '14px',
    outline: 'none'
  },
  filterSelect: {
    padding: '12px 16px',
    borderRadius: '10px',
    fontSize: '14px',
    outline: 'none',
    cursor: 'pointer'
  },
  
  tableCard: {
    padding: '0',
    borderRadius: '12px',
    overflow: 'hidden'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  tableHeader: {
    textAlign: 'left'
  },
  th: {
    padding: '16px 20px',
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  tableRow: {
    transition: 'all 0.2s ease'
  },
  td: {
    padding: '16px 20px',
    fontSize: '14px',
    fontWeight: '500'
  },
  studentCell: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  avatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: '600'
  },
  progressBar: {
    width: '100px',
    height: '6px',
    background: 'rgba(0, 0, 0, 0.1)',
    borderRadius: '10px',
    overflow: 'hidden',
    marginBottom: '4px'
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '10px'
  },
  progressText: {
    fontSize: '12px'
  },
  statusActive: {
    padding: '4px 12px',
    background: 'rgba(16, 185, 129, 0.1)',
    color: '#10B981',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'uppercase'
  },
  statusInactive: {
    padding: '4px 12px',
    background: 'rgba(239, 68, 68, 0.1)',
    color: '#EF4444',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'uppercase'
  },
  actionBtn: {
    padding: '6px 16px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
    transition: 'all 0.2s ease'
  },
  
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '20px'
  },
  metricCard: {
    padding: '20px',
    borderRadius: '10px'
  },
  metricLabel: {
    fontSize: '13px',
    marginBottom: '8px'
  },
  metricValue: {
    fontSize: '28px',
    fontWeight: '700',
    marginBottom: '12px',
    letterSpacing: '-0.5px'
  },
  metricBar: {
    width: '100%',
    height: '6px',
    background: 'rgba(0, 0, 0, 0.1)',
    borderRadius: '10px',
    overflow: 'hidden'
  },
  metricFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '10px'
  },
  
  settingsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '24px'
  },
  savedBadge: {
    padding: '8px 16px',
    background: '#10B981',
    color: 'white',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    animation: 'fadeIn 0.3s ease'
  },
  settingsList: {
    display: 'flex',
    flexDirection: 'column'
  },
  settingItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 0'
  },
  settingTitle: {
    fontSize: '16px',
    fontWeight: '600',
    margin: '0 0 4px 0'
  },
  settingDesc: {
    fontSize: '14px',
    margin: 0
  },
  switchLabel: {
    position: 'relative',
    display: 'inline-block',
    width: '48px',
    height: '26px',
    cursor: 'pointer'
  },
  switchInput: {
    opacity: 0,
    width: 0,
    height: 0
  },
  switchSlider: {
    position: 'absolute',
    cursor: 'pointer',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    transition: '0.3s',
    borderRadius: '26px'
  },
  saveButton: {
    marginTop: '32px',
    padding: '14px 28px',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '600',
    transition: 'all 0.2s ease'
  }
};

export default AdminDashboard;