import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Play, Clock, Calendar, User } from 'lucide-react';
import { apiRequest } from '../utils/apiHelper';
import { API_ENDPOINTS } from '../config/api';
import './ConductLessons.css';

const ConductLessons = ({ instructorId }) => {
  const [upcomingLessons, setUpcomingLessons] = useState([]);
  const [activeLessons, setActiveLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (instructorId) {
      fetchUpcomingLessons();
    }
  }, [instructorId]);

  const fetchUpcomingLessons = async () => {
    try {
      setLoading(true);
      const res = await apiRequest(API_ENDPOINTS.UPCOMING_BOOKINGS_INSTRUCTOR(instructorId));
      console.log('Upcoming lessons:', res.data);
      
      const all = res.data || [];
      // Filter to only show scheduled/confirmed lessons
      const upcoming = all.filter(lesson => 
        lesson.status === 'scheduled' || lesson.status === 'confirmed'
      );
      
      setUpcomingLessons(upcoming);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch lessons: ' + err.message);
      setLoading(false);
    }
  };

  const handleStartLesson = async (lesson) => {
    try {
      // Update status to in-progress
      await apiRequest(`/bookings/${lesson._id}`, {
        method: 'PUT',
        data: { status: 'in-progress' }
      });
      
      // Move to active lessons
      setActiveLessons([...activeLessons, { ...lesson, status: 'in-progress' }]);
      setUpcomingLessons(upcomingLessons.filter(l => l._id !== lesson._id));
    } catch (err) {
      alert('Failed to start lesson: ' + err.message);
    }
  };

  const handleMarkAbsent = async (lesson) => {
    if (!window.confirm(`Mark ${lesson.studentId?.firstName || 'student'} as absent?`)) {
      return;
    }
    
    try {
      await apiRequest(`/bookings/${lesson._id}`, {
        method: 'PUT',
        data: { 
          status: 'missed',
          attendance: 'absent'
        }
      });
      
      // Remove from upcoming
      setUpcomingLessons(upcomingLessons.filter(l => l._id !== lesson._id));
      alert('Student marked as absent');
    } catch (err) {
      alert('Failed to mark as absent: ' + err.message);
    }
  };

  const handleCompleteLesson = async (lesson) => {
    if (!window.confirm(`Mark lesson with ${lesson.studentId?.firstName || 'student'} as completed?`)) {
      return;
    }
    
    try {
      await apiRequest(`/bookings/${lesson._id}`, {
        method: 'PUT',
        data: { 
          status: 'completed',
          attendance: 'attended'
        }
      });
      
      // Remove from active lessons
      setActiveLessons(activeLessons.filter(l => l._id !== lesson._id));
      alert('Lesson marked as completed');
    } catch (err) {
      alert('Failed to complete lesson: ' + err.message);
    }
  };

  const getStudentName = (lesson) => {
    if (lesson.studentId?.name) return lesson.studentId.name;
    if (lesson.studentId?.firstName && lesson.studentId?.lastName) {
      return `${lesson.studentId.firstName} ${lesson.studentId.lastName}`;
    }
    return lesson.studentId?.firstName || 'N/A';
  };

  return (
    <div className="conduct-lessons-section">
      <div className="section-header">
        <h1 className="section-title">Conduct Lessons</h1>
        <p className="section-subtitle">
          Start scheduled lessons, mark attendance, and complete sessions.
        </p>
      </div>

      {error && <p className="error-message">{error}</p>}

      {/* Active Lessons - In Progress */}
      {activeLessons.length > 0 && (
        <div className="lessons-list-card active-card">
          <h2 className="card-title">Active Lessons</h2>
          <ul className="lessons-list">
            {activeLessons.map(lesson => (
              <li key={lesson._id} className="lesson-item lesson-active">
                <div className="lesson-details">
                  <p className="lesson-info">
                    <User size={16} /> <strong>Student:</strong> {getStudentName(lesson)}
                  </p>
                  <p className="lesson-info">
                    <Calendar size={16} /> <strong>Date:</strong> {new Date(lesson.date).toLocaleDateString()}
                  </p>
                  <p className="lesson-info">
                    <Clock size={16} /> <strong>Time:</strong> {lesson.time}
                  </p>
                </div>
                <div className="lesson-actions">
                  <button 
                    onClick={() => handleCompleteLesson(lesson)} 
                    className="action-btn complete-btn"
                    title="Mark as Completed"
                  >
                    <CheckCircle size={20} /> Complete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Upcoming Lessons */}
      <div className="lessons-list-card">
        <h2 className="card-title">Upcoming Lessons</h2>
        {loading ? (
          <p className="no-lessons-msg">Loading...</p>
        ) : upcomingLessons.length > 0 ? (
          <ul className="lessons-list">
            {upcomingLessons.map(lesson => (
              <li key={lesson._id} className="lesson-item lesson-scheduled">
                <div className="lesson-details">
                  <p className="lesson-info">
                    <User size={16} /> <strong>Student:</strong> {getStudentName(lesson)}
                  </p>
                  <p className="lesson-info">
                    <Calendar size={16} /> <strong>Date:</strong> {new Date(lesson.date).toLocaleDateString()}
                  </p>
                  <p className="lesson-info">
                    <Clock size={16} /> <strong>Time:</strong> {lesson.time}
                  </p>
                </div>
                <div className="lesson-actions">
                  <button 
                    onClick={() => handleStartLesson(lesson)} 
                    className="action-btn start-btn"
                    title="Start Lesson"
                  >
                    <Play size={20} /> Start
                  </button>
                  <button 
                    onClick={() => handleMarkAbsent(lesson)} 
                    className="action-btn absent-btn"
                    title="Mark Student as Absent"
                  >
                    <XCircle size={20} /> Absent
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-lessons-msg">No upcoming lessons scheduled.</p>
        )}
      </div>
    </div>
  );
};

export default ConductLessons;
