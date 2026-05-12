import React from 'react';

function ProgressAnalytics({ progress, performanceHistory }) {
  // Calculate analytics
  const totalTopics = progress.total_topics_completed + 5; // Assume 5 more topics ahead
  const completionRate = (progress.total_topics_completed / totalTopics) * 100;
  
  // Calculate learning velocity (topics per week)
  const daysActive = 7; // Simulated - in production track actual days
  const topicsPerWeek = (progress.total_topics_completed / daysActive) * 7;
  
  // Estimate weeks to completion
  const remainingTopics = totalTopics - progress.total_topics_completed;
  const weeksToComplete = topicsPerWeek > 0 ? Math.ceil(remainingTopics / topicsPerWeek) : 0;
  
  // Identify strengths and weaknesses
  const knowledgeState = progress.knowledge_state || {};
  const strengths = Object.entries(knowledgeState)
    .filter(([_, level]) => level >= 0.7)
    .map(([topic, _]) => topic);
  
  const weaknesses = Object.entries(knowledgeState)
    .filter(([_, level]) => level < 0.5)
    .map(([topic, _]) => topic);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📊 Learning Analytics</h2>
      
      <div style={styles.grid}>
        {/* Completion Progress */}
        <div style={styles.metricCard}>
          <div style={styles.metricIcon}>🎯</div>
          <div style={styles.metricValue}>{completionRate.toFixed(0)}%</div>
          <div style={styles.metricLabel}>Course Completion</div>
          <div style={styles.progressBar}>
            <div style={{...styles.progressFill, width: `${completionRate}%`}} />
          </div>
        </div>

        {/* Learning Velocity */}
        <div style={styles.metricCard}>
          <div style={styles.metricIcon}>⚡</div>
          <div style={styles.metricValue}>{topicsPerWeek.toFixed(1)}</div>
          <div style={styles.metricLabel}>Topics per Week</div>
          <div style={styles.velocityBadge}>
            {topicsPerWeek > 2 ? '🔥 Fast Pace' : topicsPerWeek > 1 ? '✅ Good Pace' : '🐢 Slow Pace'}
          </div>
        </div>

        {/* Estimated Completion */}
        <div style={styles.metricCard}>
          <div style={styles.metricIcon}>📅</div>
          <div style={styles.metricValue}>{weeksToComplete}</div>
          <div style={styles.metricLabel}>Weeks to Complete</div>
          <div style={styles.dateText}>
            Est. completion: {new Date(Date.now() + weeksToComplete * 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}
          </div>
        </div>

        {/* Average Score */}
        <div style={styles.metricCard}>
          <div style={styles.metricIcon}>⭐</div>
          <div style={styles.metricValue}>{progress.average_score.toFixed(0)}%</div>
          <div style={styles.metricLabel}>Average Score</div>
          <div style={styles.scoreRating}>
            {progress.average_score >= 90 ? 'Excellent!' : 
             progress.average_score >= 75 ? 'Great!' : 
             progress.average_score >= 60 ? 'Good' : 'Needs Work'}
          </div>
        </div>
      </div>

      {/* Strengths and Weaknesses */}
      <div style={styles.swGrid}>
        <div style={styles.swCard}>
          <h3 style={styles.swTitle}>💪 Your Strengths</h3>
          {strengths.length > 0 ? (
            <div style={styles.topicList}>
              {strengths.map((topic, i) => (
                <div key={i} style={styles.strengthItem}>
                  <span style={styles.checkmark}>✓</span>
                  {topic}
                </div>
              ))}
            </div>
          ) : (
            <p style={styles.emptyText}>Complete more topics to identify strengths</p>
          )}
        </div>

        <div style={styles.swCard}>
          <h3 style={styles.swTitle}>📚 Areas to Improve</h3>
          {weaknesses.length > 0 ? (
            <div style={styles.topicList}>
              {weaknesses.map((topic, i) => (
                <div key={i} style={styles.weaknessItem}>
                  <span style={styles.warningIcon}>⚠</span>
                  {topic}
                </div>
              ))}
            </div>
          ) : (
            <p style={styles.emptyText}>Great! No weak areas identified yet</p>
          )}
        </div>
      </div>

      {/* Knowledge Heatmap */}
      <div style={styles.heatmapContainer}>
        <h3 style={styles.heatmapTitle}>🗺️ Knowledge Heatmap</h3>
        <div style={styles.heatmap}>
          {Object.entries(knowledgeState).map(([topic, level], i) => (
            <div
              key={i}
              style={{
                ...styles.heatmapCell,
                background: level >= 0.8 ? '#4caf50' : 
                           level >= 0.6 ? '#8bc34a' : 
                           level >= 0.4 ? '#ffc107' : 
                           level >= 0.2 ? '#ff9800' : '#f44336'
              }}
              title={`${topic}: ${(level * 100).toFixed(0)}%`}
            >
              {topic.split(' ')[0].substring(0, 3)}
            </div>
          ))}
          {Object.keys(knowledgeState).length === 0 && (
            <p style={styles.emptyText}>Complete assessments to see your knowledge map</p>
          )}
        </div>
        <div style={styles.heatmapLegend}>
          <span style={styles.legendItem}>
            <div style={{...styles.legendColor, background: '#f44336'}} /> Weak
          </span>
          <span style={styles.legendItem}>
            <div style={{...styles.legendColor, background: '#ff9800'}} /> Fair
          </span>
          <span style={styles.legendItem}>
            <div style={{...styles.legendColor, background: '#ffc107'}} /> Good
          </span>
          <span style={styles.legendItem}>
            <div style={{...styles.legendColor, background: '#8bc34a'}} /> Strong
          </span>
          <span style={styles.legendItem}>
            <div style={{...styles.legendColor, background: '#4caf50'}} /> Mastered
          </span>
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
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '24px'
  },
  metricCard: {
    padding: '20px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    textAlign: 'center'
  },
  metricIcon: {
    fontSize: '40px',
    marginBottom: '12px'
  },
  metricValue: {
    fontSize: '36px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '8px'
  },
  metricLabel: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '12px'
  },
  progressBar: {
    width: '100%',
    height: '6px',
    background: '#ddd',
    borderRadius: '3px',
    overflow: 'hidden',
    marginTop: '8px'
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #667eea, #764ba2)',
    transition: 'width 0.3s'
  },
  velocityBadge: {
    marginTop: '8px',
    fontSize: '13px',
    fontWeight: 'bold',
    color: '#667eea'
  },
  dateText: {
    marginTop: '8px',
    fontSize: '12px',
    color: '#888'
  },
  scoreRating: {
    marginTop: '8px',
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#4caf50'
  },
  swGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '16px',
    marginBottom: '24px'
  },
  swCard: {
    padding: '20px',
    border: '2px solid #eee',
    borderRadius: '12px',
    background: '#fafafa'
  },
  swTitle: {
    fontSize: '16px',
    marginBottom: '16px',
    color: '#333'
  },
  topicList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  strengthItem: {
    padding: '10px',
    background: '#e8f5e9',
    borderRadius: '6px',
    fontSize: '14px',
    color: '#2e7d32',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  weaknessItem: {
    padding: '10px',
    background: '#fff3e0',
    borderRadius: '6px',
    fontSize: '14px',
    color: '#e65100',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  checkmark: {
    fontSize: '16px',
    fontWeight: 'bold'
  },
  warningIcon: {
    fontSize: '16px'
  },
  emptyText: {
    fontSize: '14px',
    color: '#999',
    fontStyle: 'italic'
  },
  heatmapContainer: {
    marginTop: '24px'
  },
  heatmapTitle: {
    fontSize: '16px',
    marginBottom: '16px',
    color: '#333'
  },
  heatmap: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
    gap: '8px',
    marginBottom: '16px'
  },
  heatmapCell: {
    padding: '16px',
    borderRadius: '8px',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '12px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'transform 0.2s'
  },
  heatmapLegend: {
    display: 'flex',
    gap: '16px',
    justifyContent: 'center',
    flexWrap: 'wrap'
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '12px',
    color: '#666'
  },
  legendColor: {
    width: '16px',
    height: '16px',
    borderRadius: '3px'
  }
};

export default ProgressAnalytics;