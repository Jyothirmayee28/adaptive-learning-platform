import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, BookOpen, Video, Code, FileText, CheckCircle, RefreshCw } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

function TopicContentModal({ topic, onClose }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [content, setContent] = useState(null);
  const [practiceQuestions, setPracticeQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingPractice, setLoadingPractice] = useState(false);
  const [practiceAnswers, setPracticeAnswers] = useState({});

  useEffect(() => {
    loadContent();
    loadPracticeQuestions();
  }, [topic]);

  const loadContent = async () => {
    try {
      const response = await axios.get(`${API}/api/learning/topic-content?topic=${encodeURIComponent(topic)}`);
      setContent(response.data);
    } catch (err) {
      console.error('Error loading content:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadPracticeQuestions = async () => {
    setLoadingPractice(true);
    try {
      const response = await axios.get(
        `${API}/api/learning/practice-questions?topic=${encodeURIComponent(topic)}&count=6`
      );
      
      console.log('Practice questions loaded:', response.data);
      
      if (response.data.questions && response.data.questions.length > 0) {
        setPracticeQuestions(response.data.questions);
        setPracticeAnswers({}); // Reset answers when loading new questions
      } else {
        console.error('No questions in response');
      }
    } catch (err) {
      console.error('Error loading practice questions:', err);
      alert('Failed to load practice questions. Please try again.');
    } finally {
      setLoadingPractice(false);
    }
  };

  const handlePracticeAnswer = (questionId, answer) => {
    setPracticeAnswers({
      ...practiceAnswers,
      [questionId]: answer
    });
  };

  const checkPracticeAnswer = (questionId) => {
    const question = practiceQuestions.find(q => q.id === questionId);
    const userAnswer = practiceAnswers[questionId];
    
    if (!question || !userAnswer) return null;
    
    if (question.type === 'mcq') {
      return userAnswer === question.correct_answer;
    }
    
    // For coding and theory, we don't auto-check
    return null;
  };

  if (loading) {
    return (
      <div style={styles.overlay} onClick={onClose}>
        <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
          <div style={styles.loading}>
            <div style={styles.spinner}></div>
            <p>Loading content...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h2 style={styles.title}>{topic}</h2>
            <p style={styles.subtitle}>Explore comprehensive learning materials</p>
          </div>
          <button onClick={onClose} style={styles.closeButton}>
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div style={styles.tabs}>
          <button
            onClick={() => setActiveTab('overview')}
            style={{
              ...styles.tab,
              ...(activeTab === 'overview' ? styles.activeTab : {})
            }}
          >
            <BookOpen size={18} />
            <span>Overview</span>
          </button>
          <button
            onClick={() => setActiveTab('videos')}
            style={{
              ...styles.tab,
              ...(activeTab === 'videos' ? styles.activeTab : {})
            }}
          >
            <Video size={18} />
            <span>Videos</span>
          </button>
          <button
            onClick={() => setActiveTab('practice')}
            style={{
              ...styles.tab,
              ...(activeTab === 'practice' ? styles.activeTab : {})
            }}
          >
            <Code size={18} />
            <span>Practice</span>
          </button>
        </div>

        {/* Content */}
        <div style={styles.content}>
          {activeTab === 'overview' && (
            <OverviewTab content={content} topic={topic} />
          )}

          {activeTab === 'videos' && (
            <VideosTab topic={topic} />
          )}

          {activeTab === 'practice' && (
            <PracticeTab 
              topic={topic}
              questions={practiceQuestions}
              answers={practiceAnswers}
              onAnswer={handlePracticeAnswer}
              checkAnswer={checkPracticeAnswer}
              onLoadNew={loadPracticeQuestions}
              loading={loadingPractice}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// Overview Tab Component
function OverviewTab({ content, topic }) {
  return (
    <div style={styles.overviewContent}>
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>📚 What You'll Learn</h3>
        <p style={styles.text}>
          {content?.description || `Master the fundamentals and advanced concepts of ${topic}. This comprehensive guide will take you from basics to expert level.`}
        </p>
      </div>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>🎯 Key Concepts</h3>
        <ul style={styles.list}>
          {(content?.key_concepts || [
            'Understanding core principles and fundamentals',
            'Practical applications and real-world examples',
            'Best practices and design patterns',
            'Common pitfalls and how to avoid them',
            'Advanced techniques and optimizations'
          ]).map((concept, idx) => (
            <li key={idx} style={styles.listItem}>
              <CheckCircle size={18} style={styles.checkIcon} />
              <span>{concept}</span>
            </li>
          ))}
        </ul>
      </div>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>💡 Why It Matters</h3>
        <p style={styles.text}>
          {content?.why_matters || `Understanding ${topic} is crucial for your development as a programmer. It forms the foundation for more advanced topics and is widely used in real-world applications.`}
        </p>
      </div>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>🔗 Prerequisites</h3>
        <p style={styles.text}>
          {content?.prerequisites || 'Basic understanding of Python programming and fundamental data structures is recommended.'}
        </p>
      </div>
    </div>
  );
}

// Videos Tab Component
function VideosTab({ topic }) {
  const videoResources = [
    {
      title: `${topic} - Complete Tutorial`,
      duration: '25:30',
      thumbnail: '🎥',
      url: `https://www.youtube.com/results?search_query=${encodeURIComponent(topic + ' python tutorial')}`
    },
    {
      title: `${topic} - Crash Course`,
      duration: '15:45',
      thumbnail: '📺',
      url: `https://www.youtube.com/results?search_query=${encodeURIComponent(topic + ' crash course')}`
    },
    {
      title: `${topic} - Advanced Concepts`,
      duration: '32:15',
      thumbnail: '🎬',
      url: `https://www.youtube.com/results?search_query=${encodeURIComponent(topic + ' advanced')}`
    },
    {
      title: `${topic} - Real-World Examples`,
      duration: '18:20',
      thumbnail: '🎞️',
      url: `https://www.youtube.com/results?search_query=${encodeURIComponent(topic + ' examples')}`
    },
    {
      title: `${topic} - Interview Questions`,
      duration: '22:10',
      thumbnail: '💼',
      url: `https://www.youtube.com/results?search_query=${encodeURIComponent(topic + ' interview questions')}`
    },
    {
      title: `${topic} - Project-Based Learning`,
      duration: '45:30',
      thumbnail: '🚀',
      url: `https://www.youtube.com/results?search_query=${encodeURIComponent(topic + ' project tutorial')}`
    }
  ];

  return (
    <div style={styles.videosGrid}>
      {videoResources.map((video, idx) => {
        return (
          
            <a key={idx}
            href={video.url}
            target="_blank"
            rel="noopener noreferrer"
            style={styles.videoCard}
          >
            <div style={styles.videoThumbnail}>
              <span style={styles.videoIcon}>{video.thumbnail}</span>
              <span style={styles.videoDuration}>{video.duration}</span>
            </div>
            <div style={styles.videoInfo}>
              <h4 style={styles.videoTitle}>{video.title}</h4>
              <p style={styles.videoMeta}>Click to watch on YouTube</p>
            </div>
          </a>
        );
      })}
    </div>
  );
}
// Practice Tab Component
function PracticeTab({ topic, questions, answers, onAnswer, checkAnswer, onLoadNew, loading }) {
  const [selectedType, setSelectedType] = useState('all');

  if (loading) {
    return (
      <div style={styles.loadingPractice}>
        <div style={styles.spinner}></div>
        <p>🤖 AI is generating practice questions for {topic}...</p>
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div style={styles.emptyState}>
        <Code size={48} style={styles.emptyIcon} />
        <p>No practice questions available</p>
        <button onClick={onLoadNew} style={styles.loadNewButton}>
          <RefreshCw size={18} />
          <span>Generate Questions</span>
        </button>
      </div>
    );
  }

  const filteredQuestions = selectedType === 'all' 
    ? questions 
    : questions.filter(q => q.type === selectedType);

  return (
    <div>
      {/* Header with Load New Button */}
      <div style={styles.practiceHeader}>
        <div style={styles.practiceInfo}>
          <h3 style={styles.practiceTitle}>Practice Exercises</h3>
          <p style={styles.practiceSubtitle}>{questions.length} AI-generated questions for {topic}</p>
        </div>
        <button 
          onClick={onLoadNew} 
          style={styles.loadNewButton}
          disabled={loading}
        >
          <RefreshCw size={18} />
          <span>Load New Questions</span>
        </button>
      </div>

      {/* Question Type Filter */}
      <div style={styles.filterButtons}>
        <button
          onClick={() => setSelectedType('all')}
          style={{
            ...styles.filterButton,
            ...(selectedType === 'all' ? styles.filterButtonActive : {})
          }}
        >
          All ({questions.length})
        </button>
        <button
          onClick={() => setSelectedType('mcq')}
          style={{
            ...styles.filterButton,
            ...(selectedType === 'mcq' ? styles.filterButtonActive : {})
          }}
        >
          📝 MCQ ({questions.filter(q => q.type === 'mcq').length})
        </button>
        <button
          onClick={() => setSelectedType('coding')}
          style={{
            ...styles.filterButton,
            ...(selectedType === 'coding' ? styles.filterButtonActive : {})
          }}
        >
          💻 Coding ({questions.filter(q => q.type === 'coding').length})
        </button>
        <button
          onClick={() => setSelectedType('theory')}
          style={{
            ...styles.filterButton,
            ...(selectedType === 'theory' ? styles.filterButtonActive : {})
          }}
        >
          📖 Theory ({questions.filter(q => q.type === 'theory').length})
        </button>
      </div>

      {/* Questions */}
      <div style={styles.questionsContainer}>
        {filteredQuestions.length === 0 ? (
          <div style={styles.emptyFilter}>
            <p>No {selectedType} questions available</p>
          </div>
        ) : (
          filteredQuestions.map((question, idx) => {
            const isAnswered = answers[question.id];
            const isCorrect = checkAnswer(question.id);

            return (
              <div key={question.id} style={styles.practiceQuestion}>
                <div style={styles.questionHeader}>
                  <span style={styles.questionNumber}>Question {idx + 1}</span>
                  <span style={{
                    ...styles.questionType,
                    ...(question.type === 'mcq' ? { background: '#DBEAFE', color: '#1E40AF' } : {}),
                    ...(question.type === 'coding' ? { background: '#FEF3C7', color: '#92400E' } : {}),
                    ...(question.type === 'theory' ? { background: '#E0E7FF', color: '#3730A3' } : {})
                  }}>
                    {question.type === 'mcq' ? '📝 Multiple Choice' : 
                     question.type === 'coding' ? '💻 Coding Challenge' : 
                     '📖 Theory Question'}
                  </span>
                </div>

                <p style={styles.questionText}>{question.question}</p>

                {question.type === 'mcq' && (
                  <div style={styles.optionsGrid}>
                    {Object.entries(question.options).map(([key, value]) => (
                      <button
                        key={key}
                        onClick={() => onAnswer(question.id, key)}
                        style={{
                          ...styles.practiceOption,
                          ...(answers[question.id] === key ? styles.practiceOptionSelected : {}),
                          ...(isAnswered && key === question.correct_answer ? styles.practiceOptionCorrect : {}),
                          ...(isAnswered && answers[question.id] === key && !isCorrect ? styles.practiceOptionWrong : {})
                        }}
                        disabled={isAnswered}
                      >
                        <span style={styles.optionKey}>{key}</span>
                        <span>{value}</span>
                      </button>
                    ))}
                  </div>
                )}

                {question.type === 'coding' && (
                  <div style={styles.codingArea}>
                    <textarea
                      style={styles.codeInput}
                      placeholder="# Write your Python code here...\n\ndef solution():\n    # Your code here\n    pass"
                      rows={10}
                      onChange={(e) => onAnswer(question.id, e.target.value)}
                      value={answers[question.id] || ''}
                    />
                    {question.hint && (
                      <div style={styles.codeHint}>
                        💡 <strong>Hint:</strong> {question.hint}
                      </div>
                    )}
                  </div>
                )}

                {question.type === 'theory' && (
                  <div style={styles.theoryArea}>
                    <textarea
                      style={styles.theoryInput}
                      placeholder="Write your detailed answer here..."
                      rows={6}
                      onChange={(e) => onAnswer(question.id, e.target.value)}
                      value={answers[question.id] || ''}
                    />
                  </div>
                )}

                {isAnswered && question.explanation && (
                  <div style={styles.explanation}>
                    <strong>💡 Explanation:</strong> {question.explanation}
                  </div>
                )}

                {isAnswered && isCorrect === true && (
                  <div style={styles.correctBadge}>
                    ✓ Correct! Well done!
                  </div>
                )}

                {isAnswered && isCorrect === false && (
                  <div style={styles.wrongBadge}>
                    ✗ Incorrect. Review the explanation above.
                  </div>
                )}
              </div>
            );
          })
        )}
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
    background: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px',
  },
  modal: {
    background: 'white',
    borderRadius: '24px',
    width: '100%',
    maxWidth: '1000px',
    maxHeight: '90vh',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '32px 32px 24px',
    borderBottom: '1px solid #E2E8F0',
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1E1B4B',
    marginBottom: '4px',
  },
  subtitle: {
    fontSize: '14px',
    color: '#64748B',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '8px',
    color: '#64748B',
    borderRadius: '8px',
    transition: 'all 0.2s ease',
  },
  tabs: {
    display: 'flex',
    gap: '8px',
    padding: '16px 32px',
    borderBottom: '1px solid #E2E8F0',
    background: '#F8FAFC',
  },
  tab: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 20px',
    background: 'transparent',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    color: '#64748B',
    transition: 'all 0.2s ease',
  },
  activeTab: {
    background: 'white',
    color: '#667eea',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
  },
  content: {
    flex: 1,
    overflowY: 'auto',
    padding: '32px',
  },
  loading: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px',
  },
  loadingPractice: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 20px',
    color: '#64748B',
    fontSize: '15px',
    fontWeight: '500',
  },
  spinner: {
    width: '48px',
    height: '48px',
    border: '4px solid #E2E8F0',
    borderTop: '4px solid #667eea',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '16px',
  },
  overviewContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  section: {
    background: '#F8FAFC',
    padding: '24px',
    borderRadius: '16px',
    border: '1px solid #E2E8F0',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1E1B4B',
    marginBottom: '16px',
  },
  text: {
    fontSize: '15px',
    lineHeight: '1.7',
    color: '#475569',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  listItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    fontSize: '15px',
    color: '#475569',
  },
  checkIcon: {
    color: '#10B981',
    flexShrink: 0,
    marginTop: '2px',
  },
  videosGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '20px',
  },
  videoCard: {
    background: '#F8FAFC',
    borderRadius: '16px',
    overflow: 'hidden',
    textDecoration: 'none',
    transition: 'all 0.2s ease',
    border: '1px solid #E2E8F0',
  },
  videoThumbnail: {
    position: 'relative',
    height: '160px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoIcon: {
    fontSize: '56px',
  },
  videoDuration: {
    position: 'absolute',
    bottom: '12px',
    right: '12px',
    background: 'rgba(0, 0, 0, 0.8)',
    color: 'white',
    padding: '6px 10px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '600',
  },
  videoInfo: {
    padding: '16px',
  },
  videoTitle: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#1E1B4B',
    marginBottom: '8px',
  },
  videoMeta: {
    fontSize: '13px',
    color: '#64748B',
  },
  practiceHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    flexWrap: 'wrap',
    gap: '16px',
  },
  practiceInfo: {
    flex: 1,
  },
  practiceTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1E1B4B',
    marginBottom: '4px',
  },
  practiceSubtitle: {
    fontSize: '14px',
    color: '#64748B',
  },
  loadNewButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 24px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
  },
  filterButtons: {
    display: 'flex',
    gap: '12px',
    marginBottom: '24px',
    flexWrap: 'wrap',
  },
  filterButton: {
    padding: '10px 20px',
    background: '#F1F5F9',
    border: '1px solid #E2E8F0',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    color: '#64748B',
    transition: 'all 0.2s ease',
  },
  filterButtonActive: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: '1px solid #667eea',
  },
  questionsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  practiceQuestion: {
    background: '#F8FAFC',
    padding: '24px',
    borderRadius: '16px',
    border: '1px solid #E2E8F0',
  },
  questionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
    flexWrap: 'wrap',
    gap: '8px',
  },
  questionNumber: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#667eea',
  },
  questionType: {
    fontSize: '12px',
    padding: '6px 12px',
    borderRadius: '8px',
    fontWeight: '600',
  },
  questionText: {
    fontSize: '16px',
    fontWeight: '500',
    color: '#1E1B4B',
    marginBottom: '20px',
    lineHeight: '1.6',
  },
  optionsGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  practiceOption: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '14px 16px',
    background: 'white',
    border: '2px solid #E2E8F0',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '15px',
    textAlign: 'left',
    transition: 'all 0.2s ease',
  },
  practiceOptionSelected: {
    border: '2px solid #667eea',
    background: '#EEF2FF',
  },
  practiceOptionCorrect: {
    border: '2px solid #10B981',
    background: '#D1FAE5',
    cursor: 'not-allowed',
  },
  practiceOptionWrong: {
    border: '2px solid #EF4444',
    background: '#FEE2E2',
    cursor: 'not-allowed',
  },
  optionKey: {
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#F1F5F9',
    borderRadius: '8px',
    fontWeight: '700',
    color: '#667eea',
    flexShrink: 0,
  },
  codingArea: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  codeInput: {
    width: '100%',
    padding: '16px',
    background: '#1E293B',
    color: '#E2E8F0',
    border: '1px solid #334155',
    borderRadius: '12px',
    fontSize: '14px',
    fontFamily: '"Fira Code", "Consolas", "Monaco", monospace',
    resize: 'vertical',
    outline: 'none',
    lineHeight: '1.6',
  },
  codeHint: {
    fontSize: '13px',
    color: '#64748B',
    padding: '12px 16px',
    background: '#FEF3C7',
    borderRadius: '8px',
    lineHeight: '1.5',
  },
  theoryArea: {
    display: 'flex',
    flexDirection: 'column',
  },
  theoryInput: {
    width: '100%',
    padding: '16px',
    background: 'white',
    border: '2px solid #E2E8F0',
    borderRadius: '12px',
    fontSize: '15px',
    fontFamily: 'inherit',
    resize: 'vertical',
    outline: 'none',
    lineHeight: '1.6',
  },
  explanation: {
    marginTop: '16px',
    padding: '16px',
    background: '#F0F9FF',
    borderRadius: '12px',
    fontSize: '14px',
    color: '#0C4A6E',
    lineHeight: '1.6',
  },
  correctBadge: {
    marginTop: '12px',
    padding: '12px 16px',
    background: '#D1FAE5',
    color: '#065F46',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '600',
    textAlign: 'center',
  },
  wrongBadge: {
    marginTop: '12px',
    padding: '12px 16px',
    background: '#FEE2E2',
    color: '#991B1B',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '600',
    textAlign: 'center',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 20px',
    color: '#64748B',
    fontSize: '15px',
  },
  emptyIcon: {
    color: '#CBD5E1',
    marginBottom: '16px',
  },
  emptyFilter: {
    padding: '40px',
    textAlign: 'center',
    color: '#64748B',
    fontSize: '15px',
  },
};

// Add spinner animation
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);

export default TopicContentModal;