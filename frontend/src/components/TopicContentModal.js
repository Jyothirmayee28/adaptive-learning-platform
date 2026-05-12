import React, { useState, useEffect } from 'react';

function TopicContentModal({ topic, onClose }) {
  const [activeTab, setActiveTab] = useState('lesson');

  const lessonContent = `${topic} is a fundamental concept in learning. This topic builds upon your previous knowledge and will help you progress to more advanced material. Key points include understanding the core principles, practicing with examples, and applying the concepts to real-world scenarios.`;

  const videos = [
    { title: `Introduction to ${topic}`, duration: '15:30' },
    { title: `${topic} Deep Dive`, duration: '22:45' },
    { title: `Practical ${topic}`, duration: '18:20' }
  ];

  const practice = [
    { question: `How would you apply ${topic} in a real project?` },
    { question: `What are the key benefits of ${topic}?` },
    { question: `Compare ${topic} with related concepts you've learned.` }
  ];

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h2 style={styles.title}>{topic}</h2>
          <button style={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div style={styles.tabs}>
          <button
            style={{...styles.tab, ...(activeTab === 'lesson' ? styles.tabActive : {})}}
            onClick={() => setActiveTab('lesson')}
          >
            📖 Lesson
          </button>
          <button
            style={{...styles.tab, ...(activeTab === 'videos' ? styles.tabActive : {})}}
            onClick={() => setActiveTab('videos')}
          >
            🎥 Videos
          </button>
          <button
            style={{...styles.tab, ...(activeTab === 'practice' ? styles.tabActive : {})}}
            onClick={() => setActiveTab('practice')}
          >
            ✏️ Practice
          </button>
        </div>

        <div style={styles.content}>
          {activeTab === 'lesson' && (
            <div>
              <h2 style={styles.h2}>Overview</h2>
              <p style={styles.p}>{lessonContent}</p>
              <h2 style={styles.h2}>Key Concepts</h2>
              <ul>
                <li style={styles.li}>Foundation and core principles</li>
                <li style={styles.li}>Practical applications</li>
                <li style={styles.li}>Best practices and patterns</li>
              </ul>
            </div>
          )}

          {activeTab === 'videos' && (
            <div style={styles.videos}>
              {videos.map((video, i) => (
                <div key={i} style={styles.videoCard}>
                  <div style={styles.videoPlaceholder}>
                    <div style={styles.playIcon}>▶</div>
                    <div style={styles.videoDuration}>{video.duration}</div>
                  </div>
                  <div style={styles.videoTitle}>{video.title}</div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'practice' && (
            <div style={styles.practice}>
              {practice.map((item, i) => (
                <div key={i} style={styles.practiceCard}>
                  <div style={styles.practiceNumber}>Problem {i + 1}</div>
                  <div style={styles.practiceQuestion}>{item.question}</div>
                </div>
              ))}
            </div>
          )}
        </div>
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
    background: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px'
  },
  modal: {
    background: 'white',
    borderRadius: '16px',
    width: '100%',
    maxWidth: '900px',
    maxHeight: '90vh',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px',
    borderBottom: '1px solid #eee'
  },
  title: {
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
  tabs: {
    display: 'flex',
    padding: '0 24px',
    borderBottom: '1px solid #eee',
    gap: '8px'
  },
  tab: {
    padding: '16px 24px',
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    fontSize: '15px',
    color: '#666',
    borderBottom: '3px solid transparent',
    transition: 'all 0.2s'
  },
  tabActive: {
    color: '#667eea',
    borderBottomColor: '#667eea',
    fontWeight: 'bold'
  },
  content: {
    flex: 1,
    overflowY: 'auto',
    padding: '24px'
  },
  h2: {
    fontSize: '20px',
    color: '#444',
    marginTop: '20px',
    marginBottom: '12px'
  },
  p: {
    fontSize: '16px',
    color: '#666',
    lineHeight: '1.8',
    marginBottom: '16px'
  },
  li: {
    fontSize: '16px',
    color: '#666',
    marginBottom: '8px',
    marginLeft: '20px'
  },
  videos: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '20px'
  },
  videoCard: {
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  videoPlaceholder: {
    width: '100%',
    height: '160px',
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  playIcon: {
    fontSize: '48px',
    color: 'white',
    opacity: 0.9
  },
  videoDuration: {
    position: 'absolute',
    bottom: '8px',
    right: '8px',
    background: 'rgba(0,0,0,0.7)',
    color: 'white',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px'
  },
  videoTitle: {
    padding: '12px',
    fontSize: '15px',
    fontWeight: '500',
    color: '#333'
  },
  practice: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  practiceCard: {
    padding: '20px',
    border: '2px solid #eee',
    borderRadius: '12px',
    background: '#fafafa'
  },
  practiceNumber: {
    fontSize: '14px',
    color: '#667eea',
    fontWeight: 'bold',
    marginBottom: '12px'
  },
  practiceQuestion: {
    fontSize: '16px',
    color: '#333',
    lineHeight: '1.6'
  }
};

export default TopicContentModal;