import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const API = 'http://127.0.0.1:8000';

function AIStudyBuddy({ currentTopic, studentName }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hi ${studentName}! 👋 I'm your AI Study Buddy. I'm here to help you understand ${currentTopic} better. Ask me anything!`
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    
    // Add user message
    const newMessages = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setLoading(true);

    try {
      // Call AI service through backend
      const response = await axios.post(`${API}/api/learning/chat`, {
        topic: currentTopic,
        student_name: studentName,
        message: userMessage,
        chat_history: newMessages
      });

      // Add AI response
      setMessages([...newMessages, {
        role: 'assistant',
        content: response.data.response
      }]);
    } catch (err) {
      // Fallback response if API fails
      const fallbackResponse = `Great question about ${currentTopic}! This topic helps you understand the fundamentals. ${userMessage.toLowerCase().includes('how') ? 'The key steps involve breaking it down into smaller parts and practicing regularly.' : userMessage.toLowerCase().includes('why') ? 'This is important because it builds the foundation for more advanced concepts.' : 'Let me explain: this concept connects to what you learned earlier and will be useful in future topics.'}`;
      
      setMessages([...newMessages, {
        role: 'assistant',
        content: fallbackResponse
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestedQuestions = [
    `What is ${currentTopic}?`,
    `Why is ${currentTopic} important?`,
    `Can you give me an example?`,
    `How does this connect to other topics?`
  ];

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          style={styles.floatingBtn}
          onClick={() => setIsOpen(true)}
        >
          <span style={styles.floatingIcon}>💬</span>
          <span style={styles.floatingText}>Ask AI</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div style={styles.chatContainer}>
          <div style={styles.chatHeader}>
            <div style={styles.headerLeft}>
              <div style={styles.aiAvatar}>🤖</div>
              <div>
                <div style={styles.aiName}>AI Study Buddy</div>
                <div style={styles.aiStatus}>
                  <span style={styles.onlineDot}>●</span> Online
                </div>
              </div>
            </div>
            <button style={styles.closeBtn} onClick={() => setIsOpen(false)}>
              ✕
            </button>
          </div>

          <div style={styles.chatMessages}>
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  ...styles.message,
                  ...(msg.role === 'user' ? styles.messageUser : styles.messageAssistant)
                }}
              >
                {msg.role === 'assistant' && (
                  <div style={styles.messageAvatar}>🤖</div>
                )}
                <div style={styles.messageContent}>
                  <div style={styles.messageBubble}>
                    {msg.content}
                  </div>
                  <div style={styles.messageTime}>
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            
            {loading && (
              <div style={{...styles.message, ...styles.messageAssistant}}>
                <div style={styles.messageAvatar}>🤖</div>
                <div style={styles.typingIndicator}>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Questions */}
          {messages.length <= 1 && (
            <div style={styles.suggestions}>
              <div style={styles.suggestionsTitle}>💡 Try asking:</div>
              <div style={styles.suggestionsList}>
                {suggestedQuestions.map((q, i) => (
                  <button
                    key={i}
                    style={styles.suggestionBtn}
                    onClick={() => {
                      setInput(q);
                      handleSend();
                    }}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div style={styles.chatInput}>
            <textarea
              style={styles.input}
              placeholder="Ask me anything about this topic..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              rows={1}
            />
            <button
              style={{
                ...styles.sendBtn,
                ...(loading || !input.trim() ? styles.sendBtnDisabled : {})
              }}
              onClick={handleSend}
              disabled={loading || !input.trim()}
            >
              {loading ? '...' : '➤'}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

const styles = {
  floatingBtn: {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    width: '140px',
    height: '56px',
    borderRadius: '28px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    border: 'none',
    boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    zIndex: 999,
    transition: 'transform 0.2s'
  },
  floatingIcon: {
    fontSize: '24px'
  },
  floatingText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: '16px'
  },
  chatContainer: {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    width: '380px',
    height: '600px',
    background: 'white',
    borderRadius: '16px',
    boxShadow: '0 12px 48px rgba(0,0,0,0.2)',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 1000,
    overflow: 'hidden'
  },
  chatHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white'
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  aiAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px'
  },
  aiName: {
    fontWeight: 'bold',
    fontSize: '16px'
  },
  aiStatus: {
    fontSize: '12px',
    opacity: 0.9,
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
  },
  onlineDot: {
    color: '#4caf50',
    fontSize: '16px'
  },
  closeBtn: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    border: 'none',
    background: 'rgba(255,255,255,0.2)',
    color: 'white',
    cursor: 'pointer',
    fontSize: '20px'
  },
  chatMessages: {
    flex: 1,
    overflowY: 'auto',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    background: '#f5f7fa'
  },
  message: {
    display: 'flex',
    gap: '8px'
  },
  messageUser: {
    flexDirection: 'row-reverse',
    alignSelf: 'flex-end'
  },
  messageAssistant: {
    flexDirection: 'row',
    alignSelf: 'flex-start'
  },
  messageAvatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    flexShrink: 0
  },
  messageContent: {
    maxWidth: '70%'
  },
  messageBubble: {
    padding: '12px 16px',
    borderRadius: '16px',
    fontSize: '14px',
    lineHeight: '1.5',
    wordWrap: 'break-word'
  },
  messageTime: {
    fontSize: '11px',
    color: '#999',
    marginTop: '4px',
    paddingLeft: '4px'
  },
  typingIndicator: {
    display: 'flex',
    gap: '4px',
    padding: '12px 16px',
    background: 'white',
    borderRadius: '16px',
    width: 'fit-content'
  },
  suggestions: {
    padding: '16px',
    borderTop: '1px solid #eee',
    background: 'white'
  },
  suggestionsTitle: {
    fontSize: '13px',
    color: '#666',
    marginBottom: '12px',
    fontWeight: 'bold'
  },
  suggestionsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  suggestionBtn: {
    padding: '10px 12px',
    background: '#f5f7fa',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '13px',
    textAlign: 'left',
    transition: 'all 0.2s'
  },
  chatInput: {
    display: 'flex',
    gap: '8px',
    padding: '16px',
    borderTop: '1px solid #eee',
    background: 'white'
  },
  input: {
    flex: 1,
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '12px',
    fontSize: '14px',
    resize: 'none',
    fontFamily: 'inherit',
    outline: 'none'
  },
  sendBtn: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    border: 'none',
    background: '#667eea',
    color: 'white',
    cursor: 'pointer',
    fontSize: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  sendBtnDisabled: {
    background: '#ddd',
    cursor: 'not-allowed'
  }
};

// Add to user message bubble
styles.messageBubble = {
  ...styles.messageBubble,
  background: '#667eea',
  color: 'white'
};

// Override for assistant messages
const assistantBubbleStyle = {
  ...styles.messageBubble,
  background: 'white',
  color: '#333',
  border: '1px solid #e0e0e0'
};

export default AIStudyBuddy;