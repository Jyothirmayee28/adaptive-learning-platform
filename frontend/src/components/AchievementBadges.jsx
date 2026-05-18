import React from 'react';

function AchievementBadges({ completedTopics, averageScore }) {
  const badges = [
    {
      id: 1,
      name: 'First Step',
      description: 'Complete your first topic',
      icon: '🎯',
      unlocked: completedTopics >= 1
    },
    {
      id: 2,
      name: 'Getting Started',
      description: 'Complete 3 topics',
      icon: '🚀',
      unlocked: completedTopics >= 3
    },
    {
      id: 3,
      name: 'On Fire',
      description: 'Complete 5 topics',
      icon: '🔥',
      unlocked: completedTopics >= 5
    },
    {
      id: 4,
      name: 'Excellence',
      description: 'Maintain 80%+ average score',
      icon: '⭐',
      unlocked: averageScore >= 80
    },
    {
      id: 5,
      name: 'Perfectionist',
      description: 'Maintain 90%+ average score',
      icon: '💎',
      unlocked: averageScore >= 90
    },
    {
      id: 6,
      name: 'Dedicated Learner',
      description: 'Complete 10 topics',
      icon: '🏆',
      unlocked: completedTopics >= 10
    }
  ];

  const unlockedCount = badges.filter(b => b.unlocked).length;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>🏅 Achievements</h2>
        <span style={styles.counter}>{unlockedCount}/{badges.length} Unlocked</span>
      </div>
      <div style={styles.badgeGrid}>
        {badges.map(badge => (
          <div
            key={badge.id}
            style={{
              ...styles.badge,
              ...(badge.unlocked ? styles.badgeUnlocked : styles.badgeLocked)
            }}
          >
            <div style={{
              ...styles.icon,
              ...(badge.unlocked ? {} : styles.iconLocked)
            }}>
              {badge.icon}
            </div>
            <div style={styles.badgeName}>{badge.name}</div>
            <div style={styles.badgeDesc}>{badge.description}</div>
            {badge.unlocked && (
              <div style={styles.checkmark}>✓</div>
            )}
          </div>
        ))}
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
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  title: {
    fontSize: '20px',
    color: '#333',
    margin: 0
  },
  counter: {
    fontSize: '14px',
    color: '#667eea',
    fontWeight: 'bold'
  },
  badgeGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
    gap: '16px'
  },
  badge: {
    padding: '20px',
    borderRadius: '12px',
    textAlign: 'center',
    transition: 'all 0.3s',
    position: 'relative',
    cursor: 'pointer'
  },
  badgeUnlocked: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
    transform: 'scale(1)',
    ':hover': {
      transform: 'scale(1.05)'
    }
  },
  badgeLocked: {
    background: '#f5f5f5',
    color: '#999',
    opacity: 0.6
  },
  icon: {
    fontSize: '40px',
    marginBottom: '12px'
  },
  iconLocked: {
    filter: 'grayscale(100%)',
    opacity: 0.5
  },
  badgeName: {
    fontSize: '14px',
    fontWeight: 'bold',
    marginBottom: '6px'
  },
  badgeDesc: {
    fontSize: '12px',
    opacity: 0.9
  },
  checkmark: {
    position: 'absolute',
    top: '8px',
    right: '8px',
    width: '24px',
    height: '24px',
    background: '#4caf50',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: 'bold'
  }
};

export default AchievementBadges;