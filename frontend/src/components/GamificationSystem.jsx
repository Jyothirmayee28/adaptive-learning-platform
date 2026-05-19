import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

function GamificationSystem({ studentId, completedTopics, averageScore }) {
  const [students, setStudents] = useState([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      const res = await axios.get(`${API}/api/students/`);
      setStudents(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Calculate XP based on completed topics and scores
  const calculateXP = (topics, score) => {
    const topicXP = topics * 100; // 100 XP per topic
    const scoreBonus = Math.floor(score * 2); // Bonus based on average score
    return topicXP + scoreBonus;
  };

  const currentXP = calculateXP(completedTopics, averageScore);
  
  // Level system
  const getLevel = (xp) => {
    if (xp < 300) return { level: 1, title: '🌱 Beginner', color: '#4caf50' };
    if (xp < 800) return { level: 2, title: '📚 Learner', color: '#2196f3' };
    if (xp < 1500) return { level: 3, title: '🎓 Scholar', color: '#9c27b0' };
    if (xp < 2500) return { level: 4, title: '🏆 Expert', color: '#ff9800' };
    return { level: 5, title: '👑 Master', color: '#f44336' };
  };

  const currentLevel = getLevel(currentXP);
  const nextLevelXP = [300, 800, 1500, 2500, 5000][currentLevel.level - 1] || 5000;
  const progressToNext = ((currentXP % nextLevelXP) / nextLevelXP) * 100;

  // Daily streak (simulated)
  const dailyStreak = Math.min(completedTopics, 7);

  // Leaderboard data
  const leaderboardData = students
    .map(s => ({
      ...s,
      xp: calculateXP(s.current_topic === 'Introduction to Learning' ? 0 : 3, 75), // Simulated
      level: getLevel(calculateXP(3, 75))
    }))
    .sort((a, b) => b.xp - a.xp);

  const currentRank = leaderboardData.findIndex(s => s.id === studentId) + 1;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>🎮 Your Gaming Stats</h2>
        <button
          style={styles.leaderboardBtn}
          onClick={() => setShowLeaderboard(!showLeaderboard)}
        >
          {showLeaderboard ? 'Hide' : 'View'} Leaderboard
        </button>
      </div>

      <div style={styles.grid}>
        {/* Level Card */}
        <div style={{...styles.card, borderColor: currentLevel.color}}>
          <div style={styles.cardIcon}>⭐</div>
          <div style={styles.levelTitle}>{currentLevel.title}</div>
          <div style={styles.levelNumber}>Level {currentLevel.level}</div>
          <div style={styles.xpText}>{currentXP} XP</div>
          <div style={styles.progressBar}>
            <div style={{
              ...styles.progressFill,
              width: `${progressToNext}%`,
              background: currentLevel.color
            }} />
          </div>
          <div style={styles.progressText}>
            {Math.floor(progressToNext)}% to Level {currentLevel.level + 1}
          </div>
        </div>

        {/* Streak Card */}
        <div style={styles.card}>
          <div style={styles.cardIcon}>🔥</div>
          <div style={styles.streakNumber}>{dailyStreak}</div>
          <div style={styles.streakLabel}>Day Streak</div>
          <div style={styles.streakDays}>
            {[...Array(7)].map((_, i) => (
              <div
                key={i}
                style={{
                  ...styles.streakDay,
                  ...(i < dailyStreak ? styles.streakDayActive : {})
                }}
              >
                {i < dailyStreak ? '✓' : '○'}
              </div>
            ))}
          </div>
          <div style={styles.streakMotivation}>
            {dailyStreak >= 7 ? 'Perfect Week! 🎉' : `${7 - dailyStreak} more days for Perfect Week!`}
          </div>
        </div>

        {/* Rank Card */}
        <div style={styles.card}>
          <div style={styles.cardIcon}>🏅</div>
          <div style={styles.rankNumber}>#{currentRank}</div>
          <div style={styles.rankLabel}>Class Rank</div>
          <div style={styles.rankMedal}>
            {currentRank === 1 ? '🥇 First Place!' :
             currentRank === 2 ? '🥈 Second Place!' :
             currentRank === 3 ? '🥉 Third Place!' :
             `Keep climbing!`}
          </div>
        </div>

        {/* XP Breakdown Card */}
        <div style={styles.card}>
          <div style={styles.cardIcon}>💎</div>
          <div style={styles.xpBreakdownTitle}>XP Earned</div>
          <div style={styles.xpBreakdown}>
            <div style={styles.xpRow}>
              <span>Topics Completed:</span>
              <span style={styles.xpValue}>+{completedTopics * 100} XP</span>
            </div>
            <div style={styles.xpRow}>
              <span>Score Bonus:</span>
              <span style={styles.xpValue}>+{Math.floor(averageScore * 2)} XP</span>
            </div>
            <div style={{...styles.xpRow, ...styles.xpTotal}}>
              <span>Total XP:</span>
              <span style={styles.xpValue}>{currentXP} XP</span>
            </div>
          </div>
        </div>
      </div>

      {/* Leaderboard Modal */}
      {showLeaderboard && (
        <div style={styles.modal} onClick={() => setShowLeaderboard(false)}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>🏆 Class Leaderboard</h3>
              <button style={styles.closeBtn} onClick={() => setShowLeaderboard(false)}>✕</button>
            </div>

            <div style={styles.leaderboardList}>
              {leaderboardData.slice(0, 10).map((student, index) => (
                <div
                  key={student.id}
                  style={{
                    ...styles.leaderboardItem,
                    ...(student.id === studentId ? styles.leaderboardCurrentUser : {})
                  }}
                >
                  <div style={styles.leaderboardRank}>
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                  </div>
                  <div style={styles.leaderboardInfo}>
                    <div style={styles.leaderboardName}>
                      {student.name}
                      {student.id === studentId && <span style={styles.youBadge}>You</span>}
                    </div>
                    <div style={styles.leaderboardLevel}>{student.level.title}</div>
                  </div>
                  <div style={styles.leaderboardXP}>{student.xp} XP</div>
                </div>
              ))}
            </div>

            {currentRank > 10 && (
              <div style={styles.yourRank}>
                <div style={styles.yourRankText}>Your Rank: #{currentRank}</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Level Up Animation (would trigger on actual level up) */}
      {false && ( // Set to true when level increases
        <div style={styles.levelUpOverlay}>
          <div style={styles.levelUpContent}>
            <div style={styles.levelUpIcon}>🎉</div>
            <div style={styles.levelUpText}>LEVEL UP!</div>
            <div style={styles.levelUpSubtext}>You reached {currentLevel.title}</div>
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
  leaderboardBtn: {
    padding: '10px 20px',
    background: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '16px'
  },
  card: {
    padding: '24px',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    borderRadius: '12px',
    textAlign: 'center',
    border: '3px solid transparent',
    transition: 'transform 0.2s'
  },
  cardIcon: {
    fontSize: '48px',
    marginBottom: '12px'
  },
  levelTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '8px'
  },
  levelNumber: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#667eea',
    marginBottom: '8px'
  },
  xpText: {
    fontSize: '16px',
    color: '#666',
    marginBottom: '16px'
  },
  progressBar: {
    width: '100%',
    height: '8px',
    background: 'rgba(0,0,0,0.1)',
    borderRadius: '4px',
    overflow: 'hidden',
    marginBottom: '8px'
  },
  progressFill: {
    height: '100%',
    transition: 'width 0.3s'
  },
  progressText: {
    fontSize: '13px',
    color: '#888'
  },
  streakNumber: {
    fontSize: '48px',
    fontWeight: 'bold',
    color: '#ff6b35',
    marginBottom: '8px'
  },
  streakLabel: {
    fontSize: '16px',
    color: '#666',
    marginBottom: '16px'
  },
  streakDays: {
    display: 'flex',
    justifyContent: 'center',
    gap: '8px',
    marginBottom: '16px'
  },
  streakDay: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: '#ddd',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    color: '#999'
  },
  streakDayActive: {
    background: '#ff6b35',
    color: 'white',
    fontWeight: 'bold'
  },
  streakMotivation: {
    fontSize: '13px',
    color: '#666',
    fontStyle: 'italic'
  },
  rankNumber: {
    fontSize: '48px',
    fontWeight: 'bold',
    color: '#ffc107',
    marginBottom: '8px'
  },
  rankLabel: {
    fontSize: '16px',
    color: '#666',
    marginBottom: '12px'
  },
  rankMedal: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#333'
  },
  xpBreakdownTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '16px'
  },
  xpBreakdown: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  xpRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '14px',
    color: '#666'
  },
  xpValue: {
    fontWeight: 'bold',
    color: '#667eea'
  },
  xpTotal: {
    borderTop: '2px solid rgba(0,0,0,0.1)',
    paddingTop: '12px',
    fontSize: '16px',
    color: '#333'
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
    borderRadius: '16px',
    width: '90%',
    maxWidth: '600px',
    maxHeight: '80vh',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column'
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px',
    borderBottom: '1px solid #eee'
  },
  modalTitle: {
    fontSize: '24px',
    color: '#333',
    margin: 0
  },
  closeBtn: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    border: 'none',
    background: '#f5f5f5',
    cursor: 'pointer',
    fontSize: '20px',
    color: '#666'
  },
  leaderboardList: {
    flex: 1,
    overflowY: 'auto',
    padding: '24px'
  },
  leaderboardItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '16px',
    background: '#f9f9f9',
    borderRadius: '12px',
    marginBottom: '12px',
    transition: 'transform 0.2s'
  },
  leaderboardCurrentUser: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white'
  },
  leaderboardRank: {
    fontSize: '24px',
    fontWeight: 'bold',
    minWidth: '50px',
    textAlign: 'center'
  },
  leaderboardInfo: {
    flex: 1
  },
  leaderboardName: {
    fontSize: '16px',
    fontWeight: 'bold',
    marginBottom: '4px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  youBadge: {
    padding: '2px 8px',
    background: 'rgba(255,255,255,0.3)',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 'bold'
  },
  leaderboardLevel: {
    fontSize: '13px',
    opacity: 0.8
  },
  leaderboardXP: {
    fontSize: '18px',
    fontWeight: 'bold'
  },
  yourRank: {
    padding: '16px 24px',
    borderTop: '1px solid #eee',
    textAlign: 'center'
  },
  yourRankText: {
    fontSize: '16px',
    color: '#667eea',
    fontWeight: 'bold'
  },
  levelUpOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(102, 126, 234, 0.95)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000,
    animation: 'fadeIn 0.5s'
  },
  levelUpContent: {
    textAlign: 'center',
    color: 'white'
  },
  levelUpIcon: {
    fontSize: '120px',
    marginBottom: '24px',
    animation: 'bounce 1s infinite'
  },
  levelUpText: {
    fontSize: '64px',
    fontWeight: 'bold',
    marginBottom: '16px'
  },
  levelUpSubtext: {
    fontSize: '24px'
  }
};

export default GamificationSystem;