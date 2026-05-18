import React, { useState } from 'react';

function SpacedRepetition({ knowledgeState, completedTopics, onReviewTopic }) {
  const [selectedTopic, setSelectedTopic] = useState(null);

  // Calculate review schedule based on mastery level
  const calculateReviewTopics = () => {
    const topics = Object.entries(knowledgeState).map(([topic, masteryLevel]) => {
      // Spaced repetition intervals based on mastery
      let daysUntilReview;
      let urgency;
      
      if (masteryLevel < 0.4) {
        daysUntilReview = 1; // Review tomorrow
        urgency = 'critical';
      } else if (masteryLevel < 0.6) {
        daysUntilReview = 3; // Review in 3 days
        urgency = 'high';
      } else if (masteryLevel < 0.8) {
        daysUntilReview = 7; // Review in a week
        urgency = 'medium';
      } else {
        daysUntilReview = 30; // Review in a month
        urgency = 'low';
      }

      // Simulate "last reviewed" dates for demo
      const lastReviewed = new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000);
      const nextReview = new Date(lastReviewed.getTime() + daysUntilReview * 24 * 60 * 60 * 1000);
      const daysOverdue = Math.floor((Date.now() - nextReview.getTime()) / (1000 * 60 * 60 * 24));
      const isDue = daysOverdue >= 0;

      return {
        topic,
        masteryLevel,
        urgency,
        nextReview,
        daysOverdue: Math.max(0, daysOverdue),
        isDue,
        retentionRate: (masteryLevel * 100).toFixed(0)
      };
    });

    // Sort by urgency: due topics first, then by days overdue
    return topics.sort((a, b) => {
      if (a.isDue && !b.isDue) return -1;
      if (!a.isDue && b.isDue) return 1;
      if (a.isDue && b.isDue) return b.daysOverdue - a.daysOverdue;
      return a.nextReview - b.nextReview;
    });
  };

  const reviewTopics = calculateReviewTopics();
  const dueTopics = reviewTopics.filter(t => t.isDue);
  const upcomingTopics = reviewTopics.filter(t => !t.isDue).slice(0, 5);

  const getUrgencyStyle = (urgency) => {
    switch(urgency) {
      case 'critical': return { background: '#ffebee', borderColor: '#f44336', color: '#c62828' };
      case 'high': return { background: '#fff3e0', borderColor: '#ff9800', color: '#e65100' };
      case 'medium': return { background: '#fff9c4', borderColor: '#ffc107', color: '#f57f17' };
      default: return { background: '#e8f5e9', borderColor: '#4caf50', color: '#2e7d32' };
    }
  };

  const getUrgencyLabel = (urgency) => {
    switch(urgency) {
      case 'critical': return '🚨 Review Now';
      case 'high': return '⚠️ Review Soon';
      case 'medium': return '📅 Review This Week';
      default: return '✅ Well Retained';
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>🧠 Spaced Repetition Tracker</h2>
        <div style={styles.stats}>
          <span style={styles.statBadge}>
            {dueTopics.length} Due for Review
          </span>
        </div>
      </div>

      {dueTopics.length > 0 ? (
        <>
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>📍 Topics Due for Review</h3>
            <div style={styles.topicGrid}>
              {dueTopics.map((item, i) => (
                <div
                  key={i}
                  style={{
                    ...styles.topicCard,
                    ...getUrgencyStyle(item.urgency)
                  }}
                  onClick={() => setSelectedTopic(item)}
                >
                  <div style={styles.topicHeader}>
                    <div style={styles.topicName}>{item.topic}</div>
                    <div style={styles.urgencyBadge}>
                      {getUrgencyLabel(item.urgency)}
                    </div>
                  </div>
                  
                  <div style={styles.topicStats}>
                    <div style={styles.stat}>
                      <span style={styles.statLabel}>Retention:</span>
                      <span style={styles.statValue}>{item.retentionRate}%</span>
                    </div>
                    <div style={styles.stat}>
                      <span style={styles.statLabel}>Overdue:</span>
                      <span style={styles.statValue}>{item.daysOverdue} days</span>
                    </div>
                  </div>

                  <div style={styles.retentionBar}>
                    <div
                      style={{
                        ...styles.retentionFill,
                        width: `${item.retentionRate}%`,
                        background: item.masteryLevel < 0.4 ? '#f44336' :
                                   item.masteryLevel < 0.6 ? '#ff9800' :
                                   item.masteryLevel < 0.8 ? '#ffc107' : '#4caf50'
                      }}
                    />
                  </div>

                  <button
                    style={styles.reviewBtn}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onReviewTopic) onReviewTopic(item.topic);
                    }}
                  >
                    Start Review Session
                  </button>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>✨</div>
          <div style={styles.emptyTitle}>All Caught Up!</div>
          <div style={styles.emptyText}>
            No topics need review right now. Keep up the great work!
          </div>
        </div>
      )}

      {upcomingTopics.length > 0 && (
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>📅 Upcoming Reviews</h3>
          <div style={styles.upcomingList}>
            {upcomingTopics.map((item, i) => (
              <div key={i} style={styles.upcomingItem}>
                <div style={styles.upcomingLeft}>
                  <div style={styles.upcomingTopic}>{item.topic}</div>
                  <div style={styles.upcomingDate}>
                    Review on: {item.nextReview.toLocaleDateString()}
                  </div>
                </div>
                <div style={styles.upcomingRight}>
                  <div style={styles.retentionCircle}>
                    {item.retentionRate}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedTopic && (
        <div style={styles.modal} onClick={() => setSelectedTopic(null)}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>Review: {selectedTopic.topic}</h3>
            <div style={styles.modalStats}>
              <div style={styles.modalStat}>
                <div style={styles.modalStatLabel}>Current Retention</div>
                <div style={styles.modalStatValue}>{selectedTopic.retentionRate}%</div>
              </div>
              <div style={styles.modalStat}>
                <div style={styles.modalStatLabel}>Days Overdue</div>
                <div style={styles.modalStatValue}>{selectedTopic.daysOverdue}</div>
              </div>
              <div style={styles.modalStat}>
                <div style={styles.modalStatLabel}>Urgency</div>
                <div style={styles.modalStatValue}>{getUrgencyLabel(selectedTopic.urgency)}</div>
              </div>
            </div>
            <div style={styles.modalText}>
              This topic needs review to maintain long-term retention. The AI has detected your mastery level is at {selectedTopic.retentionRate}% and recommends a focused review session.
            </div>
            <button
              style={styles.modalBtn}
              onClick={() => {
                if (onReviewTopic) onReviewTopic(selectedTopic.topic);
                setSelectedTopic(null);
              }}
            >
              Start Review Now
            </button>
          </div>
        </div>
      )}
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
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px'
  },
  title: {
    fontSize: '20px',
    color: '#333',
    margin: 0
  },
  stats: {
    display: 'flex',
    gap: '12px'
  },
  statBadge: {
    padding: '8px 16px',
    background: '#ff9800',
    color: 'white',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: 'bold'
  },
  section: {
    marginBottom: '32px'
  },
  sectionTitle: {
    fontSize: '16px',
    color: '#555',
    marginBottom: '16px'
  },
  topicGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '16px'
  },
  topicCard: {
    padding: '20px',
    borderRadius: '12px',
    border: '2px solid',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s'
  },
  topicHeader: {
    marginBottom: '16px'
  },
  topicName: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '8px'
  },
  urgencyBadge: {
    fontSize: '13px',
    fontWeight: 'bold'
  },
  topicStats: {
    display: 'flex',
    gap: '24px',
    marginBottom: '12px'
  },
  stat: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  statLabel: {
    fontSize: '12px',
    opacity: 0.8
  },
  statValue: {
    fontSize: '16px',
    fontWeight: 'bold'
  },
  retentionBar: {
    width: '100%',
    height: '8px',
    background: 'rgba(0,0,0,0.1)',
    borderRadius: '4px',
    overflow: 'hidden',
    marginBottom: '16px'
  },
  retentionFill: {
    height: '100%',
    transition: 'width 0.3s'
  },
  reviewBtn: {
    width: '100%',
    padding: '12px',
    background: 'rgba(0,0,0,0.1)',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '14px'
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px'
  },
  emptyIcon: {
    fontSize: '64px',
    marginBottom: '16px'
  },
  emptyTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '8px'
  },
  emptyText: {
    fontSize: '16px',
    color: '#666'
  },
  upcomingList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  upcomingItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    background: '#f9f9f9',
    borderRadius: '8px',
    border: '1px solid #eee'
  },
  upcomingLeft: {
    flex: 1
  },
  upcomingTopic: {
    fontSize: '16px',
    fontWeight: '500',
    color: '#333',
    marginBottom: '4px'
  },
  upcomingDate: {
    fontSize: '13px',
    color: '#888'
  },
  upcomingRight: {},
  retentionCircle: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '16px'
  },
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  },
  modalContent: {
    background: 'white',
    padding: '32px',
    borderRadius: '16px',
    maxWidth: '500px',
    width: '90%'
  },
  modalTitle: {
    fontSize: '24px',
    marginBottom: '24px',
    color: '#333'
  },
  modalStats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px',
    marginBottom: '24px'
  },
  modalStat: {
    textAlign: 'center',
    padding: '16px',
    background: '#f5f5f5',
    borderRadius: '8px'
  },
  modalStatLabel: {
    fontSize: '12px',
    color: '#888',
    marginBottom: '8px'
  },
  modalStatValue: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#333'
  },
  modalText: {
    fontSize: '15px',
    color: '#666',
    lineHeight: '1.6',
    marginBottom: '24px'
  },
  modalBtn: {
    width: '100%',
    padding: '14px',
    background: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer'
  }
};

export default SpacedRepetition;