import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function ScoreTrendChart({ performanceHistory }) {
  const validData = performanceHistory.filter(h => h.score !== undefined);
  
  const labels = validData.map((h, i) => h.topic || `Topic ${i + 1}`);
  const scores = validData.map(h => h.score);

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Score %',
        data: scores,
        borderColor: 'rgb(102, 126, 234)',
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointBackgroundColor: 'rgb(102, 126, 234)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleColor: '#fff',
        bodyColor: '#fff',
        displayColors: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: function(value) {
            return value + '%';
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📊 Performance Trend</h2>
      {validData.length > 0 ? (
        <div style={styles.chartWrapper}>
          <Line data={data} options={options} />
        </div>
      ) : (
        <div style={styles.noData}>
          Complete assessments to see your performance trend
        </div>
      )}
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
  title: {
    fontSize: '20px',
    color: '#333',
    marginBottom: '20px'
  },
  chartWrapper: {
    height: '300px',
    position: 'relative'
  },
  noData: {
    textAlign: 'center',
    color: '#999',
    padding: '40px',
    fontSize: '14px'
  }
};

export default ScoreTrendChart;