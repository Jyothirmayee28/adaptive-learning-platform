import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LearningRoadmap from './LearningRoadmap';
import AchievementBadges from './AchievementBadges';
import ScoreTrendChart from './ScoreTrendChart';
import QuizModule from './QuizModule';
import TopicContentModal from './TopicContentModal';
import ProgressAnalytics from './ProgressAnalytics';
import SpacedRepetition from './SpacedRepetition';
import GamificationSystem from './GamificationSystem';
import AIStudyBuddy from './AIStudyBuddy';

const API = 'http://127.0.0.1:8000';

function StudentDashboard({ user, onLogout }) {
  const [showContent, setShowContent] = useState(false);
  const [recommendation, setRecommendation] = useState(null);
  const [explanation, setExplanation] = useState('');
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizScore, setQuizScore] = useState(70);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [recRes, expRes, progRes] = await Promise.all([
        axios.get(`${API}/api/learning/recommendation/${user.student_id}`),
        axios.get(`${API}/api/learning/explanation/${user.student_id}`),
        axios.get(`${API}/api/learning/progress/${user.student_id}`)
      ]);
      setRecommendation(recRes.data.recommendation);
      setExplanation(expRes.data.explanation);
      setProgress(progRes.data);
    } catch (err) {
      console.error('Error loading data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteTask = async () => {
    try {
      await axios.post(`${API}/api/learning/submit-assessment`, {
        student_id: user.student_id,
        topic: progress.current_topic,
        score: quizScore,
        time_spent: 25,
        errors: ['minor mistakes']
      });
      setShowQuiz(false);
      loadData();
    } catch (err) {
      console.error(err);
      window.alert('Failed to submit assessment. Please try again.');
    }
  };

  if (loading) {
    return <div style={styles.loading}>Loading your personalized path...</div>;
  }

  if (error || !progress || !recommendation) {
    return (
      <div style={styles.errorContainer}>
        <h2 style={styles.errorTitle}>Unable to Load Dashboard</h2>
        <p style={styles.errorText}>
          {error || 'Failed to load student data. Please check if the backend is running.'}
        </p>
        <button style={styles.retryBtn} onClick={loadData}>
          Retry
        </button>
        <button style={styles.logoutBtn} onClick={onLogout}>
          Logout
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Welcome, {user.name}!</h1>
          <p style={styles.subtitle}>Your AI-powered learning journey</p>
        </div>
        <button style={styles.logoutBtn} onClick={onLogout}>Logout</button>
      </div>

      <LearningRoadmap 
        currentTopic={progress.current_topic}
        completedTopics={progress.completed_topics}
        nextTopic={recommendation.next_topic}
      />

      <AchievementBadges 
        completedTopics={progress.total_topics_completed}
        averageScore={progress.average_score}
      />

      <ScoreTrendChart performanceHistory={progress.performance_history || []} />

      <ProgressAnalytics 
        progress={progress}
        performanceHistory={progress.performance_history || []}
      />

      <SpacedRepetition 
        knowledgeState={progress.knowledge_state || {}}
        completedTopics={progress.completed_topics}
        onReviewTopic={(topic) => {
          window.alert(`Starting review session for: ${topic}`);
        }}
      />

      <GamificationSystem 
        studentId={user.student_id}
        completedTopics={progress.total_topics_completed}
        averageScore={progress.average_score}
      />

      <div style={styles.grid}>
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>📚 Current Topic</h2>
          <h3
            style={{...styles.currentTopic, cursor: 'pointer', textDecoration: 'underline'}}
            onClick={() => setShowContent(true)}
          >
            📚 {progress.current_topic} (Click to study)
          </h3>

          {showContent && (
            <TopicContentModal
              topic={progress.current_topic}
              onClose={() => setShowContent(false)}
            />
          )}

          <div style={styles.difficultyBar}>
            <div style={{ ...styles.difficultyFill, width: `${progress.difficulty_level * 20}%` }} />
          </div>
          <p style={styles.difficultyText}>Difficulty: {progress.difficulty_level.toFixed(1)}/5</p>
          
          {!showQuiz ? (
            <button style={styles.primaryBtn} onClick={() => setShowQuiz(true)}>
              Take Assessment
            </button>
          ) : (
            <QuizModule 
              topic={progress.current_topic}
              onSubmit={(score, errors) => {
                setQuizScore(score);
                handleCompleteTask();
              }}
            />
          )}
        </div>

        <div style={styles.card}>
          <h2 style={styles.cardTitle}>🎯 Next Recommended Topic</h2>
          <h3 style={styles.nextTopic}>{recommendation.next_topic}</h3>
          <p style={styles.reason}>{recommendation.reason}</p>
          <div style={styles.meta}>
            <span>⏱️ {recommendation.estimated_time}</span>
            <span>📊 Confidence: {(recommendation.confidence * 100).toFixed(0)}%</span>
          </div>
        </div>

        <div style={styles.card}>
          <h2 style={styles.cardTitle}>💡 Why Am I Learning This?</h2>
          <p style={styles.explanation}>{explanation}</p>
        </div>

        <div style={styles.card}>
          <h2 style={styles.cardTitle}>📈 Your Progress</h2>
          <div style={styles.statRow}>
            <span style={styles.statLabel}>Topics Completed:</span>
            <span style={styles.statValue}>{progress.total_topics_completed}</span>
          </div>
          <div style={styles.statRow}>
            <span style={styles.statLabel}>Average Score:</span>
            <span style={styles.statValue}>{progress.average_score}%</span>
          </div>
          <div style={styles.completedTopics}>
            {progress.completed_topics.map((topic, i) => (
              <span key={i} style={styles.topicBadge}>✓ {topic}</span>
            ))}
          </div>
        </div>
      </div>

      <AIStudyBuddy 
        currentTopic={progress.current_topic}
        studentName={user.name}
      />
    </div>
  );
}

const styles = {
  container: { padding: '32px', background: '#f5f7fa', minHeight: '100vh' },
  loading: { textAlign: 'center', fontSize: '20px', marginTop: '100px', color: '#667eea' },
  errorContainer: { 
    textAlign: 'center', 
    padding: '60px 20px', 
    maxWidth: '500px', 
    margin: '100px auto',
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
  },
  errorTitle: { fontSize: '24px', color: '#f44336', marginBottom: '16px' },
  errorText: { fontSize: '16px', color: '#666', marginBottom: '24px', lineHeight: '1.6' },
  retryBtn: { 
    padding: '12px 32px', 
    background: '#667eea', 
    color: 'white', 
    border: 'none', 
    borderRadius: '8px', 
    cursor: 'pointer',
    fontSize: '16px',
    marginRight: '12px'
  },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' },
  title: { fontSize: '28px', color: '#333', margin: 0 },
  subtitle: { color: '#888', margin: '4px 0 0 0' },
  logoutBtn: { padding: '10px 20px', background: '#f44336', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' },
  card: { background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  cardTitle: { fontSize: '18px', marginBottom: '16px', color: '#444' },
  currentTopic: { fontSize: '22px', color: '#667eea', margin: '8px 0' },
  difficultyBar: { width: '100%', height: '8px', background: '#eee', borderRadius: '4px', overflow: 'hidden', margin: '12px 0' },
  difficultyFill: { height: '100%', background: 'linear-gradient(90deg, #4caf50, #ff9800)', transition: 'width 0.3s' },
  difficultyText: { fontSize: '13px', color: '#888' },
  primaryBtn: { width: '100%', padding: '12px', background: '#667eea', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', marginTop: '16px', fontSize: '14px' },
  nextTopic: { fontSize: '20px', color: '#764ba2', margin: '8px 0' },
  reason: { fontSize: '14px', color: '#666', lineHeight: '1.6' },
  meta: { display: 'flex', gap: '16px', marginTop: '16px', fontSize: '13px', color: '#888' },
  explanation: { fontSize: '14px', color: '#555', lineHeight: '1.8' },
  statRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px' },
  statLabel: { color: '#666' },
  statValue: { fontWeight: 'bold', color: '#667eea' },
  completedTopics: { display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '16px' },
  topicBadge: { padding: '6px 12px', background: '#e8f5e9', color: '#4caf50', borderRadius: '16px', fontSize: '12px' }
};

export default StudentDashboard;