import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ClassPerformanceOverview from './ClassPerformanceOverview';
import InterventionAlerts from './InterventionAlerts';
import StudentProfileModal from './StudentProfileModal';

const API = 'http://127.0.0.1:8000';

function TeacherDashboard({ user, onLogout }) {
  const [selectedStudentForProfile, setSelectedStudentForProfile] = useState(null);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [overrideTopic, setOverrideTopic] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const res = await axios.get(`${API}/api/students/`);
      setStudents(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOverride = async () => {
    if (!overrideTopic || !selectedStudent) return;
    try {
      await axios.post(`${API}/api/learning/override`, {
        student_id: selectedStudent.id,
        new_topic: overrideTopic,
        reason: 'Teacher override',
        teacher_name: user.name || 'Teacher'
      });
      window.alert('Path overridden successfully!');
      setOverrideTopic('');
      loadStudents();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div style={styles.loading}>Loading students...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Teacher Dashboard</h1>
          <p style={styles.subtitle}>Monitor and guide student learning paths</p>
        </div>
        <button style={styles.logoutBtn} onClick={onLogout}>Logout</button>
      </div>

      <ClassPerformanceOverview students={students} />
      <InterventionAlerts students={students} />

      <div style={styles.grid}>
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>👥 All Students ({students.length})</h2>
          <p style={styles.instructionText}>
            Double-click any student to view their complete profile
          </p>
          <div style={styles.studentList}>
            {students.map(s => (
              <div
                key={s.id}
                style={{
                  ...styles.studentItem,
                  ...(selectedStudent?.id === s.id ? styles.studentActive : {})
                }}
                onClick={() => setSelectedStudent(s)}
                onDoubleClick={() => setSelectedStudentForProfile(s)}
              >
                <div>
                  <div style={styles.studentName}>{s.name}</div>
                  <div style={styles.studentEmail}>{s.email}</div>
                </div>
                <div style={styles.studentDifficulty}>
                  Level: {s.difficulty_level.toFixed(1)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedStudent && (
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>📋 {selectedStudent.name}'s Details</h2>
            <div style={styles.detailRow}>
              <span style={styles.label}>Current Topic:</span>
              <span style={styles.value}>{selectedStudent.current_topic}</span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.label}>Difficulty Level:</span>
              <span style={styles.value}>{selectedStudent.difficulty_level.toFixed(1)}/5</span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.label}>Email:</span>
              <span style={styles.value}>{selectedStudent.email}</span>
            </div>

            <button
              style={styles.viewProfileBtn}
              onClick={() => setSelectedStudentForProfile(selectedStudent)}
            >
              View Full Profile
            </button>

            <div style={styles.overrideSection}>
              <h3 style={styles.overrideTitle}>Quick Override</h3>
              <input
                style={styles.input}
                placeholder="Enter new topic name"
                value={overrideTopic}
                onChange={e => setOverrideTopic(e.target.value)}
              />
              <button style={styles.overrideBtn} onClick={handleOverride}>
                Override Path
              </button>
            </div>
          </div>
        )}

        <div style={styles.card}>
          <h2 style={styles.cardTitle}>📊 Cohort Overview</h2>
          <p style={styles.cohortText}>
            Students are being routed to different topics based on their individual performance and learning pace.
          </p>
          <div style={styles.cohortGrid}>
            {students.map(s => (
              <div key={s.id} style={styles.cohortItem}>
                <div style={styles.cohortName}>{s.name}</div>
                <div style={styles.cohortTopic}>{s.current_topic}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedStudentForProfile && (
        <StudentProfileModal
          student={selectedStudentForProfile}
          onClose={() => setSelectedStudentForProfile(null)}
          onOverride={() => loadStudents()}
        />
      )}
    </div>
  );
}

const styles = {
  container: { padding: '32px', background: '#f5f7fa', minHeight: '100vh' },
  loading: { textAlign: 'center', fontSize: '20px', marginTop: '100px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' },
  title: { fontSize: '28px', color: '#333', margin: 0 },
  subtitle: { color: '#888', margin: '4px 0 0 0' },
  logoutBtn: { padding: '10px 20px', background: '#f44336', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' },
  card: { background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  cardTitle: { fontSize: '18px', marginBottom: '16px', color: '#444' },
  instructionText: { fontSize: '13px', color: '#888', marginBottom: '12px', fontStyle: 'italic' },
  studentList: { maxHeight: '500px', overflowY: 'auto' },
  studentItem: { padding: '16px', border: '1px solid #eee', borderRadius: '8px', marginBottom: '12px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.2s' },
  studentActive: { background: '#e8eaf6', borderColor: '#667eea' },
  studentName: { fontWeight: 'bold', color: '#333', marginBottom: '4px' },
  studentEmail: { fontSize: '13px', color: '#888' },
  studentDifficulty: { fontSize: '12px', color: '#667eea', fontWeight: 'bold' },
  detailRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px' },
  label: { color: '#666' },
  value: { fontWeight: 'bold', color: '#333' },
  viewProfileBtn: { width: '100%', padding: '12px', background: '#667eea', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', marginTop: '12px', marginBottom: '24px', fontSize: '14px', fontWeight: 'bold' },
  overrideSection: { marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #eee' },
  overrideTitle: { fontSize: '16px', marginBottom: '12px', color: '#444' },
  input: { width: '100%', padding: '10px', marginBottom: '12px', borderRadius: '6px', border: '1px solid #ddd', boxSizing: 'border-box' },
  overrideBtn: { width: '100%', padding: '12px', background: '#ff9800', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' },
  cohortText: { fontSize: '14px', color: '#666', marginBottom: '16px', lineHeight: '1.6' },
  cohortGrid: { display: 'grid', gap: '12px' },
  cohortItem: { padding: '12px', background: '#f9f9f9', borderRadius: '6px', borderLeft: '3px solid #667eea' },
  cohortName: { fontSize: '14px', fontWeight: 'bold', color: '#333', marginBottom: '4px' },
  cohortTopic: { fontSize: '13px', color: '#888' }
};

export default TeacherDashboard;