import React, { useState } from 'react';
import axios from 'axios';
import { Send, Sparkles, BookOpen, Lightbulb, Target, HelpCircle } from 'lucide-react';

const API = 'http://127.0.0.1:8000';

function AIStudyBuddy({ currentTopic, studentName }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hi ${studentName}! 👋 I'm your AI Study Buddy. I'm here to help you master "${currentTopic}". Ask me anything!`,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const quickActions = [
    { icon: Lightbulb, label: 'Explain concept', prompt: `Explain the key concepts of ${currentTopic}` },
    { icon: Target, label: 'Practice problems', prompt: `Give me practice problems for ${currentTopic}` },
    { icon: BookOpen, label: 'Resources', prompt: `What are the best resources to learn ${currentTopic}?` },
    { icon: HelpCircle, label: 'Common mistakes', prompt: `What are common mistakes in ${currentTopic}?` },
  ];

  const sendMessage = async (messageText) => {
    if (!messageText.trim()) return;

    const userMessage = {
      role: 'user',
      content: messageText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post(`${API}/api/learning/chat`, {
        student_id: 1,
        message: messageText,
        chat_history: messages
      });

      const aiMessage = {
        role: 'assistant',
        content: response.data.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again!',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = (prompt) => {
    sendMessage(prompt);
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <Sparkles size={24} style={styles.sparkle} />
          <div>
            <h2 style={styles.title}>AI Study Buddy</h2>
            <p style={styles.subtitle}>Currently helping with: {currentTopic}</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={styles.quickActions}>
        <p style={styles.quickTitle}>Quick Actions:</p>
        <div style={styles.actionGrid}>
          {quickActions.map((action, idx) => (
            <button
              key={idx}
              onClick={() => handleQuickAction(action.prompt)}
              style={styles.actionButton}
              disabled={loading}
            >
              <action.icon size={18} />
              <span>{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div style={styles.messagesContainer}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              ...styles.message,
              ...(msg.role === 'user' ? styles.userMessage : styles.aiMessage)
            }}
          >
            <div style={styles.messageAvatar}>
              {msg.role === 'user' ? studentName.charAt(0).toUpperCase() : '🤖'}
            </div>
            <div style={styles.messageContent}>
              <div style={styles.messageText}>{msg.content}</div>
              <div style={styles.messageTime}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div style={{...styles.message, ...styles.aiMessage}}>
            <div style={styles.messageAvatar}>🤖</div>
            <div style={styles.typingIndicator}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div style={styles.inputContainer}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage(input)}
          placeholder="Ask me anything about your current topic..."
          style={styles.input}
          disabled={loading}
        />
        <button
          onClick={() => sendMessage(input)}
          disabled={loading || !input.trim()}
          style={{
            ...styles.sendButton,
            ...(loading || !input.trim() ? styles.sendButtonDisabled : {})
          }}
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    background: 'white',
    borderRadius: '20px',
    border: '1px solid #E2E8F0',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    height: '700px',
    boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)',
  },
  header: {
    padding: '24px 32px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  sparkle: {
    animation: 'pulse 2s infinite',
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    margin: 0,
  },
  subtitle: {
    fontSize: '14px',
    opacity: 0.9,
    margin: '4px 0 0 0',
  },
  quickActions: {
    padding: '20px 32px',
    background: '#F8FAFC',
    borderBottom: '1px solid #E2E8F0',
  },
  quickTitle: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#64748B',
    marginBottom: '12px',
  },
  actionGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '12px',
  },
  actionButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 16px',
    background: 'white',
    border: '1px solid #E2E8F0',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    color: '#475569',
    transition: 'all 0.2s ease',
  },
  messagesContainer: {
    flex: 1,
    overflowY: 'auto',
    padding: '24px 32px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  message: {
    display: 'flex',
    gap: '12px',
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    flexDirection: 'row-reverse',
  },
  aiMessage: {
    alignSelf: 'flex-start',
  },
  messageAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    fontWeight: '600',
    flexShrink: 0,
  },
  messageContent: {
    flex: 1,
  },
  messageText: {
    padding: '14px 18px',
    borderRadius: '16px',
    background: '#F1F5F9',
    fontSize: '15px',
    lineHeight: '1.6',
    color: '#1E293B',
  },
  messageTime: {
    fontSize: '11px',
    color: '#94A3B8',
    marginTop: '6px',
    paddingLeft: '4px',
  },
  typingIndicator: {
    display: 'flex',
    gap: '6px',
    padding: '14px 18px',
    background: '#F1F5F9',
    borderRadius: '16px',
  },
  inputContainer: {
    padding: '24px 32px',
    borderTop: '1px solid #E2E8F0',
    display: 'flex',
    gap: '12px',
    background: 'white',
  },
  input: {
    flex: 1,
    padding: '14px 20px',
    border: '2px solid #E2E8F0',
    borderRadius: '12px',
    fontSize: '15px',
    outline: 'none',
    transition: 'border-color 0.2s ease',
  },
  sendButton: {
    padding: '14px 24px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
  },
  sendButtonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
};

// Add CSS animation
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`;
document.head.appendChild(styleSheet);

export default AIStudyBuddy;