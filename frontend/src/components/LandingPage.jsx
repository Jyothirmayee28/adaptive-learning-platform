import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Brain, TrendingUp, Users, Zap, Target } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Navigation */}
      <nav style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        padding: '1.5rem 5%',
        position: 'sticky',
        top: 0,
        background: 'rgba(0,0,0,0.1)',
        backdropFilter: 'blur(10px)',
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Brain size={32} />
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>LearnAI</h1>
        </div>
        <button
          onClick={() => navigate('/login')}
          style={{
            padding: '12px 32px',
            background: 'white',
            color: '#667eea',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'transform 0.2s, box-shadow 0.2s',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 12px rgba(0,0,0,0.15)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
          }}
        >
          Get Started
        </button>
      </nav>

      {/* Hero Section */}
      <section style={{ 
        textAlign: 'center', 
        padding: '5rem 5% 4rem',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <h2 style={{ 
          fontSize: 'clamp(2.5rem, 5vw, 4rem)', 
          fontWeight: 800, 
          margin: '0 0 1.5rem',
          lineHeight: 1.2
        }}>
          AI-Powered Adaptive Learning
        </h2>
        <p style={{ 
          fontSize: 'clamp(1.1rem, 2vw, 1.5rem)', 
         // margin: '0 0 2.5rem',
          opacity: 0.95,
          maxWidth: '800px',
          margin: '0 auto 2.5rem'
        }}>
          Personalized education that adapts to your learning pace. Master Python with intelligent quizzes and real-time difficulty adjustment.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/login')}
            style={{
              padding: '16px 40px',
              background: 'white',
              color: '#667eea',
              border: 'none',
              borderRadius: '12px',
              fontSize: '1.2rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.3s',
              boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.05)';
              e.target.style.boxShadow = '0 12px 24px rgba(0,0,0,0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = '0 8px 16px rgba(0,0,0,0.2)';
            }}
          >
            Start Learning Free
          </button>
          <button
            onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
            style={{
              padding: '16px 40px',
              background: 'transparent',
              color: 'white',
              border: '2px solid white',
              borderRadius: '12px',
              fontSize: '1.2rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255,255,255,0.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent';
            }}
          >
            Learn More
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={{ 
        padding: '4rem 5%',
        background: 'rgba(255,255,255,0.1)',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h3 style={{ 
            textAlign: 'center', 
            fontSize: '2.5rem', 
            marginBottom: '3rem',
            fontWeight: 700
          }}>
            Why Choose LearnAI?
          </h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem'
          }}>
            {[
              {
                icon: <Brain size={40} />,
                title: 'AI-Powered Adaptation',
                description: 'Our intelligent system adjusts difficulty in real-time based on your performance.'
              },
              {
                icon: <Target size={40} />,
                title: 'Personalized Learning Path',
                description: 'Get a customized curriculum that matches your skill level and learning speed.'
              },
              {
                icon: <TrendingUp size={40} />,
                title: 'Track Your Progress',
                description: 'Visualize your improvement with detailed analytics and performance metrics.'
              },
              {
                icon: <Zap size={40} />,
                title: 'Instant Feedback',
                description: 'Receive immediate explanations and corrections to accelerate your learning.'
              },
              {
                icon: <BookOpen size={40} />,
                title: 'Comprehensive Content',
                description: 'From Python basics to advanced topics - everything you need in one place.'
              },
              {
                icon: <Users size={40} />,
                title: 'Teacher Dashboard',
                description: 'Educators can monitor student progress and provide targeted support.'
              }
            ].map((feature, index) => (
              <div
                key={index}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                  padding: '2rem',
                  borderRadius: '16px',
                  border: '1px solid rgba(255,255,255,0.2)',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ marginBottom: '1rem' }}>{feature.icon}</div>
                <h4 style={{ 
                  fontSize: '1.3rem', 
                  marginBottom: '0.75rem',
                  fontWeight: 600
                }}>
                  {feature.title}
                </h4>
                <p style={{ 
                  opacity: 0.9,
                  lineHeight: 1.6,
                  margin: 0
                }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{ 
        padding: '4rem 5%',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <h3 style={{ 
          textAlign: 'center', 
          fontSize: '2.5rem', 
          marginBottom: '3rem',
          fontWeight: 700
        }}>
          How It Works
        </h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '2rem',
          textAlign: 'center'
        }}>
          {[
            { step: '1', title: 'Sign Up', description: 'Create your free account in seconds' },
            { step: '2', title: 'Take Assessment', description: 'Complete initial quiz to determine your level' },
            { step: '3', title: 'Learn & Practice', description: 'Follow your personalized curriculum' },
            { step: '4', title: 'Master Python', description: 'Achieve your learning goals with AI guidance' }
          ].map((item, index) => (
            <div key={index}>
              <div style={{
                width: '80px',
                height: '80px',
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem',
                fontSize: '2rem',
                fontWeight: 700
              }}>
                {item.step}
              </div>
              <h4 style={{ fontSize: '1.3rem', marginBottom: '0.5rem', fontWeight: 600 }}>
                {item.title}
              </h4>
              <p style={{ opacity: 0.9, margin: 0 }}>{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ 
        padding: '4rem 5%',
        textAlign: 'center',
        background: 'rgba(0,0,0,0.2)'
      }}>
        <h3 style={{ 
          fontSize: '2.5rem', 
          marginBottom: '1rem',
          fontWeight: 700
        }}>
          Ready to Transform Your Learning?
        </h3>
        <p style={{ 
          fontSize: '1.2rem', 
          marginBottom: '2rem',
          opacity: 0.95
        }}>
          Join thousands of students already learning smarter with AI
        </p>
        <button
          onClick={() => navigate('/login')}
          style={{
            padding: '18px 48px',
            background: 'white',
            color: '#667eea',
            border: 'none',
            borderRadius: '12px',
            fontSize: '1.3rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.3s',
            boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.05)';
            e.target.style.boxShadow = '0 12px 24px rgba(0,0,0,0.3)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = '0 8px 16px rgba(0,0,0,0.2)';
          }}
        >
          Get Started Now - It's Free!
        </button>
      </section>

      {/* Footer */}
      <footer style={{ 
        padding: '2rem 5%',
        textAlign: 'center',
        opacity: 0.8,
        borderTop: '1px solid rgba(255,255,255,0.1)'
      }}>
        <p style={{ margin: 0 }}>© 2026 LearnAI Platform. Empowering learners with AI.</p>
      </footer>
    </div>
  );
};

export default LandingPage;