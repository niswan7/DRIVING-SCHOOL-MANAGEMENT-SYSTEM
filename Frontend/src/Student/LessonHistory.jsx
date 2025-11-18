import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/api';
import './Pages.css';

const LessonHistory = () => {
  const navigate = useNavigate();
  const [lessons, setLessons] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    fetchLessonHistory();
  }, []);

  const fetchLessonHistory = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      
      if (!userStr) {
        console.error('User not found');
        setLoading(false);
        return;
      }
      
      const user = JSON.parse(userStr);
      const userId = user._id || user.id;
      
      const API_BASE_URL = 'http://localhost:3000/api';
      
      // Fetch all bookings for the student
      const response = await fetch(`${API_BASE_URL}/bookings?studentId=${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      console.log('Bookings response:', data);
      
      if (data.success) {
        setLessons(data.data || []);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching lesson history:', error);
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      setCancellingId(bookingId);
      const token = localStorage.getItem('token');
      const API_BASE_URL = 'http://localhost:3000/api';

      const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'cancelled' })
      });

      const data = await response.json();

      if (data.success) {
        alert('Booking cancelled successfully');
        // Refresh the list
        fetchLessonHistory();
      } else {
        alert(data.message || 'Failed to cancel booking');
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert('Failed to cancel booking. Please try again.');
    } finally {
      setCancellingId(null);
    }
  };

  const filteredLessons = lessons.filter(lesson => {
    if (filter === 'all') return true;
    if (filter === 'upcoming') {
      // Show scheduled and in-progress as upcoming
      return lesson.status === 'scheduled' || lesson.status === 'in-progress';
    }
    return lesson.status === filter;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'status-completed';
      case 'scheduled': return 'status-upcoming';
      case 'in-progress': return 'status-upcoming';
      case 'cancelled': return 'status-cancelled';
      case 'missed': return 'status-missed';
      default: return '';
    }
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'scheduled': return 'Upcoming';
      case 'in-progress': return 'In Progress';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      case 'missed': return 'Missed';
      default: return status;
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
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
          <button 
            className={`filter-tab ${filter === 'missed' ? 'active' : ''}`}
            onClick={() => setFilter('missed')}
          >
            Missed
          </button>
        </div>

        <div className="list-container">
          {loading ? (
            <div className="empty-state-page">
              <p>Loading lessons...</p>
            </div>
          ) : filteredLessons.length > 0 ? (
            filteredLessons.map(lesson => (
              <div key={lesson._id} className="list-item">
                <div className="list-item-header">
                  <h3>{lesson.type ? lesson.type.charAt(0).toUpperCase() + lesson.type.slice(1) : 'Lesson'}</h3>
                  <span className={`status-badge ${getStatusColor(lesson.status)}`}>
                    {getStatusLabel(lesson.status)}
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
                    <span>{formatDate(lesson.date)} at {lesson.time}</span>
                  </div>
                  <div className="detail-row">
                    <svg className="icon-small" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12 6 12 12 16 14"/>
                    </svg>
                    <span>Duration: {lesson.duration} minutes</span>
                  </div>
                  {lesson.notes && (
                    <div className="detail-row">
                      <svg className="icon-small" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                        <line x1="16" y1="13" x2="8" y2="13"/>
                        <line x1="16" y1="17" x2="8" y2="17"/>
                        <polyline points="10 9 9 9 8 9"/>
                      </svg>
                      <span>Notes: {lesson.notes}</span>
                    </div>
                  )}
                  {lesson.attendance && (
                    <div className="detail-row">
                      <svg className="icon-small" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                        <polyline points="22 4 12 14.01 9 11.01"/>
                      </svg>
                      <span>Attendance: {lesson.attendance}</span>
                    </div>
                  )}
                </div>
                {(lesson.status === 'scheduled' || lesson.status === 'in-progress') && (
                  <div className="list-item-actions">
                    <button 
                      className="btn-cancel"
                      onClick={() => handleCancelBooking(lesson._id)}
                      disabled={cancellingId === lesson._id}
                    >
                      {cancellingId === lesson._id ? 'Cancelling...' : 'Cancel Booking'}
                    </button>
                  </div>
                )}
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