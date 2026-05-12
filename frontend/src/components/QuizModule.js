import React, { useState } from 'react';

function QuizModule({ topic, onSubmit }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  // Sample questions - in production these would come from your backend
  const questions = [
    {
      id: 1,
      question: `What is the primary focus of ${topic}?`,
      options: [
        'Memorizing facts without understanding',
        'Building foundational understanding and practical application',
        'Only theoretical knowledge',
        'Rushing through without practice'
      ],
      correct: 1
    },
    {
      id: 2,
      question: `Which approach is most effective when learning ${topic}?`,
      options: [
        'Skipping examples and jumping to advanced concepts',
        'Copying code without understanding it',
        'Breaking down concepts into smaller parts and practicing regularly',
        'Avoiding difficult topics'
      ],
      correct: 2
    },
    {
      id: 3,
      question: `What should you do if you're struggling with ${topic}?`,
      options: [
        'Give up immediately',
        'Skip it and move to the next topic',
        'Review fundamentals, seek help, and practice more',
        'Ignore the problem'
      ],
      correct: 2
    },
    {
      id: 4,
      question: `How does ${topic} connect to real-world applications?`,
      options: [
        'It has no practical use',
        'It helps solve actual problems and builds useful skills',
        'Only useful for exams',
        'Completely theoretical with no applications'
      ],
      correct: 1
    },
    {
      id: 5,
      question: `What is the best way to retain knowledge about ${topic}?`,
      options: [
        'Cram everything the night before',
        'Study once and never review',
        'Regular practice, spaced repetition, and applying concepts',
        'Rely entirely on memorization'
      ],
      correct: 2
    }
  ];

  const handleAnswer = (questionIndex, optionIndex) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionIndex]: optionIndex
    });
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q, index) => {
      if (selectedAnswers[index] === q.correct) {
        correct++;
      }
    });
    return Math.round((correct / questions.length) * 100);
  };

  const handleSubmitQuiz = () => {
    const score = calculateScore();
    const errors = questions
      .map((q, i) => selectedAnswers[i] !== q.correct ? q.question : null)
      .filter(Boolean);
    
    onSubmit(score, errors);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  if (showResults) {
    const score = calculateScore();
    return (
      <div style={styles.resultsContainer}>
        <div style={styles.scoreCircle}>
          <div style={styles.scoreNumber}>{score}%</div>
          <div style={styles.scoreLabel}>Your Score</div>
        </div>
        <div style={styles.resultText}>
          {score >= 80 ? '🎉 Excellent work!' : score >= 60 ? '👍 Good job!' : '📚 Keep practicing!'}
        </div>
        <div style={styles.resultDetails}>
          You got {Math.round((score / 100) * questions.length)} out of {questions.length} questions correct
        </div>
        <button style={styles.submitBtn} onClick={handleSubmitQuiz}>
          Submit Assessment & Continue
        </button>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div style={styles.container}>
      <div style={styles.progress}>
        <div style={styles.progressText}>
          Question {currentQuestion + 1} of {questions.length}
        </div>
        <div style={styles.progressBar}>
          <div style={{
            ...styles.progressFill,
            width: `${((currentQuestion + 1) / questions.length) * 100}%`
          }} />
        </div>
      </div>

      <div style={styles.questionCard}>
        <h3 style={styles.questionText}>{question.question}</h3>
        <div style={styles.optionsContainer}>
          {question.options.map((option, index) => (
             <button
            key={index}
            style={{
            ...styles.optionBtn,
            ...(selectedAnswers[currentQuestion] === index ? styles.optionSelected : {})
          }}
            onClick={() => handleAnswer(currentQuestion, index)}
            >
              <span style={styles.optionLetter}>{String.fromCharCode(65 + index)}</span>
              <span style={styles.optionText}>{option}</span>
            </button>
          ))}
        </div>
      </div>

      <div style={styles.navigation}>
        <button
          style={{
            ...styles.navBtn,
            ...(currentQuestion === 0 ? styles.navBtnDisabled : {})
          }}
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
        >
          ← Previous
        </button>
        <button
          style={{
            ...styles.navBtn,
            ...styles.navBtnPrimary,
            ...(selectedAnswers[currentQuestion] === undefined ? styles.navBtnDisabled : {})
          }}
          onClick={handleNext}
          disabled={selectedAnswers[currentQuestion] === undefined}
        >
          {currentQuestion === questions.length - 1 ? 'Finish' : 'Next →'}
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    background: 'white',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  progress: {
    marginBottom: '24px'
  },
  progressText: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '8px'
  },
  progressBar: {
    width: '100%',
    height: '8px',
    background: '#eee',
    borderRadius: '4px',
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #667eea, #764ba2)',
    transition: 'width 0.3s'
  },
  questionCard: {
    marginBottom: '24px'
  },
  questionText: {
    fontSize: '20px',
    color: '#333',
    marginBottom: '24px',
    lineHeight: '1.5'
  },
  optionsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  optionBtn: {
    display: 'flex',
    alignItems: 'center',
    padding: '16px',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    background: 'white',
    cursor: 'pointer',
    transition: 'all 0.2s',
    textAlign: 'left'
  },
  optionSelected: {
  borderColor: '#667eea',
  background: '#f0f3ff'
  }, 
  optionLetter: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: '#667eea',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    marginRight: '12px',
    flexShrink: 0
  },
  optionText: {
    fontSize: '16px',
    color: '#333'
  },
  navigation: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '12px'
  },
  navBtn: {
    padding: '12px 24px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    background: 'white',
    color: '#333',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500'
  },
  navBtnPrimary: {
    background: '#667eea',
    color: 'white',
    border: 'none'
  },
  navBtnDisabled: {
    opacity: 0.4,
    cursor: 'not-allowed'
  },
  resultsContainer: {
    textAlign: 'center',
    padding: '40px'
  },
  scoreCircle: {
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    margin: '0 auto 24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)'
  },
  scoreNumber: {
    fontSize: '48px',
    fontWeight: 'bold',
    color: 'white'
  },
  scoreLabel: {
    fontSize: '14px',
    color: 'white',
    opacity: 0.9
  },
  resultText: {
    fontSize: '24px',
    marginBottom: '12px',
    color: '#333'
  },
  resultDetails: {
    fontSize: '16px',
    color: '#666',
    marginBottom: '32px'
  },
  submitBtn: {
    padding: '14px 32px',
    background: '#4caf50',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)'
  }
};

export default QuizModule;