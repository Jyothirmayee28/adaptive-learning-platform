import React, { useState, useEffect } from 'react';

function CurriculumView({ currentTopic, completedTopics = [] }) {
  const [expandedCategory, setExpandedCategory] = useState('python');
  const [refreshKey, setRefreshKey] = useState(0);

  // Force re-render when completedTopics changes
  useEffect(() => {
    console.log('Curriculum updated! Completed topics:', completedTopics);
    setRefreshKey(prev => prev + 1);
  }, [completedTopics, currentTopic]);

  const curriculum = {
    python: {
      title: '🐍 Python Fundamentals',
      difficulty: '1.0-2.0',
      topics: [
        'Introduction to Python Programming',
        'Variables, Data Types & Operators',
        'Control Flow - If/Else Statements',
        'Loops - For & While',
        'Functions and Parameters',
        'Lists and Tuples',
        'Dictionaries and Sets',
        'String Manipulation',
        'File Handling',
        'Exception Handling',
        'Object-Oriented Programming - Classes',
        'Object-Oriented Programming - Inheritance'
      ]
    },
    dataScience: {
      title: '📊 Data Science & Analytics',
      difficulty: '2.0-3.5',
      topics: [
        'NumPy - Arrays and Operations',
        'NumPy - Advanced Array Manipulation',
        'Pandas - DataFrames Basics',
        'Pandas - Data Cleaning',
        'Pandas - Data Aggregation & Grouping',
        'Data Visualization - Matplotlib Basics',
        'Data Visualization - Seaborn',
        'Exploratory Data Analysis (EDA)',
        'Statistics for Data Science',
        'Probability and Distributions',
        'Hypothesis Testing',
        'Correlation and Regression Analysis',
        'SQL Fundamentals for Data Analysis',
        'Data Preprocessing Techniques'
      ]
    },
    machineLearning: {
      title: '🤖 Machine Learning',
      difficulty: '3.5-4.5',
      topics: [
        'Introduction to Machine Learning',
        'Scikit-learn Library Basics',
        'Linear Regression',
        'Logistic Regression',
        'Decision Trees',
        'Random Forests',
        'K-Nearest Neighbors (KNN)',
        'Support Vector Machines (SVM)',
        'K-Means Clustering',
        'Principal Component Analysis (PCA)',
        'Model Evaluation Metrics',
        'Cross-Validation Techniques',
        'Feature Engineering',
        'Hyperparameter Tuning'
      ]
    },
    ai: {
      title: '🧠 Artificial Intelligence',
      difficulty: '4.5-5.0',
      topics: [
        'Neural Networks Fundamentals',
        'Deep Learning Introduction',
        'TensorFlow Basics',
        'Convolutional Neural Networks (CNN)',
        'Natural Language Processing (NLP) Basics',
        'Text Processing and Tokenization',
        'Sentiment Analysis',
        'Recurrent Neural Networks (RNN)',
        'LSTM Networks',
        'Computer Vision Basics',
        'Image Classification',
        'Transfer Learning',
        'Model Deployment with Flask/FastAPI',
        'AI Ethics and Bias',
        'Advanced AI Applications'
      ]
    }
  };

  const getTopicStatus = (topic) => {
    if (completedTopics.includes(topic)) return 'completed';
    if (topic === currentTopic) return 'current';
    return 'locked';
  };

  const getStatusIcon = (status) => {
    if (status === 'completed') return '✅';
    if (status === 'current') return '📍';
    return '🔒';
  };

  const getStatusStyle = (status) => {
    if (status === 'completed') return styles.topicCompleted;
    if (status === 'current') return styles.topicCurrent;
    return styles.topicLocked;
  };

  return (
    <div style={styles.container} key={refreshKey}>
      <h2 style={styles.mainTitle}>📚 Complete Curriculum</h2>
      <p style={styles.subtitle}>
        Python → Data Science → Machine Learning → AI ({completedTopics.length} topics completed)
      </p>

      {Object.entries(curriculum).map(([key, category]) => (
        <div key={key} style={styles.category}>
          <div
            style={styles.categoryHeader}
            onClick={() => setExpandedCategory(expandedCategory === key ? null : key)}
          >
            <div>
              <h3 style={styles.categoryTitle}>{category.title}</h3>
              <span style={styles.difficulty}>Difficulty: {category.difficulty}</span>
            </div>
            <span style={styles.expandIcon}>
              {expandedCategory === key ? '▼' : '▶'}
            </span>
          </div>

          {expandedCategory === key && (
            <div style={styles.topicsList}>
              {category.topics.map((topic, index) => {
                const status = getTopicStatus(topic);
                return (
                  <div
                    key={`${topic}-${status}-${refreshKey}`}
                    style={{...styles.topicItem, ...getStatusStyle(status)}}
                  >
                    <span style={styles.topicIcon}>{getStatusIcon(status)}</span>
                    <span style={styles.topicName}>{topic}</span>
                    {status === 'current' && (
                      <span style={styles.currentBadge}>IN PROGRESS</span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

const styles = {
  container: {
    background: 'white',
    borderRadius: '12px',
    padding: '24px',
    marginTop: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  mainTitle: {
    fontSize: '24px',
    color: '#333',
    marginBottom: '8px'
  },
  subtitle: {
    fontSize: '14px',
    color: '#888',
    marginBottom: '24px'
  },
  category: {
    marginBottom: '16px',
    border: '2px solid #eee',
    borderRadius: '12px',
    overflow: 'hidden'
  },
  categoryHeader: {
    padding: '16px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    transition: 'all 0.3s'
  },
  categoryTitle: {
    margin: 0,
    fontSize: '18px',
    fontWeight: '600'
  },
  difficulty: {
    fontSize: '13px',
    opacity: 0.9,
    marginTop: '4px',
    display: 'block'
  },
  expandIcon: {
    fontSize: '20px'
  },
  topicsList: {
    padding: '12px'
  },
  topicItem: {
    padding: '12px 16px',
    marginBottom: '8px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    transition: 'all 0.3s'
  },
  topicCompleted: {
    background: '#e8f5e9',
    borderLeft: '4px solid #4caf50'
  },
  topicCurrent: {
    background: '#fff3e0',
    borderLeft: '4px solid #ff9800',
    fontWeight: '600'
  },
  topicLocked: {
    background: '#f5f5f5',
    color: '#999',
    borderLeft: '4px solid #ddd'
  },
  topicIcon: {
    fontSize: '18px'
  },
  topicName: {
    flex: 1,
    fontSize: '15px'
  },
  currentBadge: {
    padding: '4px 8px',
    background: '#ff9800',
    color: 'white',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: '600'
  }
};

export default CurriculumView;