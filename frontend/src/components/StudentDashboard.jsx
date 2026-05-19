import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import AchievementBadges from './AchievementBadges';
import ScoreTrendChart from './ScoreTrendChart';
import QuizModule from './QuizModule';
import TopicContentModal from './TopicContentModal';
import ProgressAnalytics from './ProgressAnalytics';
import SpacedRepetition from './SpacedRepetition';
import GamificationSystem from './GamificationSystem';
import AIStudyBuddy from './AIStudyBuddy';
import CurriculumView from './CurriculumView';
import QuizHistoryModal from './QuizHistoryModal';
import ContentLibrary from './ContentLibrary';

const API = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

function StudentDashboard({ user, onLogout }) {
  const [activeView, setActiveView] = useState('roadmap');
  const [topicStartTime, setTopicStartTime] = useState(Date.now());
  const [showContent, setShowContent] = useState(false);
  const [recommendation, setRecommendation] = useState(null);
  const [explanation, setExplanation] = useState('');
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showQuizHistory, setShowQuizHistory] = useState(false);
  const [historyTopic, setHistoryTopic] = useState('');
  const [exploreTopicName, setExploreTopicName] = useState('');
  const [showContentLibrary, setShowContentLibrary] = useState(false);

  useEffect(() => {
    loadData();
    setTopicStartTime(Date.now());
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

  const handleCompleteTask = async (score) => {
    try {
      const timeSpentMinutes = Math.round((Date.now() - topicStartTime) / 60000);
      
      await axios.post(`${API}/api/learning/submit-assessment`, {
        student_id: user.student_id,
        topic: progress.current_topic,
        score: score,
        time_spent: timeSpentMinutes,
        errors: []
      });
      
      alert(score >= 70 ? 'Great job! Moving to next topic.' : 'Keep practicing!');
      
      await loadData();
      setTopicStartTime(Date.now());
      setActiveView('roadmap');
    } catch (err) {
      console.error(err);
      alert('Failed to submit assessment.');
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (error || !progress || !recommendation) {
    return <ErrorScreen error={error} onRetry={loadData} onLogout={onLogout} />;
  }

  return (
    <div style={styles.layout}>
      <Sidebar 
        activeView={activeView}
        setActiveView={setActiveView}
        user={user}
        onLogout={onLogout}
      />

      <div style={styles.mainContent}>
        <div style={styles.contentWrapper}>
          {activeView === 'dashboard' && (
            <DashboardView 
              progress={progress}
              recommendation={recommendation}
              explanation={explanation}
            />
          )}
          
         {activeView === 'roadmap' && (
  <div>
    <h1 style={styles.pageTitle}>🗺️ Learning Roadmap</h1>
    {user?.student_id ? (
      <LearningRoadmap 
        studentId={user.student_id}
        onExplore={(topicName) => {
          setExploreTopicName(topicName);
          setShowContent(true);
        }}
      />
    ) : (
      <div style={styles.card}>Loading...</div>
    )}
  </div>
)}

          {activeView === 'quiz' && (
            <div>
              <h1 style={styles.pageTitle}>📝 Quiz Assessment</h1>
              <div style={styles.quizCard}>
                <h2 style={styles.currentTopic}>{progress.current_topic}</h2>
                <p style={styles.topicDesc}>
                  Take the assessment to test your knowledge
                </p>
                <QuizModule 
                  topic={progress.current_topic}
                  studentId={user.student_id}
                  onSubmit={handleCompleteTask}
                />
              </div>
            </div>
          )}

          {activeView === 'progress' && (
            <div>
              <h1 style={styles.pageTitle}>📊 Progress Analytics</h1>
              <ProgressAnalytics 
                progress={progress}
                performanceHistory={progress.performance_history || []}
              />
              <div style={styles.chartsGrid}>
                <ScoreTrendChart performanceHistory={progress.performance_history || []} />
              </div>
            </div>
          )}

          {activeView === 'achievements' && (
            <div>
              <h1 style={styles.pageTitle}>🏆 Achievements</h1>
              <AchievementBadges 
                completedTopics={progress.total_topics_completed}
                averageScore={progress.average_score}
              />
              <GamificationSystem 
                studentId={user.student_id}
                completedTopics={progress.total_topics_completed}
                averageScore={progress.average_score}
              />
            </div>
          )}

          {activeView === 'spaced' && (
            <div>
              <h1 style={styles.pageTitle}>🔄 Spaced Repetition</h1>
              <SpacedRepetition 
                knowledgeState={progress.knowledge_state || {}}
                completedTopics={progress.completed_topics}
                onReviewTopic={(topic) => alert(`Review: ${topic}`)}
              />
            </div>
          )}

          {activeView === 'chat' && (
            <div>
              <h1 style={styles.pageTitle}>💬 AI Study Buddy</h1>
              <AIStudyBuddy 
                currentTopic={progress.current_topic}
                studentName={user.name}
              />
            </div>
          )}

          {activeView === 'curriculum' && (
            <div>
              <h1 style={styles.pageTitle}>📚 Full Curriculum</h1>
              {user?.student_id ? (
                <FullCurriculum studentId={user.student_id} />
              ) : (
                <div style={styles.card}>Loading...</div>
              )}
            </div>
          )}
          {activeView === 'content-library' && (
            <div>
              <h1 style={styles.pageTitle}>📚 Content Library</h1>
              <p style={styles.pageSubtitle}>
                Complete course content from Python to Machine Learning
              </p>
              <ContentLibrary onClose={() => setActiveView('dashboard')} />
            </div>
          )}
        </div>
      </div>

      {showContent && (
  <TopicContentModal
    topic={exploreTopicName || progress.current_topic}
    onClose={() => setShowContent(false)}
  />
)}
    {showContent && (
        <TopicContentModal
          topic={exploreTopicName || progress.current_topic}
          onClose={() => setShowContent(false)}
        />
      )}

      {/* ⬇️ ADD THIS HERE ⬇️ */}
      {activeView === 'content-library' && (
  <div>
    <h1 style={styles.pageTitle}>📚 Content Library</h1>
    <p style={styles.pageSubtitle}>
      Complete Python to ML Course Content
    </p>
    <ContentLibrary onClose={() => setActiveView('dashboard')} />  {/* ✅ CORRECT */}
  </div>
)}
      {/* ⬆️ END OF NEW COMPONENT ⬆️ */}
      {showQuizHistory && (
        <QuizHistoryModal
          topic={historyTopic}
          attempts={(progress.performance_history || [])
            .filter(h => h.topic === historyTopic && h.total === 5)
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
          }
          onClose={() => setShowQuizHistory(false)}
          onRetakeQuiz={() => {
            setShowQuizHistory(false);
            setActiveView('quiz');
          }}
        />
      )}
    </div>
  );
}

function LearningRoadmap({ studentId, onExplore }) {
  const [learningPath, setLearningPath] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLearningPath();
  }, [studentId]);

  const loadLearningPath = async () => {
    try {
      const response = await axios.get(`${API}/api/learning/learning-path/${studentId}`);
      if (response.data.success) {
        setLearningPath(response.data.learning_path || []);
      }
    } catch (error) {
      console.error('Error loading learning path:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={styles.card}>Loading roadmap...</div>;
  }

  const completedTopics = learningPath.filter(t => t.status === 'completed');
  const currentTopic = learningPath.find(t => t.status === 'available') || null;
  const upcomingTopics = learningPath.filter(t => t.status === 'available').slice(1, 4);
  const lockedTopics = learningPath.filter(t => t.status === 'locked');

  return (
    <div style={styles.roadmapFlowContainer}>
      {/* COMPLETED TOPICS SECTION */}
      {completedTopics.length > 0 && (
        <div style={styles.flowSection}>
          <h3 style={styles.flowSectionTitle}>✅ Completed Topics ({completedTopics.length})</h3>
          <div style={styles.flowItems}>
            {completedTopics.map((topic, idx) => (
              <div key={idx} style={styles.flowCard}>
                <div style={styles.flowCardHeader}>
                  <div style={{...styles.flowIcon, background: '#10B981'}}>✓</div>
                  <span style={styles.flowStatus}>Completed</span>
                </div>
                <h4 style={styles.flowCardTitle}>{topic.topic}</h4>
                <p style={styles.flowCardMeta}>
                  {topic.estimated_time} • Difficulty {topic.difficulty}/5
                </p>
                <button
                  onClick={() => onExplore(topic.topic)}
                  style={styles.flowReviewButton}
                >
                  📖 Review Topic
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FLOW CONNECTOR */}
      {completedTopics.length > 0 && currentTopic && (
        <div style={styles.flowConnector}>
          <div style={styles.flowArrow}>↓</div>
        </div>
      )}

      {/* CURRENT TOPIC SECTION */}
      {currentTopic && (
        <div style={styles.flowSection}>
          <h3 style={styles.flowSectionTitle}>📍 Current Topic</h3>
          <div style={styles.currentTopicCard}>
            <div style={styles.currentTopicBadge}>
              <div style={{...styles.flowIcon, background: '#667eea'}}>📍</div>
              <span style={styles.currentTopicStatus}>IN PROGRESS</span>
            </div>
            <h2 style={styles.currentTopicTitle}>{currentTopic.topic}</h2>
            <p style={styles.currentTopicMeta}>
              Difficulty {currentTopic.difficulty}/5 • {currentTopic.estimated_time}
            </p>
            <p style={styles.currentTopicCategory}>{currentTopic.category}</p>
            <button
              onClick={() => onExplore(currentTopic.topic)}
              style={styles.exploreCurrentButton}
            >
              🚀 Explore & Learn
            </button>
  
          </div>
        </div>
      )}

      {/* FLOW CONNECTOR */}
      {currentTopic && upcomingTopics.length > 0 && (
        <div style={styles.flowConnector}>
          <div style={styles.flowArrow}>↓</div>
          <span style={styles.flowConnectorText}>After completing current topic</span>
        </div>
      )}

      {/* UPCOMING TOPICS SECTION */}
      {upcomingTopics.length > 0 && (
        <div style={styles.flowSection}>
          <h3 style={styles.flowSectionTitle}>🎯 Up Next (AI Recommended)</h3>
          <div style={styles.flowItems}>
            {upcomingTopics.map((topic, idx) => (
              <div key={idx} style={styles.flowCard}>
                <div style={styles.flowCardHeader}>
                  <div style={{...styles.flowIcon, background: '#94A3B8'}}>{idx + 1}</div>
                  <span style={{...styles.flowStatus, background: '#EEF2FF', color: '#667eea'}}>
                    Next
                  </span>
                </div>
                <h4 style={styles.flowCardTitle}>{topic.topic}</h4>
                <p style={styles.flowCardMeta}>
                  {topic.estimated_time} • Difficulty {topic.difficulty}/5
                </p>
                <p style={styles.flowCardCategory}>{topic.category}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* LOCKED TOPICS */}
      {lockedTopics.length > 0 && (
        <div style={styles.lockedSection}>
          <div style={styles.lockedIcon}>🔒</div>
          <p style={styles.lockedText}>
            {lockedTopics.length} more topics locked
          </p>
          <p style={styles.lockedHint}>
            Complete prerequisites to unlock
          </p>
        </div>
      )}
    </div>
  );
}

function DashboardView({ progress, recommendation, explanation }) {
  return (
    <div>
      <h1 style={styles.pageTitle}>🏠 Dashboard</h1>
      
      <div style={styles.statsGrid}>
        <StatCard icon="🎯" label="Completed Topics" value={progress.total_topics_completed} />
        <StatCard icon="⭐" label="Average Score" value={`${progress.average_score}%`} />
        <StatCard icon="📚" label="Current Topic" value={progress.current_topic} />
      </div>

      <div style={styles.infoCard}>
        <h3 style={styles.infoTitle}>💡 Why You're Learning This</h3>
        <p style={styles.infoText}>{explanation}</p>
      </div>

      <div style={styles.infoCard}>
        <h3 style={styles.infoTitle}>🎯 Up Next</h3>
        <p style={styles.infoText}><strong>{recommendation.next_topic}</strong></p>
        <p style={styles.infoText}>{recommendation.reason}</p>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div style={styles.statCard}>
      <span style={styles.statIcon}>{icon}</span>
      <div style={styles.statValue}>{value}</div>
      <div style={styles.statLabel}>{label}</div>
    </div>
  );
}

function LoadingScreen() {
  return (
    <div style={styles.loadingScreen}>
      <div style={styles.spinner}></div>
      <p style={styles.loadingText}>Loading your dashboard...</p>
    </div>
  );
}

function FullCurriculum({ studentId }) {
  const [curriculum, setCurriculum] = useState({});
  const [completedTopics, setCompletedTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState({
    'Fundamentals': true,
    'Control Structures': false,
    'Data Structures': false,
    'Functions': false,
    'Advanced Syntax': false,
    'I/O Operations': false,
    'Error Management': false,
    'OOP': false,
    'Code Organization': false,
    'Data Science': false,
    'Machine Learning': false
  });

  useEffect(() => {
    loadCurriculum();
  }, [studentId]);

  const loadCurriculum = async () => {
    try {
      const [currResponse, pathResponse] = await Promise.all([
        axios.get(`${API}/api/learning/curriculum`),
        axios.get(`${API}/api/learning/learning-path/${studentId}`)
      ]);

      if (currResponse.data.success) {
        setCurriculum(currResponse.data.curriculum);
      }
      if (pathResponse.data.success) {
        setCompletedTopics(pathResponse.data.completed_topics || []);
      }
    } catch (error) {
      console.error('Error loading curriculum:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  if (loading) {
    return <div style={styles.card}>Loading curriculum...</div>;
  }

  const groupedTopics = {};
  Object.entries(curriculum).forEach(([topicName, topicInfo]) => {
    const category = topicInfo.category;
    if (!groupedTopics[category]) {
      groupedTopics[category] = [];
    }
    groupedTopics[category].push({ name: topicName, ...topicInfo });
  });

  Object.keys(groupedTopics).forEach(category => {
    groupedTopics[category].sort((a, b) => a.difficulty - b.difficulty);
  });

  const totalTopics = Object.keys(curriculum).length;
  const completedCount = completedTopics.length;

  return (
    <div style={styles.card}>
      <h3 style={styles.cardTitle}>📚 Complete Curriculum</h3>
      <p style={styles.curriculumSubtitle}>
        Python → Data Science → Machine Learning ({completedCount}/{totalTopics} topics completed)
      </p>

      {Object.entries(groupedTopics).map(([category, topics]) => {
        const categoryCompleted = topics.filter(t => completedTopics.includes(t.name)).length;
        const categoryTotal = topics.length;
        const difficultyRange = `${Math.min(...topics.map(t => t.difficulty))}-${Math.max(...topics.map(t => t.difficulty))}`;

        return (
          <div key={category} style={styles.categorySection}>
            <div 
              style={styles.categoryHeader}
              onClick={() => toggleCategory(category)}
            >
              <div style={styles.categoryTitle}>
                <span style={styles.categoryIcon}>
                  {expandedCategories[category] ? '▼' : '▶'}
                </span>
                <span>{getCategoryEmoji(category)} {category}</span>
              </div>
              <div style={styles.categoryMeta}>
                <span style={styles.categoryDifficulty}>Difficulty: {difficultyRange}</span>
                <span style={styles.categoryProgress}>{categoryCompleted}/{categoryTotal}</span>
              </div>
            </div>

            {expandedCategories[category] && (
              <div style={styles.topicsList}>
                {topics.map((topic, idx) => {
                  const isCompleted = completedTopics.includes(topic.name);
                  const isLocked = topic.prerequisites?.some(p => !completedTopics.includes(p));

                  return (
                    <div key={idx} style={styles.topicItem}>
                      <span style={styles.topicIcon}>
                        {isCompleted ? '✅' : isLocked ? '🔒' : '⭕'}
                      </span>
                      <div style={styles.topicInfo}>
                        <div style={{
                          ...styles.topicName,
                          color: isCompleted ? '#10B981' : isLocked ? '#94A3B8' : '#1E1B4B'
                        }}>
                          {topic.name}
                        </div>
                        <div style={styles.topicDetails}>
                          {topic.estimated_time} • Difficulty {topic.difficulty}/5
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function getCategoryEmoji(category) {
  const emojis = {
    'Fundamentals': '🐍',
    'Control Structures': '🔄',
    'Data Structures': '📦',
    'Functions': '⚡',
    'Advanced Syntax': '🎯',
    'I/O Operations': '📁',
    'Error Management': '🛡️',
    'OOP': '🏗️',
    'Code Organization': '📚',
    'Data Science': '📊',
    'Machine Learning': '🤖'
  };
  return emojis[category] || '📌';
}

function ErrorScreen({ error, onRetry, onLogout }) {
  return (
    <div style={styles.errorScreen}>
      <h2 style={styles.errorTitle}>Something went wrong</h2>
      <p style={styles.errorText}>{error}</p>
      <button onClick={onRetry} style={styles.button}>Retry</button>
      <button onClick={onLogout} style={{...styles.button, background: '#EF4444'}}>Logout</button>
    </div>
  );
}

const styles = {
  card: {
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    padding: '32px',
    borderRadius: '20px',
    border: '1px solid rgba(102, 126, 234, 0.1)',
    boxShadow: '0 8px 32px rgba(102, 126, 234, 0.08)',
    marginBottom: '24px',
  },
  cardTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1E1B4B',
    marginBottom: '24px',
  },
  roadmapContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  roadmapItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '20px',
    background: '#F8FAFC',
    borderRadius: '16px',
    border: '1px solid #E2E8F0',
    transition: 'all 0.3s ease',
  },
  roadmapIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    fontWeight: '700',
    color: 'white',
    flexShrink: 0,
  },
  roadmapContent: {
    flex: 1,
  },
  roadmapTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1E1B4B',
    marginBottom: '4px',
  },
  roadmapSubtitle: {
    fontSize: '14px',
    color: '#64748B',
  },
  roadmapBadge: {
    padding: '8px 16px',
    borderRadius: '12px',
    fontSize: '13px',
    fontWeight: '600',
  },
  curriculumSubtitle: {
    fontSize: '14px',
    color: '#64748B',
    marginBottom: '20px',
  },
  categorySection: {
    marginBottom: '16px',
    border: '1px solid #E2E8F0',
    borderRadius: '12px',
    overflow: 'hidden',
  },
  categoryHeader: {
    padding: '16px',
    background: '#F8FAFC',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    transition: 'background 0.2s',
  },
  categoryTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1E1B4B',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  categoryIcon: {
    fontSize: '12px',
    color: '#64748B',
  },
  categoryMeta: {
    display: 'flex',
    gap: '16px',
    fontSize: '13px',
  },
  categoryDifficulty: {
    color: '#64748B',
  },
  categoryProgress: {
    fontWeight: '600',
    color: '#667eea',
  },
  topicsList: {
    padding: '12px',
  },
  topicItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px',
    borderRadius: '8px',
    marginBottom: '8px',
    transition: 'background 0.2s',
  },
  topicIcon: {
    fontSize: '18px',
  },
  topicInfo: {
    flex: 1,
  },
  topicName: {
    fontSize: '14px',
    fontWeight: '500',
    marginBottom: '4px',
  },
  topicDetails: {
    fontSize: '12px',
    color: '#94A3B8',
  },
  layout: {
    display: 'flex',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%)',
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  mainContent: {
    marginLeft: '280px',
    flex: 1,
    padding: '40px',
    overflowY: 'auto',
    background: 'linear-gradient(135deg, #faf5ff 0%, #f3f4ff 50%, #faf5ff 100%)',
  },
  contentWrapper: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  pageTitle: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#1E1B4B',
    marginBottom: '32px',
    letterSpacing: '-0.5px',
    textShadow: '0 2px 4px rgba(102, 126, 234, 0.1)',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '24px',
    marginBottom: '32px',
  },
  statCard: {
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    padding: '32px',
    borderRadius: '20px',
    textAlign: 'center',
    border: '1px solid rgba(102, 126, 234, 0.1)',
    boxShadow: '0 8px 32px rgba(102, 126, 234, 0.08)',
    transition: 'all 0.3s ease',
  },
  statIcon: {
    fontSize: '48px',
    marginBottom: '16px',
    display: 'block',
    filter: 'drop-shadow(0 2px 4px rgba(102, 126, 234, 0.2))',
  },
  statValue: {
    fontSize: '36px',
    fontWeight: '700',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '8px',
  },
  statLabel: {
    fontSize: '14px',
    color: '#64748B',
    fontWeight: '500',
  },
  infoCard: {
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    padding: '32px',
    borderRadius: '20px',
    marginBottom: '24px',
    border: '1px solid rgba(102, 126, 234, 0.1)',
    boxShadow: '0 8px 32px rgba(102, 126, 234, 0.08)',
  },
  infoTitle: {
    fontSize: '20px',
    fontWeight: '600',
    marginBottom: '16px',
    color: '#1E1B4B',
  },
  
  roadmapFlowContainer: {
  display: 'flex',
  flexDirection: 'column',
  gap: '32px',
},
flowSection: {
  background: 'white',
  padding: '32px',
  borderRadius: '20px',
  border: '1px solid #E2E8F0',
  boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
},
flowSectionTitle: {
  fontSize: '18px',
  fontWeight: '700',
  color: '#1E1B4B',
  marginBottom: '24px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
},
flowItems: {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
  gap: '20px',
},
flowCard: {
  background: '#F8FAFC',
  padding: '20px',
  borderRadius: '16px',
  border: '2px solid #E2E8F0',
  transition: 'all 0.3s',
},
flowCardHeader: {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '12px',
},
flowIcon: {
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '18px',
  fontWeight: '700',
  color: 'white',
},
flowStatus: {
  fontSize: '11px',
  fontWeight: '700',
  padding: '4px 10px',
  borderRadius: '8px',
  background: '#D1FAE5',
  color: '#065F46',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
},
flowCardTitle: {
  fontSize: '16px',
  fontWeight: '700',
  color: '#1E1B4B',
  marginBottom: '8px',
},
flowCardMeta: {
  fontSize: '13px',
  color: '#64748B',
  marginBottom: '8px',
},
flowCardCategory: {
  fontSize: '12px',
  color: '#667eea',
  fontWeight: '600',
},
flowReviewButton: {
  width: '100%',
  padding: '12px',
  marginTop: '12px',
  background: '#F1F5F9',
  border: '1px solid #E2E8F0',
  borderRadius: '10px',
  fontSize: '14px',
  fontWeight: '600',
  color: '#475569',
  cursor: 'pointer',
  transition: 'all 0.3s',
},
flowConnector: {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '8px',
  padding: '16px 0',
},
flowArrow: {
  fontSize: '32px',
  color: '#667eea',
  fontWeight: '700',
},
flowConnectorText: {
  fontSize: '13px',
  color: '#64748B',
  fontWeight: '500',
},
currentTopicCard: {
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  padding: '40px',
  borderRadius: '20px',
  textAlign: 'center',
  color: 'white',
},
currentTopicBadge: {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '12px',
  marginBottom: '20px',
},
currentTopicStatus: {
  fontSize: '12px',
  fontWeight: '700',
  padding: '6px 12px',
  borderRadius: '8px',
  background: 'rgba(255,255,255,0.2)',
  letterSpacing: '1px',
},
currentTopicTitle: {
  fontSize: '32px',
  fontWeight: '700',
  marginBottom: '12px',
},
currentTopicMeta: {
  fontSize: '15px',
  opacity: 0.9,
  marginBottom: '8px',
},
currentTopicCategory: {
  fontSize: '14px',
  opacity: 0.8,
  marginBottom: '24px',
},
exploreCurrentButton: {
  padding: '16px 40px',
  background: 'white',
  color: '#667eea',
  border: 'none',
  borderRadius: '12px',
  fontSize: '16px',
  fontWeight: '700',
  cursor: 'pointer',
  boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
  transition: 'all 0.3s',
},
lockedSection: {
  textAlign: 'center',
  padding: '40px',
  background: '#F8FAFC',
  borderRadius: '16px',
  border: '2px dashed #CBD5E1',
},
lockedIcon: {
  fontSize: '48px',
  marginBottom: '12px',
},
lockedText: {
  fontSize: '16px',
  fontWeight: '600',
  color: '#475569',
  marginBottom: '4px',
},
lockedHint: {
  fontSize: '14px',
  color: '#94A3B8',
},
  infoText: {
    fontSize: '15px',
    lineHeight: '1.7',
    color: '#475569',
    marginBottom: '8px',
  },
  quizCard: {
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    padding: '40px',
    borderRadius: '20px',
    border: '1px solid rgba(102, 126, 234, 0.1)',
    boxShadow: '0 8px 32px rgba(102, 126, 234, 0.08)',
  },
  currentTopic: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1E1B4B',
    marginBottom: '12px',
  },
  topicDesc: {
    fontSize: '16px',
    color: '#64748B',
    marginBottom: '32px',
  },
  exploreButton: {
  padding: '10px 20px',
  background: '#F1F5F9',
  color: '#475569',
  border: '1px solid #E2E8F0',
  borderRadius: '10px',
  fontSize: '13px',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'all 0.3s',
},

exploreButtonCurrent: {
  padding: '10px 20px',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  border: 'none',
  borderRadius: '10px',
  fontSize: '13px',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'all 0.3s',
  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
},
  chartsGrid: {
    display: 'grid',
    gap: '24px',
    marginTop: '24px',
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
    border: '5px solid rgba(102, 126, 234, 0.1)',
    borderTop: '5px solid #667eea',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '24px',
  },
  loadingText: {
    fontSize: '16px',
    color: '#475569',
    fontWeight: '500',
  },
  errorScreen: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #faf5ff 0%, #f3f4ff 50%, #faf5ff 100%)',
    padding: '40px',
    textAlign: 'center',
  },
  errorTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1E1B4B',
    marginBottom: '16px',
  },
  errorText: {
    fontSize: '16px',
    color: '#64748B',
    marginBottom: '32px',
  },
  button: {
    padding: '12px 32px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    margin: '8px',
    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
    transition: 'all 0.3s ease',
  },
};
{/* Temporary test button - add this ANYWHERE in your JSX */}
<button 
  onClick={() => {
    console.log('Button clicked!');
    setShowContentLibrary(true);
  }}
  style={{
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    padding: '20px',
    background: 'red',
    color: 'white',
    fontSize: '20px',
    zIndex: 9999,
    cursor: 'pointer',
  }}
>
  TEST LIBRARY
</button>


const quizStyleSheet = document.createElement('style');
quizStyleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
`;
document.head.appendChild(quizStyleSheet);

export default StudentDashboard;