import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Award, TrendingUp, User } from 'lucide-react';

function Leaderboard({ currentUser }) {
  const [leaderboardData, setLeaderboardData] = useState([
    { rank: 1, name: 'Alex Chen', score: 98, topics: 45, streak: 28, avatar: '👨‍💻' },
    { rank: 2, name: 'Sarah Johnson', score: 96, topics: 42, streak: 25, avatar: '👩‍🎓' },
    { rank: 3, name: 'Mike Rodriguez', score: 94, topics: 40, streak: 22, avatar: '👨‍🏫' },
    { rank: 4, name: 'Emily Zhang', score: 92, topics: 38, streak: 20, avatar: '👩‍💼' },
    { rank: 5, name: 'James Wilson', score: 90, topics: 36, streak: 18, avatar: '👨‍🔬' },
    { rank: 6, name: 'Lisa Anderson', score: 88, topics: 34, streak: 15, avatar: '👩‍🚀' },
    { rank: 7, name: 'David Kim', score: 86, topics: 32, streak: 14, avatar: '👨‍🎨' },
    { rank: 8, name: 'Maria Garcia', score: 84, topics: 30, streak: 12, avatar: '👩‍⚕️' },
    { rank: 9, name: 'Tom Brown', score: 82, topics: 28, streak: 10, avatar: '👨‍✈️' },
    { rank: 10, name: 'Anna Lee', score: 80, topics: 26, streak: 8, avatar: '👩‍🔧' },
  ]);

  const getRankIcon = (rank) => {
    if (rank === 1) return { icon: Trophy, color: '#FFD700', label: '🥇' };
    if (rank === 2) return { icon: Medal, color: '#C0C0C0', label: '🥈' };
    if (rank === 3) return { icon: Award, color: '#CD7F32', label: '🥉' };
    return { icon: User, color: '#94A3B8', label: `#${rank}` };
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <Trophy size={32} style={styles.headerIcon} />
        <div>
          <h2 style={styles.title}>Global Leaderboard</h2>
          <p style={styles.subtitle}>Top performers this month</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <TrendingUp size={24} style={styles.statIcon} />
          <div style={styles.statValue}>2,847</div>
          <div style={styles.statLabel}>Active Learners</div>
        </div>
        <div style={styles.statCard}>
          <Award size={24} style={styles.statIcon} />
          <div style={styles.statValue}>15,293</div>
          <div style={styles.statLabel}>Topics Completed</div>
        </div>
        <div style={styles.statCard}>
          <Trophy size={24} style={styles.statIcon} />
          <div style={styles.statValue}>89%</div>
          <div style={styles.statLabel}>Avg Success Rate</div>
        </div>
      </div>

      {/* Leaderboard List */}
      <div style={styles.leaderboardList}>
        {leaderboardData.map((player, idx) => {
          const rankInfo = getRankIcon(player.rank);
          const isTopThree = player.rank <= 3;
          
          return (
            <div
              key={idx}
              style={{
                ...styles.playerCard,
                ...(isTopThree ? styles.topThreeCard : {})
              }}
            >
              <div style={styles.playerLeft}>
                <div style={{
                  ...styles.rankBadge,
                  ...(isTopThree ? { background: rankInfo.color } : {})
                }}>
                  {rankInfo.label}
                </div>
                <div style={styles.playerAvatar}>{player.avatar}</div>
                <div style={styles.playerInfo}>
                  <div style={styles.playerName}>{player.name}</div>
                  <div style={styles.playerStats}>
                    {player.topics} topics • {player.streak} day streak 🔥
                  </div>
                </div>
              </div>
              
              <div style={styles.playerScore}>
                <div style={styles.scoreValue}>{player.score}%</div>
                <div style={styles.scoreLabel}>Avg Score</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Your Rank */}
      <div style={styles.yourRank}>
        <div style={styles.yourRankLabel}>Your Current Rank</div>
        <div style={styles.yourRankValue}>#247</div>
        <p style={styles.yourRankText}>
          Keep learning to climb the leaderboard! 🚀
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '900px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    padding: '32px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '20px',
    color: 'white',
    marginBottom: '32px',
  },
  headerIcon: {
    animation: 'pulse 2s infinite',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    margin: 0,
  },
  subtitle: {
    fontSize: '15px',
    opacity: 0.9,
    margin: '4px 0 0 0',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '20px',
    marginBottom: '32px',
  },
  statCard: {
    background: 'white',
    padding: '24px',
    borderRadius: '16px',
    textAlign: 'center',
    border: '1px solid #E2E8F0',
  },
  statIcon: {
    color: '#667eea',
    marginBottom: '12px',
  },
  statValue: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: '4px',
  },
  statLabel: {
    fontSize: '13px',
    color: '#64748B',
    fontWeight: '500',
  },
  leaderboardList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '32px',
  },
  playerCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 24px',
    background: 'white',
    borderRadius: '16px',
    border: '1px solid #E2E8F0',
    transition: 'all 0.2s ease',
  },
  topThreeCard: {
    border: '2px solid #FFD700',
    boxShadow: '0 4px 16px rgba(255, 215, 0, 0.2)',
  },
  playerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    flex: 1,
  },
  rankBadge: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    background: '#F1F5F9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    fontWeight: '700',
    color: 'white',
  },
  playerAvatar: {
    fontSize: '32px',
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: '4px',
  },
  playerStats: {
    fontSize: '13px',
    color: '#64748B',
  },
  playerScore: {
    textAlign: 'right',
  },
  scoreValue: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#667eea',
    marginBottom: '4px',
  },
  scoreLabel: {
    fontSize: '12px',
    color: '#94A3B8',
  },
  yourRank: {
    padding: '32px',
    background: 'linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)',
    borderRadius: '20px',
    textAlign: 'center',
    border: '2px solid #BAE6FD',
  },
  yourRankLabel: {
    fontSize: '14px',
    color: '#0369A1',
    fontWeight: '600',
    marginBottom: '8px',
  },
  yourRankValue: {
    fontSize: '48px',
    fontWeight: '900',
    color: '#0284C7',
    marginBottom: '12px',
  },
  yourRankText: {
    fontSize: '15px',
    color: '#075985',
    margin: 0,
  },
};

export default Leaderboard;