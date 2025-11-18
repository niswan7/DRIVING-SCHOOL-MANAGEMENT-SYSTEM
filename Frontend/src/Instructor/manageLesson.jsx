import React, { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import { apiRequest } from '../utils/apiHelper';
import { API_ENDPOINTS } from '../config/api';
import './ManageLessons.css';

const ManageLessons = ({ instructorId }) => {
  const [upcomingLessons, setUpcomingLessons] = useState([]);
  const [lessonHistory, setLessonHistory] = useState([]);
  const [students, setStudents] = useState([]);
  const [error, setError] = useState('');

  const fetchLessons = async () => {
    if (!instructorId) return;
    try {
      const res = await apiRequest(API_ENDPOINTS.INSTRUCTOR_BOOKINGS(instructorId));
      console.log('Fetched bookings:', res.data);
      
      const all = res.data || [];
      const now = new Date();
      
      // Separate upcoming and past lessons
      const upcoming = all.filter(lesson => {
        const lessonDate = new Date(lesson.date);
        return lessonDate >= now && (lesson.status === 'scheduled' || lesson.status === 'confirmed');
      });
      
      const history = all.filter(lesson => {
        const lessonDate = new Date(lesson.date);
        return lessonDate < now || lesson.status === 'completed' || lesson.status === 'cancelled' || lesson.status === 'missed';
      });
      
      setUpcomingLessons(upcoming);
      setLessonHistory(history);
    } catch (err) {
      setError('Failed to fetch lessons: ' + err.message);
    }
  };

  const fetchStudents = async () => {
    if (!instructorId) return;
    try {
      const response = await apiRequest(API_ENDPOINTS.INSTRUCTOR_STUDENTS(instructorId));
      setStudents(response.data || []);
    } catch (err) {
      setError('Failed to fetch students: ' + err.message);
    }
  };

  useEffect(() => {
    if (instructorId) {
      fetchLessons();
      fetchStudents();
    }
  }, [instructorId]);

  const handleDeleteLesson = async (id) => {
    if (window.confirm("Are you sure you want to delete this lesson?")) {
      try {
        await apiRequest(`/bookings/${id}`, { method: 'DELETE' });
        fetchLessons();
      } catch (err) {
        setError('Failed to delete lesson: ' + err.message);
      }
    }
  };

  return (
    <div className="manage-lessons-section">
      <div className="section-header">
        <h1 className="section-title">Manage Lessons</h1>
        <p className="section-subtitle">
          View and manage your scheduled and past lessons.
        </p>
      </div>

      {error && <p className="error-message">{error}</p>}

      <div className="card-container">
        {/* Upcoming Lessons */}
        <div className="manage-list-card">
          <h2 className="card-title">Scheduled Classes</h2>
          <ul className="lesson-list">
            {upcomingLessons.length > 0 ? (
              upcomingLessons.map(lesson => (
                <li key={lesson._id} className={`lesson-item ${lesson.status.toLowerCase()}`}>
                  <div className="lesson-details">
                    <p className="lesson-info">
                      <strong>Student:</strong> {
                        lesson.studentId?.name || 
                        (lesson.studentId?.firstName && lesson.studentId?.lastName 
                          ? `${lesson.studentId.firstName} ${lesson.studentId.lastName}` 
                          : lesson.studentId?.firstName || 'N/A')
                      }
                    </p>
                    <p className="lesson-info">
                      <strong>Date:</strong> {new Date(lesson.date).toLocaleDateString()}
                    </p>
                    <p className="lesson-info">
                      <strong>Time:</strong> {lesson.time}
                    </p>
                    <span className="lesson-status">{lesson.status}</span>
                  </div>
                  <div className="lesson-actions">
                    <button onClick={() => handleDeleteLesson(lesson._id)} className="delete-btn">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </li>
              ))
            ) : (
              <p className="no-lessons-msg">No upcoming lessons scheduled.</p>
            )}
          </ul>
        </div>

        {/* Lesson History */}
        <div className="manage-list-card">
          <h2 className="card-title">Lesson History</h2>
          <ul className="lesson-list">
            {lessonHistory.length > 0 ? (
              lessonHistory.map(lesson => (
                <li key={lesson._id} className={`lesson-item ${lesson.status.toLowerCase()}`}>
                  <div className="lesson-details">
                    <p className="lesson-info">
                      <strong>Student:</strong> {
                        lesson.studentId?.name || 
                        (lesson.studentId?.firstName && lesson.studentId?.lastName 
                          ? `${lesson.studentId.firstName} ${lesson.studentId.lastName}` 
                          : lesson.studentId?.firstName || 'N/A')
                      }
                    </p>
                    <p className="lesson-info">
                      <strong>Date:</strong> {new Date(lesson.date).toLocaleDateString()}
                    </p>
                    <p className="lesson-info">
                      <strong>Time:</strong> {lesson.time}
                    </p>
                    <span className="lesson-status">{lesson.status}</span>
                  </div>
                </li>
              ))
            ) : (
              <p className="no-lessons-msg">No lesson history yet.</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ManageLessons;
