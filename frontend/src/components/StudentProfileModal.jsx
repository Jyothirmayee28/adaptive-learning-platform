import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';

const API = 'http://127.0.0.1:8000';

function StudentProfileModal({ student, onClose, onOverride }) {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [overrideInput, setOverrideInput] = useState('');

  useEffect(() => {
    loadStudentDetails();
  }, []);

  const loadStudentDetails = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/api/learning/progress/${student.id}`);
      setProgress(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOverride = async () => {
    if (!overrideInput.trim()) return;
    
    try {
      await axios.post(`${API}/api/learning/override`, {
        student_id: student.id,
        new_topic: overrideInput,
        reason: 'Teacher manual override',
        teacher_name: 'Teacher'
      });
      window.alert(`Successfully overridden ${student.name}'s path to: ${overrideInput}`);
      setOverrideInput('');
      onOverride();
      onClose();
    } catch (err) {
      console.error(err);
      window.alert('Failed to override path');
    }
  };

  if (loading) {
    return (
      <div style={styles.overlay} onClick={onClose}>
        <div style={styles.modal} onClick={e => e.stopPropagation()}>
          <div style={styles.loading}>Loading student data...</div>
        </div>
      </div>
    );
  }

  // Chart data
  const performanceData = {
    labels: (progress.performance_history || []).map((_, i) => `Assessment ${i + 1}`),
    datasets: [{
      label: 'Score %',
      data: (progress.performance_history || []).map(h => h.score || 0),
      borderColor: '#667eea',
      backgroundColor: 'rgba(102, 126, 234, 0.1)',
      tension: 0.4,
      fill: true
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true, max: 100 }
    }
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <div style={styles.avatar}>{student.name[0]}</div>
            <div>
              <h2 style={styles.studentName}>{student.name}</h2>
              <p style={styles.studentEmail}>{student.email}</p>
            </div>
          </div>
          <button style={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        {/* Tabs */}
        <div style={styles.tabs}>
          <button
            style={{...styles.tab, ...(activeTab === 'overview' ? styles.tabActive : {})}}
            onClick={() => setActiveTab('overview')}
          >
            📊 Overview
          </button>
          <button
            style={{...styles.tab, ...(activeTab === 'performance' ? styles.tabActive : {})}}
            onClick={() => setActiveTab('performance')}
          >
            📈 Performance
          </button>
          <button
            style={{...styles.tab, ...(activeTab === 'override' ? styles.tabActive : {})}}
            onClick={() => setActiveTab('override')}
          >
            🔧 Override Path
          </button>
        </div>

        {/* Content */}
        <div style={styles.content}>
          {activeTab === 'overview' && (
            <div>
              {/* Key Stats */}
              <div style={styles.statsGrid}>
                <div style={styles.statCard}>
                  <div style={styles.statLabel}>Current Topic</div>
                  <div style={styles.statValue}>{progress.current_topic}</div>
                </div>
                <div style={styles.statCard}>
                  <div style={styles.statLabel}>Difficulty Level</div>
                  <div style={styles.statValue}>{progress.difficulty_level.toFixed(1)}/5</div>
                </div>
                <div style={styles.statCard}>
                  <div style={styles.statLabel}>Topics Completed</div>
                  <div style={styles.statValue}>{progress.total_topics_completed}</div>
                </div>
                <div style={styles.statCard}>
                  <div style={styles.statLabel}>Average Score</div>
                  <div style={styles.statValue}>{progress.average_score.toFixed(0)}%</div>
                </div>
              </div>

              {/* Completed Topics */}
              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>Completed Topics</h3>
                {progress.completed_topics.length > 0 ? (
                  <div style={styles.topicsList}>
                    {progress.completed_topics.map((topic, i) => (
                      <div key={i} style={styles.topicBadge}>
                        ✓ {topic}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={styles.emptyText}>No topics completed yet</p>
                )}
              </div>

              {/* Knowledge State Heatmap */}
              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>Knowledge Map</h3>
                <div style={styles.heatmap}>
                  {Object.entries(progress.knowledge_state || {}).map(([topic, level], i) => (
                    <div
                      key={i}
                      style={{
                        ...styles.heatmapCell,
                        background: level >= 0.8 ? '#4caf50' :
                                   level >= 0.6 ? '#8bc34a' :
                                   level >= 0.4 ? '#ffc107' : '#f44336'
                      }}
                      title={`${topic}: ${(level * 100).toFixed(0)}%`}
                    >
                      {topic.split(' ')[0].substring(0, 4)}
                    </div>
                  ))}
                  {Object.keys(progress.knowledge_state || {}).length === 0 && (
                    <p style={styles.emptyText}>No knowledge data yet</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'performance' && (
            <div>
              {/* Performance Chart */}
              <div style={styles.chartContainer}>
                <h3 style={styles.sectionTitle}>Score Trend</h3>
                {(progress.performance_history || []).length > 0 ? (
                  <div style={styles.chart}>
                    <Line data={performanceData} options={chartOptions} />
                  </div>
                ) : (
                  <p style={styles.emptyText}>No performance data yet</p>
                )}
              </div>

              {/* Detailed History */}
              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>Assessment History</h3>
                {(progress.performance_history || []).length > 0 ? (
                  <div style={styles.historyList}>
                    {progress.performance_history.map((record, i) => (
                      <div key={i} style={styles.historyItem}>
                        <div style={styles.historyLeft}>
                          <div style={styles.historyTopic}>{record.topic}</div>
                          {record.feedback && (
                            <div style={styles.historyFeedback}>{record.feedback}</div>
                          )}
                        </div>
                        <div style={styles.historyRight}>
                          <div style={{
                            ...styles.historyScore,
                            color: record.score >= 80 ? '#4caf50' :
                                   record.score >= 60 ? '#ff9800' : '#f44336'
                          }}>
                            {record.score}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={styles.emptyText}>No assessment history yet</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'override' && (
            <div>
              <div style={styles.overrideBox}>
                <h3 style={styles.sectionTitle}>Override Learning Path</h3>
                <p style={styles.overrideDescription}>
                  Manually change {student.name}'s next topic. Use this when you believe
                  a different topic would be more beneficial at this time.
                </p>

                <div style={styles.currentPathBox}>
                  <div style={styles.pathLabel}>Current Topic:</div>
                  <div style={styles.pathValue}>{progress.current_topic}</div>
                </div>

                <label style={styles.label}>New Topic:</label>
                <input
                  style={styles.input}
                  placeholder="Enter new topic name"
                  value={overrideInput}
                  onChange={e => setOverrideInput(e.target.value)}
                />

                <button
                  style={{
                    ...styles.overrideBtn,
                    ...(overrideInput.trim() ? {} : styles.overrideBtnDisabled)
                  }}
                  onClick={handleOverride}
                  disabled={!overrideInput.trim()}
                >
                  Override Path
                </button>

                <div style={styles.warningBox}>
                  ⚠️ This will immediately change the student's learning path. The AI will
                  adapt future recommendations based on this override.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000,
    padding: '20px'
  },
  modal: {
    background: 'white',
    borderRadius: '16px',
    width: '100%',
    maxWidth: '900px',
    maxHeight: '90vh',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
  },
  loading: {
    padding: '60px',
    textAlign: 'center',
    color: '#999'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px',
    borderBottom: '1px solid #eee'
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  avatar: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '28px',
    fontWeight: 'bold'
  },
  studentName: {
    fontSize: '24px',
    margin: 0,
    color: '#333'
  },
  studentEmail: {
    fontSize: '14px',
    color: '#888',
    margin: '4px 0 0 0'
  },
  closeBtn: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    border: 'none',
    background: '#f5f5f5',
    cursor: 'pointer',
    fontSize: '24px',
    color: '#666'
  },
  tabs: {
    display: 'flex',
    padding: '0 24px',
    borderBottom: '1px solid #eee',
    gap: '8px'
  },
  tab: {
    padding: '16px 24px',
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    fontSize: '15px',
    color: '#666',
    borderBottom: '3px solid transparent',
    transition: 'all 0.2s'
  },
  tabActive: {
    color: '#667eea',
    borderBottomColor: '#667eea',
    fontWeight: 'bold'
  },
  content: {
    flex: 1,
    overflowY: 'auto',
    padding: '24px'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '16px',
    marginBottom: '24px'
  },
  statCard: {
    padding: '20px',
    background: '#f5f7fa',
    borderRadius: '12px',
    textAlign: 'center'
  },
  statLabel: {
    fontSize: '13px',
    color: '#888',
    marginBottom: '8px'
  },
  statValue: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#667eea'
  },
  section: {
    marginTop: '24px'
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '16px'
  },
  topicsList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px'
  },
  topicBadge: {
    padding: '8px 16px',
    background: '#e8f5e9',
    color: '#4caf50',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '500'
  },
  emptyText: {
    fontSize: '14px',
    color: '#999',
    fontStyle: 'italic'
  },
  heatmap: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
    gap: '8px'
  },
  heatmapCell: {
    padding: '16px',
    borderRadius: '8px',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '13px',
    textAlign: 'center',
    cursor: 'pointer'
  },
  chartContainer: {
    marginBottom: '24px'
  },
  chart: {
    height: '300px',
    padding: '16px',
    background: '#fafafa',
    borderRadius: '12px'
  },
  historyList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  historyItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '16px',
    background: '#f9f9f9',
    borderRadius: '8px'
  },
  historyLeft: {
    flex: 1
  },
  historyTopic: {
    fontSize: '15px',
    fontWeight: '500',
    color: '#333',
    marginBottom: '4px'
  },
  historyFeedback: {
    fontSize: '13px',
    color: '#666'
  },
  historyRight: {
    display: 'flex',
    alignItems: 'center'
  },
  historyScore: {
    fontSize: '20px',
    fontWeight: 'bold'
  },
  overrideBox: {
    maxWidth: '600px',
    margin: '0 auto'
  },
  overrideDescription: {
    fontSize: '14px',
    color: '#666',
    lineHeight: '1.6',
    marginBottom: '24px'
  },
  currentPathBox: {
    padding: '16px',
    background: '#f5f7fa',
    borderRadius: '8px',
    marginBottom: '24px'
  },
  pathLabel: {
    fontSize: '13px',
    color: '#888',
    marginBottom: '8px'
  },
  pathValue: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#667eea'
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '500',
    color: '#333',
    marginBottom: '8px'
  },
  input: {
    width: '100%',
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '15px',
    marginBottom: '16px',
    boxSizing: 'border-box'
  },
  overrideBtn: {
    width: '100%',
    padding: '14px',
    background: '#ff9800',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginBottom: '16px'
  },
  overrideBtnDisabled: {
    background: '#ddd',
    cursor: 'not-allowed'
  },
  warningBox: {
    padding: '12px',
    background: '#fff3e0',
    border: '1px solid #ff9800',
    borderRadius: '8px',
    fontSize: '13px',
    color: '#e65100',
    lineHeight: '1.5'
  }
};

export default StudentProfileModal;