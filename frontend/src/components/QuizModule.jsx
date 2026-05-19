import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'https://adaptive-learning-platform-luzq.onrender.com';

function QuizModule({ topic, studentId, onSubmit }) {
  console.log('QuizModule props:', { topic, studentId });
  
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [quizStartTime, setQuizStartTime] = useState(Date.now()); // FIXED: Changed from startTime
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState(null);

  useEffect(() => {
    setQuizStartTime(Date.now()); // Reset timer when topic changes
    loadQuiz();
  }, [topic]);

  const loadQuiz = async () => {
    setLoading(true);
    setError('');
    try {
      console.log('Loading quiz for:', topic, 'Student ID:', studentId);
      
      const response = await axios.post(
        `${API}/api/learning/generate-quiz?topic=${encodeURIComponent(topic)}&student_id=${studentId}`
      );
      
      console.log('Quiz loaded successfully:', response.data);
      setQuestions(response.data.questions);
      setAnswers({});
    } catch (err) {
      console.error('Error loading quiz:', err);
      console.error('Error response:', err.response?.data);
      setError(`Failed to load quiz: ${err.response?.data?.detail || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionId, answer) => {
    setAnswers({
      ...answers,
      [questionId]: answer
    });
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length < questions.length) {
      alert('Please answer all questions before submitting!');
      return;
    }

    setSubmitting(true);

    try {
      const timeSpent = Math.floor((Date.now() - quizStartTime) / 1000 / 60); // minutes
      
      console.log('Submitting quiz:', {
        student_id: studentId,
        topic: topic,
        answers: answers,
        time_spent: timeSpent
      });

      const response = await axios.post(`${API}/api/learning/submit-quiz`, {
        student_id: studentId,
        topic: topic,
        answers: answers,
        time_spent: timeSpent
      });

      console.log('Quiz response:', response.data);

      if (response.data.success) {
        setResults({
          score: response.data.score,
          passed: response.data.passed,
          correct: response.data.correct,
          total: response.data.total,
          message: response.data.message,
          detailed_results: response.data.detailed_results || [],
          attempt_number: response.data.attempt_number
        });
        setShowResults(true);

        // Auto redirect after 5 seconds if passed
        if (response.data.passed) {
          setTimeout(() => {
            onSubmit(response.data.score, []);
          }, 5000);
        }
      }
    } catch (error) {
      console.error('Quiz submission error:', error);
      console.error('Error response:', error.response?.data);
      alert(`Failed to submit quiz: ${error.response?.data?.detail || error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>🤖 AI is generating unique questions for you...</p>
          <p style={styles.loadingSubtext}>This may take a few seconds</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.error}>{error}</div>
        <button onClick={loadQuiz} style={styles.retryButton}>
          🔄 Try Again
        </button>
      </div>
    );
  }

  if (showResults && results) {
    return (
      <div style={styles.resultsContainer}>
        <div style={{
          ...styles.scoreCard,
          background: results.passed 
            ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
            : 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)'
        }}>
          <h2 style={styles.scoreTitle}>
            {results.passed ? '🎉 Congratulations!' : '📚 Keep Learning!'}
          </h2>
          <div style={styles.scoreValue}>{results.score}%</div>
          <p style={styles.scoreDetails}>
            {results.correct} out of {results.total} correct
          </p>
          <p style={styles.attemptInfo}>Attempt #{results.attempt_number}</p>
        </div>

        <div style={styles.resultsList}>
          <h3 style={styles.resultsTitle}>📊 Detailed Results:</h3>
          {results.detailed_results.map((result, index) => (
            <div 
              key={index}
              style={{
                ...styles.resultItem,
                borderLeft: result.is_correct 
                  ? '4px solid #10B981' 
                  : '4px solid #EF4444'
              }}
            >
              <div style={styles.resultQuestion}>
                <strong>Q{index + 1}:</strong> {result.question}
              </div>
              <div style={styles.resultAnswers}>
                <div style={result.is_correct ? styles.correctAnswer : styles.wrongAnswer}>
                  Your answer: <strong>{result.user_answer || 'Not answered'}</strong>
                </div>
                {!result.is_correct && (
                  <div style={styles.correctAnswer}>
                    Correct answer: <strong>{result.correct_answer}</strong>
                  </div>
                )}
                <div style={styles.retrySection}>
                <p style={styles.redirectMessage}>
                {results.passed 
                ? '🚀 Moving to next topic in 5 seconds...' 
                : 'You need 70% to pass. Review the explanations above and try again!'}
               </p>
  
  {!results.passed && (
    <button 
      onClick={() => {
        setShowResults(false);
        setAnswers({});
        setQuizStartTime(Date.now());
        loadQuiz();
      }}
      style={styles.retryQuizButton}
    >
      🔄 Retry Quiz
    </button>
  )}
</div>
              </div>
              {result.explanation && (
                <div style={styles.explanation}>
                  💡 {result.explanation}
                </div>
              )}
            </div>
          ))}
        </div>

        <p style={styles.redirectMessage}>
          {results.passed 
            ? '🚀 Moving to next topic in 5 seconds...' 
            : '🔄 Try again to pass this topic!'}
        </p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>📝 {topic} Assessment</h2>
        <p style={styles.subtitle}>
          Answer all {questions.length} AI-generated questions • 70% required to pass
        </p>
        <div style={styles.progress}>
          {Object.keys(answers).length} / {questions.length} answered
        </div>
      </div>

      <div style={styles.questionsContainer}>
        {questions.map((q, index) => (
          <div key={q.id} style={styles.questionCard}>
            <div style={styles.questionHeader}>
              <span style={styles.questionNumber}>Question {index + 1}</span>
              <span style={answers[q.id] ? styles.answeredBadge : styles.unansweredBadge}>
                {answers[q.id] ? '✓ Answered' : 'Not answered'}
              </span>
            </div>
            
            <p style={styles.questionText}>{q.question}</p>
            
            <div style={styles.optionsGrid}>
              {Object.entries(q.options).map(([key, value]) => (
                <button
                  key={key}
                  onClick={() => handleAnswerSelect(q.id, key)}
                  style={{
                    ...styles.optionButton,
                    ...(answers[q.id] === key ? styles.optionSelected : {})
                  }}
                >
                  <span style={styles.optionLetter}>{key}</span>
                  <span style={styles.optionText}>{value}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={styles.footer}>
        <button
          onClick={handleSubmit}
          disabled={submitting || Object.keys(answers).length !== questions.length}
          style={{
            ...styles.submitButton,
            ...(Object.keys(answers).length !== questions.length ? styles.submitButtonDisabled : {})
          }}
        >
          {submitting ? '⏳ Submitting...' : '✅ Submit Quiz'}
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    maxWidth: '900px',
    margin: '0 auto',
  },
  loading: {
    textAlign: 'center',
    padding: '80px 20px',
  },
  spinner: {
    width: '60px',
    height: '60px',
    border: '5px solid #E2E8F0',
    borderTop: '5px solid #667eea',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 24px',
  },
  loadingText: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: '8px',
  },
  loadingSubtext: {
    fontSize: '14px',
    color: '#64748B',
  },
  error: {
    padding: '24px',
    background: '#FEE2E2',
    color: '#DC2626',
    borderRadius: '12px',
    marginBottom: '16px',
    fontSize: '15px',
    fontWeight: '500',
  },
  retryButton: {
    padding: '12px 32px',
    background: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '15px',
  },
  header: {
    marginBottom: '32px',
    textAlign: 'center',
  },
  title: {
    fontSize: '26px',
    fontWeight: '700',
    marginBottom: '8px',
    color: '#0F172A',
  },
  subtitle: {
    color: '#64748B',
    fontSize: '14px',
    marginBottom: '16px',
    lineHeight: '1.5',
  },
  progress: {
    display: 'inline-block',
    padding: '10px 20px',
    background: '#F1F5F9',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#667eea',
  },
  questionsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    marginBottom: '32px',
  },
  questionCard: {
    background: '#FFFFFF',
    padding: '28px',
    borderRadius: '16px',
    border: '1px solid #E2E8F0',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
  },
  questionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  questionNumber: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#667eea',
  },
  answeredBadge: {
    fontSize: '12px',
    padding: '4px 12px',
    background: '#D1FAE5',
    color: '#065F46',
    borderRadius: '6px',
    fontWeight: '600',
  },
  unansweredBadge: {
    fontSize: '12px',
    padding: '4px 12px',
    background: '#FEF3C7',
    color: '#92400E',
    borderRadius: '6px',
    fontWeight: '600',
  },
  questionText: {
    fontSize: '16px',
    lineHeight: '1.7',
    color: '#1E293B',
    marginBottom: '20px',
    fontWeight: '500',
  },
  optionsGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  optionButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    padding: '16px 18px',
    background: '#F8FAFC',
    border: '2px solid #E2E8F0',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textAlign: 'left',
    fontSize: '15px',
  },
  optionSelected: {
    background: '#EEF2FF',
    border: '2px solid #667eea',
    boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)',
  },
  optionLetter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '36px',
    height: '36px',
    background: 'white',
    border: '2px solid #E2E8F0',
    borderRadius: '8px',
    fontWeight: '700',
    color: '#667eea',
    flexShrink: 0,
  },
  optionText: {
    flex: 1,
    color: '#334155',
    lineHeight: '1.5',
  },
  footer: {
    display: 'flex',
    justifyContent: 'center',
    padding: '24px 0',
  },
  submitButton: {
    padding: '18px 56px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 4px 14px rgba(102, 126, 234, 0.4)',
    transition: 'all 0.2s ease',
  },
  submitButtonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  resultsContainer: {
    padding: '20px',
    maxWidth: '900px',
    margin: '0 auto',
  },
  scoreCard: {
    padding: '48px',
    borderRadius: '20px',
    textAlign: 'center',
    color: 'white',
    marginBottom: '32px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
  },
  scoreTitle: {
    fontSize: '32px',
    fontWeight: '700',
    marginBottom: '20px',
  },
  scoreValue: {
    fontSize: '80px',
    fontWeight: '900',
    marginBottom: '12px',
    textShadow: '0 2px 8px rgba(0,0,0,0.2)',
  },
  scoreDetails: {
    fontSize: '20px',
    opacity: 0.95,
  },
  attemptInfo: {
    fontSize: '15px',
    opacity: 0.85,
    marginTop: '16px',
    fontWeight: '500',
  },
  resultsList: {
    marginBottom: '32px',
  },
  resultsTitle: {
    fontSize: '22px',
    fontWeight: '700',
    marginBottom: '20px',
    color: '#0F172A',
  },
  resultItem: {
    background: 'white',
    padding: '24px',
    borderRadius: '14px',
    marginBottom: '16px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  resultQuestion: {
    fontSize: '15px',
    marginBottom: '14px',
    color: '#1E293B',
    lineHeight: '1.6',
  },
  resultAnswers: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '12px',
  },
  correctAnswer: {
    padding: '10px 14px',
    background: '#D1FAE5',
    color: '#065F46',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
  },
  retrySection: {
  textAlign: 'center',
  marginTop: '32px',
},
retryQuizButton: {
  marginTop: '20px',
  padding: '16px 40px',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  border: 'none',
  borderRadius: '12px',
  fontSize: '16px',
  fontWeight: '600',
  cursor: 'pointer',
  boxShadow: '0 4px 14px rgba(102, 126, 234, 0.4)',
},
  wrongAnswer: {
    padding: '10px 14px',
    background: '#FEE2E2',
    color: '#991B1B',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
  },
  explanation: {
    padding: '14px',
    background: '#F0F9FF',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#0C4A6E',
    lineHeight: '1.6',
  },
  redirectMessage: {
    textAlign: 'center',
    fontSize: '17px',
    color: '#667eea',
    fontWeight: '600',
  },
};

// Add keyframe animation for spinner
const quizStyleSheet = document.createElement('style');  // Changed from styleSheet
quizStyleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(quizStyleSheet);  // Changed from styleSheet

export default QuizModule;