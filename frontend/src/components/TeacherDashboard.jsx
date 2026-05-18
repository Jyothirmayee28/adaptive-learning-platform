import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ContentLibrary from './ContentLibrary';
import { 
  Users, TrendingUp, Award, AlertCircle, 
  Search, Download, BarChart3, Eye, TrendingDown,
  Calendar, Target, FileText, ArrowRight
} from 'lucide-react';

const API = 'http://127.0.0.1:8000';

function TeacherDashboard({ user, onLogout }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [activeView, setActiveView] = useState('overview'); // overview, analytics, students
  const [topicAnalytics, setTopicAnalytics] = useState([]);
  const [classOverview, setClassOverview] = useState(null);
  const [showContentLibrary, setShowContentLibrary] = useState(false);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [studentsRes, topicsRes, overviewRes] = await Promise.all([
        axios.get(`${API}/api/teacher/students`),
        axios.get(`${API}/api/teacher/topic-analytics`),
        axios.get(`${API}/api/teacher/class-overview`)
      ]);
      
      setStudents(studentsRes.data.students || []);
      setTopicAnalytics(topicsRes.data.topics || []);
      setClassOverview(overviewRes.data.overview || null);
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const classStats = {
    totalStudents: students.length,
    avgScore: students.length > 0 
      ? Math.round(students.reduce((sum, s) => sum + (s.average_score || 0), 0) / students.length)
      : 0,
    strugglingCount: students.filter(s => (s.average_score || 0) < 60).length,
    excellentCount: students.filter(s => (s.average_score || 0) >= 85).length,
    totalTopicsCompleted: students.reduce((sum, s) => sum + (s.completed_topics?.length || 0), 0)
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterStatus === 'struggling') return matchesSearch && (student.average_score || 0) < 60;
    if (filterStatus === 'excellent') return matchesSearch && (student.average_score || 0) >= 85;
    return matchesSearch;
  });

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Current Topic', 'Completed Topics', 'Average Score', 'Status'];
    const rows = students.map(s => [
      s.name,
      s.email,
      s.current_topic || 'Not started',
      s.completed_topics?.length || 0,
      s.average_score || 0,
      (s.average_score || 0) >= 85 ? 'Excellent' : (s.average_score || 0) >= 60 ? 'On Track' : 'Needs Help'
    ]);
    
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `students_report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (selectedStudent) {
    return (
      <StudentDetailView 
        student={selectedStudent}
        onBack={() => setSelectedStudent(null)}
        onLogout={onLogout}
      />
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>👨‍🏫 Teacher Dashboard</h1>
          <p style={styles.subtitle}>Monitor and track student progress</p>
        </div>
        <div style={styles.headerActions}>
          <button onClick={exportToCSV} style={styles.exportButton}>
            <Download size={18} />
            Export CSV
          </button>
          <button onClick={onLogout} style={styles.logoutButton}>
            Logout
          </button>
        </div>
      </div>

      {/* View Tabs */}
      <div style={styles.viewTabs}>
        <button
          onClick={() => setActiveView('overview')}
          style={{
            ...styles.viewTab,
            ...(activeView === 'overview' ? styles.viewTabActive : {})
          }}
        >
          📊 Overview
        </button>
        <button
          onClick={() => setActiveView('students')}
          style={{
            ...styles.viewTab,
            ...(activeView === 'students' ? styles.viewTabActive : {})
          }}
        >
          👥 Students
        </button>
        <button
          onClick={() => setActiveView('analytics')}
          style={{
            ...styles.viewTab,
            ...(activeView === 'analytics' ? styles.viewTabActive : {})
          }}
        >
          📈 Analytics
          </button>
    {/* ⬇️ ADD THIS NEW TAB ⬇️ */}
     <button
     onClick={() => setShowContentLibrary(true)}
     style={styles.viewTab}
     >
    📚 Content Library
        </button>
      </div>
      
      {/* Class Statistics Cards */}
      <div style={styles.statsGrid}>
        <StatCard 
          icon={<Users size={32} />}
          label="Total Students"
          value={classStats.totalStudents}
          color="#667eea"
        />
        <StatCard 
          icon={<TrendingUp size={32} />}
          label="Class Average"
          value={`${classStats.avgScore}%`}
          color="#10B981"
        />
        <StatCard 
          icon={<AlertCircle size={32} />}
          label="Need Help"
          value={classStats.strugglingCount}
          color="#EF4444"
        />
        <StatCard 
          icon={<Award size={32} />}
          label="Excellent"
          value={classStats.excellentCount}
          color="#F59E0B"
        />
      </div>

      {/* OVERVIEW VIEW */}
      {activeView === 'overview' && (
        <OverviewView 
          students={students}
          classOverview={classOverview}
          topicAnalytics={topicAnalytics}
        />
      )}
       {showContentLibrary && (
        <ContentLibrary onClose={() => setShowContentLibrary(false)} />
      )}
      {/* STUDENTS VIEW */}
      {activeView === 'students' && (
        <div>
          {/* Search and Filters */}
          <div style={styles.toolbar}>
            <div style={styles.searchBox}>
              <Search size={20} style={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search students by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={styles.searchInput}
              />
            </div>

            <div style={styles.filterButtons}>
              <button
                onClick={() => setFilterStatus('all')}
                style={{
                  ...styles.filterButton,
                  ...(filterStatus === 'all' ? styles.filterButtonActive : {})
                }}
              >
                All Students
              </button>
              <button
                onClick={() => setFilterStatus('struggling')}
                style={{
                  ...styles.filterButton,
                  ...(filterStatus === 'struggling' ? styles.filterButtonActive : {})
                }}
              >
                <AlertCircle size={16} />
                Need Help
              </button>
              <button
                onClick={() => setFilterStatus('excellent')}
                style={{
                  ...styles.filterButton,
                  ...(filterStatus === 'excellent' ? styles.filterButtonActive : {})
                }}
              >
                <Award size={16} />
                Excellent
              </button>
            </div>
          </div>

          {/* Students Table */}
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeader}>
                  <th style={styles.th}>Student</th>
                  <th style={styles.th}>Current Topic</th>
                  <th style={styles.th}>Completed</th>
                  <th style={styles.th}>Avg Score</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={styles.emptyState}>
                      No students found
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map(student => (
                    <StudentRow 
                      key={student.id}
                      student={student}
                      onViewDetails={() => setSelectedStudent(student)}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ANALYTICS VIEW */}
      {activeView === 'analytics' && (
        <AnalyticsView 
          topicAnalytics={topicAnalytics}
          students={students}
        />
      )}
    </div>
  );
}

// Overview View Component
function OverviewView({ students, classOverview, topicAnalytics }) {
  const strugglingTopics = topicAnalytics
    .filter(t => t.avg_score < 70)
    .sort((a, b) => a.avg_score - b.avg_score)
    .slice(0, 5);

  const recentActivity = classOverview?.recent_activity?.slice(0, 10) || [];

  return (
    <div style={styles.overviewGrid}>
      {/* Struggling Topics Alert */}
      <div style={styles.alertCard}>
        <h3 style={styles.cardTitle}>⚠️ Topics Students Struggle With</h3>
        {strugglingTopics.length === 0 ? (
          <p style={styles.emptyText}>No struggling topics - great job!</p>
        ) : (
          <div style={styles.strugglingList}>
            {strugglingTopics.map((topic, idx) => (
              <div key={idx} style={styles.strugglingItem}>
                <div style={styles.strugglingInfo}>
                  <span style={styles.strugglingTopic}>{topic.topic}</span>
                  <span style={styles.strugglingMeta}>
                    {topic.total_students} students • Avg: {topic.avg_score}%
                  </span>
                </div>
                <div style={styles.strugglingScore}>
                  <TrendingDown size={16} color="#EF4444" />
                  {topic.avg_score}%
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div style={styles.activityCard}>
        <h3 style={styles.cardTitle}>📋 Recent Activity</h3>
        {recentActivity.length === 0 ? (
          <p style={styles.emptyText}>No recent activity</p>
        ) : (
          <div style={styles.activityList}>
            {recentActivity.map((activity, idx) => (
              <div key={idx} style={styles.activityItem}>
                <div style={styles.activityIcon}>
                  {activity.passed ? '✅' : '❌'}
                </div>
                <div style={styles.activityContent}>
                  <p style={styles.activityText}>
                    <strong>{activity.student_name}</strong> {activity.passed ? 'passed' : 'attempted'} {activity.topic}
                  </p>
                  <p style={styles.activityMeta}>
                    Score: {activity.score}% • {new Date(activity.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Analytics View Component
function AnalyticsView({ topicAnalytics, students }) {
  return (
    <div>
      <h2 style={styles.sectionTitle}>📊 Topic Performance Analytics</h2>
      <div style={styles.analyticsGrid}>
        {topicAnalytics.length === 0 ? (
          <p style={styles.emptyText}>No analytics data available yet</p>
        ) : (
          topicAnalytics.map((topic, idx) => (
            <div key={idx} style={styles.topicCard}>
              <h4 style={styles.topicCardTitle}>{topic.topic}</h4>
              <div style={styles.topicStats}>
                <div style={styles.topicStat}>
                  <span style={styles.topicStatLabel}>Students</span>
                  <span style={styles.topicStatValue}>{topic.total_students}</span>
                </div>
                <div style={styles.topicStat}>
                  <span style={styles.topicStatLabel}>Avg Score</span>
                  <span style={{
                    ...styles.topicStatValue,
                    color: topic.avg_score >= 70 ? '#10B981' : '#EF4444'
                  }}>
                    {topic.avg_score}%
                  </span>
                </div>
                <div style={styles.topicStat}>
                  <span style={styles.topicStatLabel}>Pass Rate</span>
                  <span style={styles.topicStatValue}>{topic.completion_rate}%</span>
                </div>
              </div>
              <div style={styles.progressBar}>
                <div 
                  style={{
                    ...styles.progressFill,
                    width: `${topic.avg_score}%`,
                    background: topic.avg_score >= 70 ? '#10B981' : '#EF4444'
                  }}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({ icon, label, value, color }) {
  return (
    <div style={styles.statCard}>
      <div style={{...styles.statIcon, color: color}}>
        {icon}
      </div>
      <div style={styles.statContent}>
        <div style={styles.statValue}>{value}</div>
        <div style={styles.statLabel}>{label}</div>
      </div>
    </div>
  );
}

// Student Row Component
function StudentRow({ student, onViewDetails }) {
  const avgScore = student.average_score || 0;
  const completedCount = student.completed_topics?.length || 0;
  
  let status = 'On Track';
  let statusColor = '#10B981';
  
  if (avgScore < 60) {
    status = 'Needs Help';
    statusColor = '#EF4444';
  } else if (avgScore >= 85) {
    status = 'Excellent';
    statusColor = '#F59E0B';
  }

  return (
    <tr style={styles.tableRow}>
      <td style={styles.td}>
        <div style={styles.studentCell}>
          <div style={styles.avatar}>
            {student.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={styles.studentName}>{student.name}</div>
            <div style={styles.studentEmail}>{student.email}</div>
          </div>
        </div>
      </td>
      <td style={styles.td}>{student.current_topic || 'Not started'}</td>
      <td style={styles.td}>
        <span style={styles.badge}>{completedCount} topics</span>
      </td>
      <td style={styles.td}>
        <span style={{
          ...styles.scoreBadge,
          background: avgScore >= 85 ? '#D1FAE5' : avgScore >= 60 ? '#FEF3C7' : '#FEE2E2',
          color: avgScore >= 85 ? '#065F46' : avgScore >= 60 ? '#92400E' : '#991B1B'
        }}>
          {avgScore}%
        </span>
      </td>
      <td style={styles.td}>
        <span style={{...styles.statusBadge, background: statusColor}}>
          {status}
        </span>
      </td>
      <td style={styles.td}>
        <button onClick={onViewDetails} style={styles.viewButton}>
          <Eye size={16} />
          View
        </button>
      </td>
    </tr>
  );
}

// Student Detail View (keeping your existing one with small enhancements)
function StudentDetailView({ student, onBack, onLogout }) {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStudentAnalytics();
  }, [student.id]);

  const loadStudentAnalytics = async () => {
    try {
      const response = await axios.get(`${API}/api/teacher/student/${student.id}/analytics`);
      setAnalytics(response.data.analytics);
    } catch (err) {
      console.error('Error loading analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  const performanceHistory = student.performance_history || [];
  const recentAttempts = performanceHistory.slice(-10).reverse();

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.detailHeader}>
        <button onClick={onBack} style={styles.backButton}>
          ← Back to Dashboard
        </button>
        <button onClick={onLogout} style={styles.logoutButton}>
          Logout
        </button>
      </div>

      {/* Student Profile */}
      <div style={styles.profileCard}>
        <div style={styles.profileAvatar}>
          {student.name.charAt(0).toUpperCase()}
        </div>
        <div style={styles.profileInfo}>
          <h2 style={styles.profileName}>{student.name}</h2>
          <p style={styles.profileEmail}>{student.email}</p>
        </div>
        <div style={styles.profileStats}>
          <div style={styles.profileStat}>
            <div style={styles.profileStatValue}>{student.average_score || 0}%</div>
            <div style={styles.profileStatLabel}>Average Score</div>
          </div>
          <div style={styles.profileStat}>
            <div style={styles.profileStatValue}>{student.completed_topics?.length || 0}</div>
            <div style={styles.profileStatLabel}>Topics Completed</div>
          </div>
          <div style={styles.profileStat}>
            <div style={styles.profileStatValue}>{performanceHistory.length}</div>
            <div style={styles.profileStatLabel}>Total Attempts</div>
          </div>
        </div>
      </div>

      {/* Analytics Summary Cards */}
      {analytics && (
        <div style={styles.analyticsCards}>
          <div style={styles.analyticsCard}>
            <div style={styles.analyticsCardIcon}>📈</div>
            <div style={styles.analyticsCardContent}>
              <div style={styles.analyticsCardValue}>{analytics.pass_rate}%</div>
              <div style={styles.analyticsCardLabel}>Pass Rate</div>
            </div>
          </div>
          <div style={styles.analyticsCard}>
            <div style={styles.analyticsCardIcon}>⏱️</div>
            <div style={styles.analyticsCardContent}>
              <div style={styles.analyticsCardValue}>{analytics.avg_time_per_attempt} min</div>
              <div style={styles.analyticsCardLabel}>Avg Time/Quiz</div>
            </div>
          </div>
          <div style={styles.analyticsCard}>
            <div style={styles.analyticsCardIcon}>🎯</div>
            <div style={styles.analyticsCardContent}>
              <div style={styles.analyticsCardValue}>{analytics.mastered_topics?.length || 0}</div>
              <div style={styles.analyticsCardLabel}>Mastered Topics</div>
            </div>
          </div>
          <div style={styles.analyticsCard}>
            <div style={styles.analyticsCardIcon}>⚠️</div>
            <div style={styles.analyticsCardContent}>
              <div style={styles.analyticsCardValue}>{analytics.struggling_topics?.length || 0}</div>
              <div style={styles.analyticsCardLabel}>Struggling Topics</div>
            </div>
          </div>
        </div>
      )}

      {/* Current Progress */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>📚 Current Progress</h3>
        <div style={styles.progressCard}>
          <div style={styles.progressRow}>
            <span style={styles.progressLabel}>Current Topic:</span>
            <span style={styles.progressValue}>{student.current_topic}</span>
          </div>
          <div style={styles.progressRow}>
            <span style={styles.progressLabel}>Difficulty Level:</span>
            <span style={styles.progressValue}>{student.difficulty_level}/5</span>
          </div>
          <div style={styles.progressRow}>
            <span style={styles.progressLabel}>Completed Topics:</span>
            <div style={styles.topicsList}>
              {(student.completed_topics || []).map((topic, idx) => (
                <span key={idx} style={styles.topicChip}>{topic}</span>
              ))}
              {(student.completed_topics?.length || 0) === 0 && (
                <span style={styles.emptyText}>No topics completed yet</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Quiz Attempts */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>📊 Recent Quiz Attempts</h3>
        <div style={styles.attemptsContainer}>
          {recentAttempts.length === 0 ? (
            <div style={styles.emptyState}>No quiz attempts yet</div>
          ) : (
            recentAttempts.map((attempt, idx) => (
              <div key={idx} style={styles.attemptCard}>
                <div style={styles.attemptHeader}>
                  <span style={styles.attemptTopic}>{attempt.topic}</span>
                  <span style={{
                    ...styles.attemptScore,
                    background: attempt.passed ? '#D1FAE5' : '#FEE2E2',
                    color: attempt.passed ? '#065F46' : '#991B1B'
                  }}>
                    {attempt.score}%
                  </span>
                </div>
                <div style={styles.attemptDetails}>
                  <span style={styles.attemptDetail}>
                    ✓ {attempt.correct}/{attempt.total} correct
                  </span>
                  <span style={styles.attemptDetail}>
                    ⏱️ {attempt.time_spent} min
                  </span>
                  <span style={styles.attemptDetail}>
                    🔢 Attempt #{attempt.attempt_number}
                  </span>
                  <span style={styles.attemptDetail}>
                    📅 {new Date(attempt.timestamp).toLocaleDateString()}
                  </span>
                </div>
                {attempt.errors && attempt.errors.length > 0 && (
                  <div style={styles.errorsSection}>
                    <strong>Struggled with:</strong>
                    <ul style={styles.errorsList}>
                      {attempt.errors.slice(0, 3).map((error, i) => (
                        <li key={i} style={styles.errorItem}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Performance Insights */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>💡 Performance Insights</h3>
        <div style={styles.insightsGrid}>
          <InsightCard 
            title="Strengths"
            icon="🌟"
            items={getStrengths(student)}
            color="#10B981"
          />
          <InsightCard 
            title="Areas for Improvement"
            icon="📈"
            items={getWeaknesses(student)}
            color="#F59E0B"
          />
          <InsightCard 
            title="Recommendations"
            icon="💭"
            items={getRecommendations(student)}
            color="#667eea"
          />
        </div>
      </div>
    </div>
  );
}

// Insight Card Component
function InsightCard({ title, icon, items, color }) {
  return (
    <div style={styles.insightCard}>
      <div style={styles.insightHeader}>
        <span style={styles.insightIcon}>{icon}</span>
        <h4 style={styles.insightTitle}>{title}</h4>
      </div>
      <ul style={styles.insightList}>
        {items.map((item, idx) => (
          <li key={idx} style={styles.insightItem}>
            <span style={{...styles.insightBullet, background: color}}>•</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

// Helper Functions
function getStrengths(student) {
  const strengths = [];
  const avgScore = student.average_score || 0;
  
  if (avgScore >= 85) strengths.push('Consistently high performance');
  if ((student.completed_topics?.length || 0) >= 5) strengths.push('Good progress through curriculum');
  
  const recentScores = (student.performance_history || [])
    .slice(-5)
    .map(h => h.score);
  
  if (recentScores.length >= 3 && recentScores.every(s => s >= 70)) {
    strengths.push('Maintains passing grades');
  }
  
  if (strengths.length === 0) strengths.push('Shows dedication to learning');
  
  return strengths;
}

function getWeaknesses(student) {
  const weaknesses = [];
  const avgScore = student.average_score || 0;
  
  if (avgScore < 60) weaknesses.push('Below passing threshold - needs support');
  if ((student.completed_topics?.length || 0) < 3) weaknesses.push('Slow progress through topics');
  
  const recentFailures = (student.performance_history || [])
    .slice(-5)
    .filter(h => !h.passed).length;
  
  if (recentFailures >= 3) weaknesses.push('Multiple failed attempts recently');
  
  if (weaknesses.length === 0) weaknesses.push('Minor knowledge gaps in some areas');
  
  return weaknesses;
}

function getRecommendations(student) {
  const recommendations = [];
  const avgScore = student.average_score || 0;
  
  if (avgScore < 60) {
    recommendations.push('Schedule 1-on-1 tutoring session');
    recommendations.push('Review fundamental concepts');
  } else if (avgScore < 75) {
    recommendations.push('Provide additional practice problems');
    recommendations.push('Encourage more study time');
  } else {
    recommendations.push('Consider advancing to more challenging material');
    recommendations.push('Encourage peer tutoring opportunities');
  }
  
  return recommendations;
}

// Loading Screen
function LoadingScreen() {
  return (
    <div style={styles.loadingScreen}>
      <div style={styles.spinner}></div>
      <p>Loading dashboard...</p>
    </div>
  );
}

// Styles
const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #faf5ff 0%, #f3f4ff 50%, #faf5ff 100%)',
    padding: '40px',
    fontFamily: '"Inter", sans-serif',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
  },
  headerActions: {
    display: 'flex',
    gap: '12px',
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#1E1B4B',
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '16px',
    color: '#64748B',
  },
  exportButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 24px',
    background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  logoutButton: {
    padding: '12px 24px',
    background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  viewTabs: {
    display: 'flex',
    gap: '12px',
    marginBottom: '32px',
    background: 'white',
    padding: '8px',
    borderRadius: '16px',
    border: '1px solid #E2E8F0',
  },
  viewTab: {
    flex: 1,
    padding: '14px 24px',
    background: 'transparent',
    border: 'none',
    borderRadius: '12px',
    fontSize: '15px',
    fontWeight: '600',
    color: '#64748B',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  viewTabActive: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '24px',
    marginBottom: '40px',
  },
  statCard: {
    background: 'white',
    padding: '24px',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    border: '1px solid #E2E8F0',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    transition: 'all 0.3s',
  },
  statIcon: {
    flexShrink: 0,
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#1E1B4B',
    marginBottom: '4px',
  },
  statLabel: {
    fontSize: '14px',
    color: '#64748B',
    fontWeight: '500',
  },
  overviewGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '24px',
  },
  alertCard: {
    background: 'white',
    padding: '28px',
    borderRadius: '20px',
    border: '2px solid #FEE2E2',
    boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
  },
  activityCard: {
    background: 'white',
    padding: '28px',
    borderRadius: '20px',
    border: '1px solid #E2E8F0',
    boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1E1B4B',
    marginBottom: '20px',
  },
  strugglingList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  strugglingItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    background: '#FEF2F2',
    borderRadius: '12px',
    border: '1px solid #FEE2E2',
  },
  strugglingInfo: {
    flex: 1,
  },
  strugglingTopic: {
    display: 'block',
    fontSize: '15px',
    fontWeight: '600',
    color: '#1E1B4B',
    marginBottom: '4px',
  },
  strugglingMeta: {
    fontSize: '13px',
    color: '#64748B',
  },
  strugglingScore: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '16px',
    fontWeight: '700',
    color: '#EF4444',
  },
  activityList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  activityItem: {
    display: 'flex',
    gap: '16px',
    padding: '16px',
    background: '#F8FAFC',
    borderRadius: '12px',
    border: '1px solid #E2E8F0',
  },
  activityIcon: {
    fontSize: '24px',
    flexShrink: 0,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: '14px',
    color: '#1E1B4B',
    marginBottom: '4px',
  },
  activityMeta: {
    fontSize: '12px',
    color: '#64748B',
  },
  analyticsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
  },
  topicCard: {
    background: 'white',
    padding: '24px',
    borderRadius: '16px',
    border: '1px solid #E2E8F0',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
  },
  topicCardTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#1E1B4B',
    marginBottom: '16px',
  },
  topicStats: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '16px',
  },
  topicStat: {
    textAlign: 'center',
  },
  topicStatLabel: {
    display: 'block',
    fontSize: '12px',
    color: '#64748B',
    marginBottom: '4px',
  },
  topicStatValue: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1E1B4B',
  },
  progressBar: {
    width: '100%',
    height: '8px',
    background: '#F1F5F9',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: '4px',
    transition: 'width 0.3s',
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    gap: '20px',
    flexWrap: 'wrap',
  },
  searchBox: {
    flex: 1,
    minWidth: '300px',
    position: 'relative',
  },
  searchIcon: {
    position: 'absolute',
    left: '16px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#94A3B8',
  },
  searchInput: {
    width: '100%',
    padding: '12px 16px 12px 48px',
    border: '1px solid #E2E8F0',
    borderRadius: '12px',
    fontSize: '15px',
    outline: 'none',
    background: 'white',
  },
  filterButtons: {
    display: 'flex',
    gap: '12px',
  },
  filterButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 20px',
    background: 'white',
    border: '1px solid #E2E8F0',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#64748B',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  filterButtonActive: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: '1px solid #667eea',
  },
  tableContainer: {
    background: 'white',
    borderRadius: '16px',
    overflow: 'hidden',
    border: '1px solid #E2E8F0',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tableHeader: {
    background: '#F8FAFC',
  },
  th: {
    padding: '16px',
    textAlign: 'left',
    fontSize: '14px',
    fontWeight: '700',
    color: '#475569',
    borderBottom: '1px solid #E2E8F0',
  },
  tableRow: {
    transition: 'background 0.2s',
  },
  td: {
    padding: '16px',
    borderBottom: '1px solid #F1F5F9',
    fontSize: '14px',
    color: '#475569',
  },
  studentCell: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    fontWeight: '700',
  },
  studentName: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#1E1B4B',
  },
  studentEmail: {
    fontSize: '13px',
    color: '#94A3B8',
  },
  badge: {
    padding: '6px 12px',
    background: '#F1F5F9',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
    color: '#475569',
  },
  scoreBadge: {
    padding: '6px 12px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '700',
  },
  statusBadge: {
    padding: '6px 12px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
    color: 'white',
  },
  viewButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 16px',
    background: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  emptyState: {
    padding: '60px 20px',
    textAlign: 'center',
    color: '#94A3B8',
    fontSize: '15px',
  },
  emptyText: {
    fontSize: '14px',
    color: '#94A3B8',
    fontStyle: 'italic',
  },
  detailHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
  },
  backButton: {
    padding: '12px 24px',
    background: 'white',
    border: '1px solid #E2E8F0',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#475569',
    cursor: 'pointer',
  },
  profileCard: {
    background: 'white',
    padding: '32px',
    borderRadius: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
    marginBottom: '32px',
    border: '1px solid #E2E8F0',
    boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
  },
  profileAvatar: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '32px',
    fontWeight: '700',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1E1B4B',
    marginBottom: '4px',
  },
  profileEmail: {
    fontSize: '16px',
    color: '#64748B',
  },
  profileStats: {
    display: 'flex',
    gap: '32px',
  },
  profileStat: {
    textAlign: 'center',
  },
  profileStatValue: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#667eea',
    marginBottom: '4px',
  },
  profileStatLabel: {
    fontSize: '13px',
    color: '#64748B',
    fontWeight: '500',
  },
  analyticsCards: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '32px',
  },
  analyticsCard: {
    background: 'white',
    padding: '20px',
    borderRadius: '16px',
    border: '1px solid #E2E8F0',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  analyticsCardIcon: {
    fontSize: '32px',
  },
  analyticsCardContent: {
    flex: 1,
  },
  analyticsCardValue: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1E1B4B',
    marginBottom: '4px',
  },
  analyticsCardLabel: {
    fontSize: '13px',
    color: '#64748B',
  },
  section: {
    marginBottom: '32px',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1E1B4B',
    marginBottom: '20px',
  },
  progressCard: {
    background: 'white',
    padding: '24px',
    borderRadius: '16px',
    border: '1px solid #E2E8F0',
  },
  progressRow: {
    display: 'flex',
    padding: '16px 0',
    borderBottom: '1px solid #F1F5F9',
  },
  progressLabel: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#64748B',
    width: '200px',
  },
  progressValue: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#1E1B4B',
  },
  topicsList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  topicChip: {
    padding: '6px 12px',
    background: '#EEF2FF',
    color: '#667eea',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
  },
  attemptsContainer: {
    display: 'grid',
    gap: '16px',
  },
  attemptCard: {
    background: 'white',
    padding: '20px',
    borderRadius: '16px',
    border: '1px solid #E2E8F0',
  },
  attemptHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  attemptTopic: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1E1B4B',
  },
  attemptScore: {
    padding: '8px 16px',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '700',
  },
  attemptDetails: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
    marginBottom: '12px',
  },
  attemptDetail: {
    fontSize: '14px',
    color: '#64748B',
  },
  errorsSection: {
    marginTop: '12px',
    padding: '12px',
    background: '#FEF3C7',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#92400E',
  },
  errorsList: {
    margin: '8px 0 0 20px',
    fontSize: '13px',
  },
  errorItem: {
    marginBottom: '4px',
  },
  insightsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
  },
  insightCard: {
    background: 'white',
    padding: '24px',
    borderRadius: '16px',
    border: '1px solid #E2E8F0',
  },
  insightHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '16px',
  },
  insightIcon: {
    fontSize: '24px',
  },
  insightTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1E1B4B',
  },
  insightList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  insightItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '8px 0',
    fontSize: '14px',
    color: '#475569',
    lineHeight: '1.6',
  },
  insightBullet: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    marginTop: '6px',
    flexShrink: 0,
  },
  loadingScreen: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #faf5ff 0%, #f3f4ff 50%, #faf5ff 100%)',
  },
  spinner: {
    width: '60px',
    height: '60px',
    border: '5px solid #E2E8F0',
    borderTop: '5px solid #667eea',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '24px',
  },
};

// Add spinner animation
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  table tr:hover {
    background: #F8FAFC;
  }
`;
document.head.appendChild(styleSheet);

export default TeacherDashboard;