import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Pages.css';

const LessonHistory = () => {
  const navigate = useNavigate();
  const [lessons, setLessons] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchLessonHistory();
  }, []);

  const fetchLessonHistory = async () => {
    try {
      setLessons([
        {
          id: 1,
          date: '2025-11-05',
          time: '10:00 AM',
          instructor: 'John Doe',
          type: 'Regular Lesson',
          status: 'completed',
          duration: '2 hours'
        },
        {
          id: 2,
          date: '2025-11-08',
          time: '2:00 PM',
          instructor: 'Jane Smith',
          type: 'Highway Driving',
          status: 'completed',
          duration: '2 hours'
        },
        {
          id: 3,
          date: '2025-11-15',
          time: '11:00 AM',
          instructor: 'John Doe',
          type: 'Test Preparation',
          status: 'upcoming',
          duration: '2 hours'
        }
      ]);
    } catch (error) {
      console.error('Error fetching lesson history:', error);
    }
  };

  const filteredLessons = lessons.filter(lesson => {
    if (filter === 'all') return true;
    return lesson.status === filter;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'status-completed';
      case 'upcoming': return 'status-upcoming';
      case 'cancelled': return 'status-cancelled';
      default: return '';
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate('/Dashboard')}>
          <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back to Dashboard
        </button>
        <h1>Lesson History</h1>
      </div>

      <div className="page-content">
        <div className="filter-tabs">
          <button 
            className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Lessons
          </button>
          <button 
            className={`filter-tab ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
          <button 
            className={`filter-tab ${filter === 'upcoming' ? 'active' : ''}`}
            onClick={() => setFilter('upcoming')}
          >
            Upcoming
          </button>
          <button 
            className={`filter-tab ${filter === 'cancelled' ? 'active' : ''}`}
            onClick={() => setFilter('cancelled')}
          >
            Cancelled
          </button>
        </div>

        <div className="list-container">
          {filteredLessons.length > 0 ? (
            filteredLessons.map(lesson => (
              <div key={lesson.id} className="list-item">
                <div className="list-item-header">
                  <h3>{lesson.type}</h3>
                  <span className={`status-badge ${getStatusColor(lesson.status)}`}>
                    {lesson.status.charAt(0).toUpperCase() + lesson.status.slice(1)}
                  </span>
                </div>
                <div className="list-item-details">
                  <div className="detail-row">
                    <svg className="icon-small" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                      <line x1="16" y1="2" x2="16" y2="6"/>
                      <line x1="8" y1="2" x2="8" y2="6"/>
                      <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    <span>{lesson.date} at {lesson.time}</span>
                  </div>
                  <div className="detail-row">
                    <svg className="icon-small" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                    <span>Instructor: {lesson.instructor}</span>
                  </div>
                  <div className="detail-row">
                    <svg className="icon-small" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12 6 12 12 16 14"/>
                    </svg>
                    <span>Duration: {lesson.duration}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state-page">
              <p>No lessons found for this filter.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LessonHistory;