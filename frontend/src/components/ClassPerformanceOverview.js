import React from 'react';
import { Line } from 'react-chartjs-2';

function ClassPerformanceOverview({ students }) {
  // Calculate class metrics
  const totalStudents = students.length;
  const avgScore = students.reduce((sum, s) => sum + (s.difficulty_level * 20 || 0), 0) / totalStudents || 0;
  
  // Count students by performance level
  const excellent = students.filter(s => s.difficulty_level >= 4).length;
  const good = students.filter(s => s.difficulty_level >= 3 && s.difficulty_level < 4).length;
  const average = students.filter(s => s.difficulty_level >= 2 && s.difficulty_level < 3).length;
  const struggling = students.filter(s => s.difficulty_level < 2).length;

  // Topic distribution
  const topicCounts = {};
  students.forEach(s => {
    const topic = s.current_topic;
    topicCounts[topic] = (topicCounts[topic] || 0) + 1;
  });

  // Simulated trend data (in production, fetch from backend)
  const trendData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Current'],
    datasets: [
      {
        label: 'Average Class Score',
        data: [65, 70, 72, 75, avgScore],
        borderColor: '#667eea',
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: { callback: (value) => value + '%' }
      }
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📊 Class Performance Overview</h2>

      {/* Key Metrics Grid */}
      <div style={styles.metricsGrid}>
        <div style={styles.metricCard}>
          <div style={styles.metricIcon}>👥</div>
          <div style={styles.metricValue}>{totalStudents}</div>
          <div style={styles.metricLabel}>Total Students</div>
        </div>

        <div style={styles.metricCard}>
          <div style={styles.metricIcon}>⭐</div>
          <div style={styles.metricValue}>{avgScore.toFixed(1)}%</div>
          <div style={styles.metricLabel}>Class Average</div>
          <div style={styles.metricChange}>
            {avgScore >= 75 ? '↑ Great!' : avgScore >= 60 ? '→ Good' : '↓ Needs Attention'}
          </div>
        </div>

        <div style={styles.metricCard}>
          <div style={styles.metricIcon}>🏆</div>
          <div style={styles.metricValue}>{excellent}</div>
          <div style={styles.metricLabel}>Excellent Performers</div>
          <div style={styles.metricSubtext}>{((excellent / totalStudents) * 100).toFixed(0)}% of class</div>
        </div>

        <div style={styles.metricCard}>
          <div style={styles.metricIcon}>⚠️</div>
          <div style={styles.metricValue}>{struggling}</div>
          <div style={styles.metricLabel}>Need Support</div>
          <div style={styles.metricSubtext}>{((struggling / totalStudents) * 100).toFixed(0)}% of class</div>
        </div>
      </div>

      {/* Performance Distribution */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Student Distribution by Performance</h3>
        <div style={styles.distributionGrid}>
          <div style={{...styles.distributionCard, borderColor: '#4caf50'}}>
            <div style={{...styles.distributionBar, width: `${(excellent / totalStudents) * 100}%`, background: '#4caf50'}} />
            <div style={styles.distributionLabel}>
              <span style={styles.distributionEmoji}>🌟</span>
              <span>Excellent ({excellent})</span>
            </div>
          </div>

          <div style={{...styles.distributionCard, borderColor: '#8bc34a'}}>
            <div style={{...styles.distributionBar, width: `${(good / totalStudents) * 100}%`, background: '#8bc34a'}} />
            <div style={styles.distributionLabel}>
              <span style={styles.distributionEmoji}>👍</span>
              <span>Good ({good})</span>
            </div>
          </div>

          <div style={{...styles.distributionCard, borderColor: '#ffc107'}}>
            <div style={{...styles.distributionBar, width: `${(average / totalStudents) * 100}%`, background: '#ffc107'}} />
            <div style={styles.distributionLabel}>
              <span style={styles.distributionEmoji}>📚</span>
              <span>Average ({average})</span>
            </div>
          </div>

          <div style={{...styles.distributionCard, borderColor: '#f44336'}}>
            <div style={{...styles.distributionBar, width: `${(struggling / totalStudents) * 100}%`, background: '#f44336'}} />
            <div style={styles.distributionLabel}>
              <span style={styles.distributionEmoji}>🆘</span>
              <span>Struggling ({struggling})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Trend Chart */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Class Progress Trend</h3>
        <div style={styles.chartContainer}>
          <Line data={trendData} options={chartOptions} />
        </div>
      </div>

      {/* Topic Distribution */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Current Topics Distribution</h3>
        <div style={styles.topicList}>
          {Object.entries(topicCounts)
            .sort((a, b) => b[1] - a[1])
            .map(([topic, count], i) => (
              <div key={i} style={styles.topicItem}>
                <div style={styles.topicInfo}>
                  <div style={styles.topicName}>{topic}</div>
                  <div style={styles.topicCount}>{count} students</div>
                </div>
                <div style={styles.topicBar}>
                  <div style={{
                    ...styles.topicBarFill,
                    width: `${(count / totalStudents) * 100}%`
                  }} />
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    background: 'white',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    marginBottom: '24px'
  },
  title: {
    fontSize: '20px',
    color: '#333',
    marginBottom: '24px'
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '32px'
  },
  metricCard: {
    padding: '24px',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    borderRadius: '12px',
    textAlign: 'center'
  },
  metricIcon: {
    fontSize: '36px',
    marginBottom: '12px'
  },
  metricValue: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '8px'
  },
  metricLabel: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '8px'
  },
  metricChange: {
    fontSize: '13px',
    fontWeight: 'bold',
    color: '#667eea'
  },
  metricSubtext: {
    fontSize: '12px',
    color: '#888'
  },
  section: {
    marginTop: '32px'
  },
  sectionTitle: {
    fontSize: '16px',
    color: '#555',
    marginBottom: '16px',
    fontWeight: 'bold'
  },
  distributionGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  distributionCard: {
    padding: '16px',
    background: '#fafafa',
    borderRadius: '8px',
    borderLeft: '4px solid',
    position: 'relative',
    overflow: 'hidden'
  },
  distributionBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: '100%',
    opacity: 0.1,
    transition: 'width 0.5s'
  },
  distributionLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '15px',
    fontWeight: '500',
    color: '#333',
    position: 'relative',
    zIndex: 1
  },
  distributionEmoji: {
    fontSize: '24px'
  },
  chartContainer: {
    height: '300px',
    padding: '16px',
    background: '#fafafa',
    borderRadius: '12px'
  },
  topicList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  topicItem: {
    padding: '16px',
    background: '#fafafa',
    borderRadius: '8px'
  },
  topicInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '12px'
  },
  topicName: {
    fontSize: '15px',
    fontWeight: '500',
    color: '#333'
  },
  topicCount: {
    fontSize: '14px',
    color: '#667eea',
    fontWeight: 'bold'
  },
  topicBar: {
    width: '100%',
    height: '8px',
    background: '#e0e0e0',
    borderRadius: '4px',
    overflow: 'hidden'
  },
  topicBarFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #667eea, #764ba2)',
    transition: 'width 0.5s'
  }
};

export default ClassPerformanceOverview;