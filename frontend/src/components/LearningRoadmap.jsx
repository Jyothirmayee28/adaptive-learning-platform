import React, { useState } from 'react';
import TopicContentModal from './TopicContentModal';

function LearningRoadmap({ currentTopic, completedTopics, nextTopic }) {
  const [showContent, setShowContent] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState('');

  const allTopics = [
    ...completedTopics,
    currentTopic,
    nextTopic,
    'Future Topic 1',
    'Future Topic 2'
  ];

  const handleTopicClick = (topic) => {
    setSelectedTopic(topic);
    setShowContent(true);
  };

  return (
    <>
      <div style={styles.container}>
        <h2 style={styles.title}>🗺️ Your Learning Journey</h2>
        <div style={styles.timeline}>
          {allTopics.map((topic, index) => {
            const isCompleted = completedTopics.includes(topic);
            const isCurrent = topic === currentTopic;
            const isNext = topic === nextTopic;
            return (
              <div
                key={index}
                style={styles.timelineItem}
                onClick={() => handleTopicClick(topic)}
              >
                <div style={{
                  ...styles.circle,
                  ...(isCompleted ? styles.circleCompleted : {}),
                  ...(isCurrent ? styles.circleCurrent : {}),
                  ...(isNext ? styles.circleNext : {})
                }}>
                  {isCompleted ? '✓' : isCurrent ? '📍' : isNext ? '🎯' : index + 1}
                </div>
                <div style={styles.topicInfo}>
                  <div style={{
                    ...styles.topicName,
                    ...(isCurrent ? styles.topicCurrent : {})
                  }}>
                    {topic}
                  </div>
                  <div style={styles.status}>
                    {isCompleted ? 'Completed' : isCurrent ? 'In Progress' : isNext ? 'Recommended Next' : 'Upcoming'}
                  </div>
                </div>
                {index < allTopics.length - 1 && <div style={styles.connector} />}
              </div>
            );
          })}
        </div>
      </div>
      {showContent && (
        <TopicContentModal
          topic={selectedTopic}
          onClose={() => setShowContent(false)}
        />
      )}
    </>
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
  title: {
    fontSize: '20px',
    marginBottom: '24px',
    color: '#333'
  },
  timeline: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  timelineItem: {
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    paddingBottom: '20px'
  },
  circle: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: '#eee',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#999',
    flexShrink: 0,
    zIndex: 2,
    transition: 'all 0.3s'
  },
  circleCompleted: {
    background: 'linear-gradient(135deg, #4caf50, #66bb6a)',
    color: 'white',
    animation: 'pulse 2s infinite'
  },
  circleCurrent: {
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    color: 'white',
    boxShadow: '0 0 20px rgba(102, 126, 234, 0.5)',
    animation: 'glow 2s infinite'
  },
  circleNext: {
    background: 'linear-gradient(135deg, #ff9800, #ffc107)',
    color: 'white'
  },
  connector: {
    position: 'absolute',
    left: '19px',
    top: '40px',
    width: '2px',
    height: '28px',
    background: '#ddd',
    zIndex: 1
  },
  topicInfo: {
    marginLeft: '16px',
    flex: 1
  },
  topicName: {
    fontSize: '16px',
    fontWeight: '500',
    color: '#333',
    marginBottom: '4px'
  },
  topicCurrent: {
    color: '#667eea',
    fontWeight: 'bold'
  },
  status: {
    fontSize: '13px',
    color: '#888'
  }
};

export default LearningRoadmap;