import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BookOpen, Search, Filter, ChevronRight, Clock, BarChart } from 'lucide-react';

const API = 'http://127.0.0.1:8000';

function ContentLibrary({ onClose }) {
  const [allTopics, setAllTopics] = useState([]);
  const [categories, setCategories] = useState({});
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      const [topicsRes, categoriesRes] = await Promise.all([
        axios.get(`${API}/api/content-library/topics`),
        axios.get(`${API}/api/content-library/categories`)
      ]);
      
      setAllTopics(topicsRes.data.topics || []);
      setCategories(categoriesRes.data.categories || {});
    } catch (error) {
      console.error('Error loading content:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTopicDetails = async (topicName) => {
    try {
      const response = await axios.get(`${API}/api/content-library/topic/${encodeURIComponent(topicName)}`);
      setSelectedTopic(response.data.content);
    } catch (error) {
      console.error('Error loading topic:', error);
    }
  };

  const filteredTopics = allTopics.filter(topic => {
    const matchesSearch = topic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         topic.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'All' || topic.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categoryList = ['All', ...Object.keys(categories)];

  if (loading) {
    return (
      <div style={styles.overlay}>
        <div style={styles.modal}>
          <div style={styles.loading}>Loading content library...</div>
        </div>
      </div>
    );
  }

  if (selectedTopic) {
    return (
      <TopicDetailView 
        topic={selectedTopic}
        onBack={() => setSelectedTopic(null)}
        onClose={onClose}
      />
    );
  }

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h2 style={styles.title}>📚 Content Library</h2>
            <p style={styles.subtitle}>Complete Python to ML Course Content</p>
          </div>
          <button onClick={onClose} style={styles.closeButton}>✕</button>
        </div>

        {/* Search and Filter */}
        <div style={styles.toolbar}>
          <div style={styles.searchBox}>
            <Search size={20} style={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={styles.searchInput}
            />
          </div>

          <div style={styles.categoryFilter}>
            {categoryList.map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                style={{
                  ...styles.categoryButton,
                  ...(filterCategory === cat ? styles.categoryButtonActive : {})
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Topics Grid */}
        <div style={styles.content}>
          <div style={styles.topicsGrid}>
            {filteredTopics.map((topic, idx) => (
              <div
                key={idx}
                style={styles.topicCard}
                onClick={() => loadTopicDetails(topic.name)}
              >
                <div style={styles.topicHeader}>
                  <span style={styles.topicCategory}>{topic.category}</span>
                  <span style={styles.topicDifficulty}>
                    <BarChart size={14} />
                    {topic.difficulty.toFixed(1)}
                  </span>
                </div>
                <h3 style={styles.topicName}>{topic.name}</h3>
                <p style={styles.topicDescription}>{topic.description}</p>
                <div style={styles.topicFooter}>
                  <span style={styles.topicTime}>
                    <Clock size={14} />
                    {topic.estimated_time}
                  </span>
                  <button style={styles.viewButton}>
                    View Content
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredTopics.length === 0 && (
            <div style={styles.emptyState}>
              <p>No topics found matching your criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Topic Detail View
function TopicDetailView({ topic, onBack, onClose }) {
  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={styles.header}>
          <button onClick={onBack} style={styles.backButton}>
            ← Back to Library
          </button>
          <button onClick={onClose} style={styles.closeButton}>✕</button>
        </div>

        {/* Topic Content */}
        <div style={styles.detailContent}>
          <div style={styles.detailHeader}>
            <h1 style={styles.detailTitle}>{topic.name}</h1>
            <div style={styles.detailMeta}>
              <span style={styles.metaBadge}>{topic.category}</span>
              <span style={styles.metaBadge}>
                <BarChart size={14} />
                Difficulty: {topic.difficulty}
              </span>
              <span style={styles.metaBadge}>
                <Clock size={14} />
                {topic.estimated_time}
              </span>
            </div>
          </div>

          <div style={styles.detailSection}>
            <h3 style={styles.sectionTitle}>📝 Description</h3>
            <p style={styles.sectionText}>{topic.description}</p>
          </div>

          <div style={styles.detailSection}>
            <h3 style={styles.sectionTitle}>🎯 Key Concepts</h3>
            <ul style={styles.conceptList}>
              {topic.key_concepts.map((concept, idx) => (
                <li key={idx} style={styles.conceptItem}>{concept}</li>
              ))}
            </ul>
          </div>

          <div style={styles.detailSection}>
            <h3 style={styles.sectionTitle}>💡 Why It Matters</h3>
            <p style={styles.sectionText}>{topic.why_matters}</p>
          </div>

          {topic.learning_objectives && (
            <div style={styles.detailSection}>
              <h3 style={styles.sectionTitle}>🎓 Learning Objectives</h3>
              <ul style={styles.conceptList}>
                {topic.learning_objectives.map((obj, idx) => (
                  <li key={idx} style={styles.conceptItem}>{obj}</li>
                ))}
              </ul>
            </div>
          )}

          {topic.content && (
            <div style={styles.detailSection}>
              <h3 style={styles.sectionTitle}>📖 Content</h3>
              {topic.content.introduction && (
                <div style={styles.codeBlock}>
                  <pre style={styles.pre}>{topic.content.introduction}</pre>
                </div>
              )}
              
              {topic.content.syntax_basics && (
                <>
                  <h4 style={styles.subSectionTitle}>Syntax Basics</h4>
                  <div style={styles.codeBlock}>
                    <pre style={styles.code}>{topic.content.syntax_basics}</pre>
                  </div>
                </>
              )}

              {topic.content.examples && topic.content.examples.map((example, idx) => (
                <div key={idx} style={styles.exampleBlock}>
                  <h4 style={styles.exampleTitle}>Example: {example.title}</h4>
                  <div style={styles.codeBlock}>
                    <pre style={styles.code}>{example.code}</pre>
                  </div>
                  {example.output && (
                    <div style={styles.outputBlock}>
                      <strong>Output:</strong>
                      <pre style={styles.output}>{example.output}</pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {topic.resources && (
            <div style={styles.detailSection}>
              <h3 style={styles.sectionTitle}>🔗 Resources</h3>
              <ul style={styles.resourceList}>
                {topic.resources.map((resource, idx) => (
                  <li key={idx} style={styles.resourceItem}>
                    <a href={resource.split(': ')[1]} target="_blank" rel="noopener noreferrer" style={styles.resourceLink}>
                      {resource.split(': ')[0]}
                    </a>
                  </li>
                ))}
              </ul>
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
    padding: '20px',
  },
  modal: {
    background: 'white',
    borderRadius: '24px',
    width: '100%',
    maxWidth: '1200px',
    maxHeight: '90vh',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px 32px',
    borderBottom: '1px solid #E2E8F0',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1E1B4B',
    margin: 0,
  },
  subtitle: {
    fontSize: '14px',
    color: '#64748B',
    marginTop: '4px',
  },
  closeButton: {
    background: '#F1F5F9',
    border: 'none',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    fontSize: '20px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    padding: '10px 20px',
    background: '#F1F5F9',
    border: '1px solid #E2E8F0',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#475569',
    cursor: 'pointer',
  },
  toolbar: {
    padding: '20px 32px',
    borderBottom: '1px solid #E2E8F0',
    background: '#F8FAFC',
  },
  searchBox: {
    position: 'relative',
    marginBottom: '16px',
    paddingRight: '20px',  // ⬅️ ADD THIS
    boxSizing: 'border-box',  // ⬅️ ADD THIS
  },
  searchIcon: {
    position: 'absolute',
    left: '16px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#94A3B8',
  },
  searchInput: {
    width: '100%',
    padding: '12px 16px 12px 48px',
    border: '1px solid #E2E8F0',
    borderRadius: '12px',
    fontSize: '15px',
    outline: 'none',
    boxSizing: 'border-box',
  },
  categoryFilter: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  categoryButton: {
    padding: '8px 16px',
    background: 'white',
    border: '1px solid #E2E8F0',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
    color: '#64748B',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  categoryButtonActive: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: '1px solid #667eea',
  },
  content: {
    flex: 1,
    overflowY: 'auto',
    padding: '32px',
  },
  topicsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '24px',
  },
  topicCard: {
    background: '#F8FAFC',
    padding: '24px',
    borderRadius: '16px',
    border: '2px solid #E2E8F0',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  topicHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  topicCategory: {
    fontSize: '12px',
    fontWeight: '700',
    color: '#667eea',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  topicDifficulty: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '12px',
    fontWeight: '600',
    color: '#64748B',
  },
  topicName: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1E1B4B',
    marginBottom: '8px',
  },
  topicDescription: {
    fontSize: '14px',
    color: '#475569',
    lineHeight: '1.6',
    marginBottom: '16px',
  },
  topicFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topicTime: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '13px',
    color: '#64748B',
  },
  viewButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '8px 16px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  loading: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px',
    color: '#64748B',
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px',
    color: '#94A3B8',
  },
  // Detail View Styles
  detailContent: {
    flex: 1,
    overflowY: 'auto',
    padding: '32px',
  },
  detailHeader: {
    marginBottom: '32px',
  },
  detailTitle: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#1E1B4B',
    marginBottom: '16px',
  },
  detailMeta: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
  },
  metaBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 16px',
    background: '#EEF2FF',
    color: '#667eea',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
  },
  detailSection: {
    marginBottom: '32px',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1E1B4B',
    marginBottom: '16px',
  },
  sectionText: {
    fontSize: '15px',
    color: '#475569',
    lineHeight: '1.7',
  },
  conceptList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  conceptItem: {
    padding: '12px 16px',
    background: '#F8FAFC',
    borderRadius: '8px',
    marginBottom: '8px',
    fontSize: '14px',
    color: '#475569',
    borderLeft: '4px solid #667eea',
  },
  codeBlock: {
    background: '#1E293B',
    padding: '20px',
    borderRadius: '12px',
    marginBottom: '16px',
    overflow: 'auto',
  },
  code: {
    color: '#E2E8F0',
    fontSize: '14px',
    fontFamily: '"Fira Code", "Consolas", monospace',
    margin: 0,
    whiteSpace: 'pre-wrap',
    lineHeight: '1.6',
  },
  pre: {
    color: '#E2E8F0',
    fontSize: '14px',
    fontFamily: 'inherit',
    margin: 0,
    whiteSpace: 'pre-wrap',
    lineHeight: '1.7',
  },
  subSectionTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1E1B4B',
    marginTop: '20px',
    marginBottom: '12px',
  },
  exampleBlock: {
    marginTop: '24px',
  },
  exampleTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#667eea',
    marginBottom: '12px',
  },
  outputBlock: {
    padding: '16px',
    background: '#F0F9FF',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#0C4A6E',
  },
  output: {
    marginTop: '8px',
    fontSize: '13px',
    fontFamily: '"Fira Code", monospace',
    whiteSpace: 'pre-wrap',
  },
  resourceList: {
    listStyle: 'none',
    padding: 0,
  },
  resourceItem: {
    padding: '12px 0',
    borderBottom: '1px solid #E2E8F0',
  },
  resourceLink: {
    color: '#667eea',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '500',
  },
};

export default ContentLibrary;