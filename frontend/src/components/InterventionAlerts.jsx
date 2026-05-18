import React, { useState } from 'react';

function InterventionAlerts({ students }) {
  const [dismissedAlerts, setDismissedAlerts] = useState([]);

  // Identify students who need intervention
  const identifyAlertsForStudent = (student) => {
    const alerts = [];
    
    // Low difficulty level
    if (student.difficulty_level < 1.5) {
      alerts.push({
        type: 'critical',
        icon: '🚨',
        title: 'Critically Low Performance',
        message: `${student.name} is at difficulty level ${student.difficulty_level.toFixed(1)}/5`,
        suggestion: 'Schedule immediate one-on-one session',
        priority: 1
      });
    } else if (student.difficulty_level < 2.5) {
      alerts.push({
        type: 'warning',
        icon: '⚠️',
        title: 'Below Average Performance',
        message: `${student.name} is struggling at level ${student.difficulty_level.toFixed(1)}/5`,
        suggestion: 'Consider providing additional resources',
        priority: 2
      });
    }

    // Stuck on same topic (simulated - check if current topic is "Introduction")
    if (student.current_topic === 'Introduction to Learning') {
      alerts.push({
        type: 'info',
        icon: '🔄',
        title: 'No Progress Detected',
        message: `${student.name} hasn't moved past introduction`,
        suggestion: 'Check if student needs help getting started',
        priority: 3
      });
    }

    return alerts.map(item => ({ ...item, student }));
  };

  // Collect all alerts
  const allAlerts = students
    .flatMap(identifyAlertsForStudent)
    .filter(item => !dismissedAlerts.includes(`${item.student.id}-${item.title}`))
    .sort((a, b) => a.priority - b.priority);

  const criticalAlerts = allAlerts.filter(a => a.type === 'critical');
  const warningAlerts = allAlerts.filter(a => a.type === 'warning');
  const infoAlerts = allAlerts.filter(a => a.type === 'info');

  const dismissAlert = (alertItem) => {
    setDismissedAlerts([...dismissedAlerts, `${alertItem.student.id}-${alertItem.title}`]);
  };

  const getAlertStyle = (type) => {
    switch(type) {
      case 'critical':
        return {
          background: '#ffebee',
          borderColor: '#f44336',
          iconColor: '#f44336'
        };
      case 'warning':
        return {
          background: '#fff3e0',
          borderColor: '#ff9800',
          iconColor: '#ff9800'
        };
      case 'info':
        return {
          background: '#e3f2fd',
          borderColor: '#2196f3',
          iconColor: '#2196f3'
        };
      default:
        return {};
    }
  };

  if (allAlerts.length === 0) {
    return (
      <div style={styles.container}>
        <h2 style={styles.title}>🎯 Intervention Alerts</h2>
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>✨</div>
          <div style={styles.emptyTitle}>All Students On Track!</div>
          <div style={styles.emptyText}>
            No intervention alerts at the moment. Keep monitoring for changes.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>🎯 Intervention Alerts</h2>
        <div style={styles.badges}>
          {criticalAlerts.length > 0 && (
            <span style={{...styles.badge, ...styles.badgeCritical}}>
              {criticalAlerts.length} Critical
            </span>
          )}
          {warningAlerts.length > 0 && (
            <span style={{...styles.badge, ...styles.badgeWarning}}>
              {warningAlerts.length} Warning
            </span>
          )}
          {infoAlerts.length > 0 && (
            <span style={{...styles.badge, ...styles.badgeInfo}}>
              {infoAlerts.length} Info
            </span>
          )}
        </div>
      </div>

      <div style={styles.alertList}>
        {allAlerts.map((alertItem, i) => {
          const alertStyles = getAlertStyle(alertItem.type);
          return (
            <div
              key={i}
              style={{
                ...styles.alertCard,
                background: alertStyles.background,
                borderLeftColor: alertStyles.borderColor
              }}
            >
              <div style={styles.alertIcon} data-color={alertStyles.iconColor}>
                {alertItem.icon}
              </div>

              <div style={styles.alertContent}>
                <div style={styles.alertHeader}>
                  <div style={styles.alertTitle}>{alertItem.title}</div>
                  <div style={{...styles.alertType, color: alertStyles.borderColor}}>
                    {alertItem.type.toUpperCase()}
                  </div>
                </div>

                <div style={styles.alertMessage}>{alertItem.message}</div>

                <div style={styles.suggestionBox}>
                  <div style={styles.suggestionIcon}>💡</div>
                  <div style={styles.suggestionText}>{alertItem.suggestion}</div>
                </div>

                <div style={styles.alertActions}>
                  <button
                    style={{...styles.actionBtn, ...styles.primaryAction}}
                    onClick={() => {
                      window.alert(`Opening detailed view for ${alertItem.student.name}...`);
                    }}
                  >
                    View Student Profile
                  </button>
                  <button
                    style={{...styles.actionBtn, ...styles.secondaryAction}}
                    onClick={() => {
                      window.alert(`Sending message to ${alertItem.student.name}...`);
                    }}
                  >
                    Send Message
                  </button>
                  <button
                    style={styles.dismissBtn}
                    onClick={() => dismissAlert(alertItem)}
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* AI-Generated Recommendations */}
      <div style={styles.aiRecommendations}>
        <h3 style={styles.aiTitle}>🤖 AI Recommendations</h3>
        <div style={styles.aiContent}>
          <div style={styles.aiRecommendation}>
            <strong>Priority Action:</strong> Focus on {criticalAlerts.length > 0 ? 
              `${criticalAlerts[0]?.student.name} who needs immediate support` :
              `maintaining current class momentum`}
          </div>
          <div style={styles.aiRecommendation}>
            <strong>Suggested Strategy:</strong> Consider grouping struggling students for peer learning sessions
          </div>
          <div style={styles.aiRecommendation}>
            <strong>Timing:</strong> Best time for interventions is early in the week when students are most receptive
          </div>
        </div>
      </div>
    </div>
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
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    flexWrap: 'wrap',
    gap: '12px'
  },
  title: {
    fontSize: '20px',
    color: '#333',
    margin: 0
  },
  badges: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap'
  },
  badge: {
    padding: '6px 12px',
    borderRadius: '16px',
    fontSize: '12px',
    fontWeight: 'bold',
    color: 'white'
  },
  badgeCritical: {
    background: '#f44336'
  },
  badgeWarning: {
    background: '#ff9800'
  },
  badgeInfo: {
    background: '#2196f3'
  },
  alertList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginBottom: '24px'
  },
  alertCard: {
    padding: '20px',
    borderRadius: '12px',
    borderLeft: '4px solid',
    display: 'flex',
    gap: '16px',
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'pointer'
  },
  alertIcon: {
    fontSize: '32px',
    flexShrink: 0
  },
  alertContent: {
    flex: 1
  },
  alertHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
    flexWrap: 'wrap',
    gap: '8px'
  },
  alertTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#333'
  },
  alertType: {
    fontSize: '11px',
    fontWeight: 'bold',
    padding: '4px 8px',
    borderRadius: '4px',
    background: 'rgba(0,0,0,0.05)'
  },
  alertMessage: {
    fontSize: '15px',
    color: '#555',
    marginBottom: '12px',
    lineHeight: '1.5'
  },
  suggestionBox: {
    display: 'flex',
    gap: '8px',
    padding: '12px',
    background: 'rgba(255,255,255,0.7)',
    borderRadius: '8px',
    marginBottom: '16px',
    alignItems: 'flex-start'
  },
  suggestionIcon: {
    fontSize: '20px',
    flexShrink: 0
  },
  suggestionText: {
    fontSize: '14px',
    color: '#666',
    lineHeight: '1.5'
  },
  alertActions: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap'
  },
  actionBtn: {
    padding: '10px 16px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  primaryAction: {
    background: '#667eea',
    color: 'white'
  },
  secondaryAction: {
    background: '#e0e0e0',
    color: '#333'
  },
  dismissBtn: {
    padding: '10px 16px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '13px',
    background: 'white',
    color: '#666',
    cursor: 'pointer',
    marginLeft: 'auto'
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px'
  },
  emptyIcon: {
    fontSize: '64px',
    marginBottom: '16px'
  },
  emptyTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '8px'
  },
  emptyText: {
    fontSize: '16px',
    color: '#666'
  },
  aiRecommendations: {
    padding: '20px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '12px',
    color: 'white'
  },
  aiTitle: {
    fontSize: '16px',
    marginBottom: '16px',
    margin: 0
  },
  aiContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  aiRecommendation: {
    fontSize: '14px',
    lineHeight: '1.6',
    paddingLeft: '12px',
    borderLeft: '3px solid rgba(255,255,255,0.5)'
  }
};

export default InterventionAlerts;