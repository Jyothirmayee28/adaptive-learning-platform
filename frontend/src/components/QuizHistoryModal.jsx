import React, { useState } from 'react';
import { X, Calendar, Target, Clock, Award } from 'lucide-react';

export default function QuizHistoryModal({ topic, attempts, onClose, onRetakeQuiz }) {
  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={styles.header}>
          <h2 style={styles.title}>📊 Quiz History: {topic}</h2>
          <button onClick={onClose} style={styles.closeBtn}>
            <X size={24} />
          </button>
        </div>

        {/* Attempts List */}
        <div style={styles.content}>
          {attempts.length === 0 ? (
            <div style={styles.emptyState}>
              <p>No previous attempts for this topic yet.</p>
              <button onClick={() => { onClose(); onRetakeQuiz(); }} style={styles.startButton}>
                Take Your First Quiz
              </button>
            </div>
          ) : (
            <>
              <div style={styles.stats}>
                <div style={styles.statCard}>
                  <Target size={24} style={styles.statIcon} />
                  <div>
                    <div style={styles.statValue}>{attempts.length}</div>
                    <div style={styles.statLabel}>Total Attempts</div>
                  </div>
                </div>
                <div style={styles.statCard}>
                  <Award size={24} style={styles.statIcon} />
                  <div>
                    <div style={styles.statValue}>
                      {Math.round(attempts.reduce((sum, a) => sum + a.score, 0) / attempts.length)}%
                    </div>
                    <div style={styles.statLabel}>Average Score</div>
                  </div>
                </div>
                <div style={styles.statCard}>
                  <Target size={24} style={styles.statIcon} />
                  <div>
                    <div style={styles.statValue}>
                      {attempts.filter(a => a.passed).length}/{attempts.length}
                    </div>
                    <div style={styles.statLabel}>Passed</div>
                  </div>
                </div>
              </div>

              <div style={styles.attemptsList}>
                {attempts.map((attempt, idx) => (
                  <div key={idx} style={styles.attemptCard}>
                    <div style={styles.attemptHeader}>
                      <span style={styles.attemptNumber}>Attempt #{attempt.attempt_number}</span>
                      <span style={{
                        ...styles.badge,
                        ...(attempt.passed ? styles.passedBadge : styles.failedBadge)
                      }}>
                        {attempt.passed ? '✓ Passed' : '✗ Failed'}
                      </span>
                    </div>

                    <div style={styles.attemptBody}>
                      <div style={styles.scoreSection}>
                        <div style={{
                          ...styles.scoreCircle,
                          ...(attempt.passed ? styles.passedCircle : styles.failedCircle)
                        }}>
                          <span style={styles.scoreText}>{attempt.score}%</span>
                        </div>
                        <div style={styles.scoreDetails}>
                          <div style={styles.scoreDetail}>
                            <span style={styles.scoreLabel}>Correct:</span>
                            <span style={styles.scoreValue}>{attempt.correct}/{attempt.total}</span>
                          </div>
                          <div style={styles.scoreDetail}>
                            <span style={styles.scoreLabel}>Time:</span>
                            <span style={styles.scoreValue}>{attempt.time_spent}m</span>
                          </div>
                        </div>
                      </div>

                      <div style={styles.attemptFooter}>
                        <div style={styles.dateInfo}>
                          <Calendar size={14} />
                          <span>{new Date(attempt.timestamp).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {attempt.errors && attempt.errors.length > 0 && (
                      <div style={styles.errorsSection}>
                        <strong>Missed Questions:</strong>
                        <ul style={styles.errorsList}>
                          {attempt.errors.slice(0, 2).map((error, i) => (
                            <li key={i} style={styles.errorItem}>{error}</li>
                          ))}
                          {attempt.errors.length > 2 && (
                            <li style={styles.errorItem}>... and {attempt.errors.length - 2} more</li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <button onClick={() => { onClose(); onRetakeQuiz(); }} style={styles.retakeButton}>
                🔄 Take Quiz Again
              </button>
            </>
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
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px',
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: '20px',
    width: '100%',
    maxWidth: '800px',
    maxHeight: '90vh',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
  },
  header: {
    padding: '24px 32px',
    borderBottom: '1px solid #E2E8F0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    margin: 0,
  },
  closeBtn: {
    background: 'rgba(255, 255, 255, 0.2)',
    border: 'none',
    borderRadius: '10px',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: 'white',
  },
  content: {
    flex: 1,
    overflow: 'auto',
    padding: '32px',
  },
  stats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px',
    marginBottom: '32px',
  },
  statCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '20px',
    background: '#F8FAFC',
    borderRadius: '12px',
    border: '1px solid #E2E8F0',
  },
  statIcon: {
    color: '#667eea',
  },
  statValue: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#0F172A',
  },
  statLabel: {
    fontSize: '13px',
    color: '#64748B',
    fontWeight: '500',
  },
  attemptsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginBottom: '24px',
  },
  attemptCard: {
    background: '#FFFFFF',
    border: '2px solid #E2E8F0',
    borderRadius: '16px',
    padding: '20px',
  },
  attemptHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  attemptNumber: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#667eea',
  },
  badge: {
    padding: '6px 12px',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '600',
  },
  passedBadge: {
    background: '#D1FAE5',
    color: '#065F46',
  },
  failedBadge: {
    background: '#FEE2E2',
    color: '#991B1B',
  },
  attemptBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  scoreSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  scoreCircle: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '4px solid',
  },
  passedCircle: {
    borderColor: '#10B981',
    background: '#D1FAE5',
  },
  failedCircle: {
    borderColor: '#EF4444',
    background: '#FEE2E2',
  },
  scoreText: {
    fontSize: '24px',
    fontWeight: '700',
  },
  scoreDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  scoreDetail: {
    display: 'flex',
    gap: '8px',
    fontSize: '14px',
  },
  scoreLabel: {
    color: '#64748B',
    fontWeight: '500',
  },
  scoreValue: {
    color: '#0F172A',
    fontWeight: '700',
  },
  attemptFooter: {
    paddingTop: '16px',
    borderTop: '1px solid #E2E8F0',
  },
  dateInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13px',
    color: '#64748B',
  },
  errorsSection: {
    marginTop: '16px',
    padding: '16px',
    background: '#FEF3C7',
    borderRadius: '8px',
    fontSize: '14px',
  },
  errorsList: {
    marginTop: '8px',
    marginLeft: '20px',
    color: '#92400E',
  },
  errorItem: {
    marginBottom: '4px',
  },
  retakeButton: {
    width: '100%',
    padding: '16px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  startButton: {
    marginTop: '20px',
    padding: '14px 28px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#64748B',
  },
};