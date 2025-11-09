import React, { useState, useEffect } from 'react';
import { apiRequest } from '../utils/apiHelper';
import { API_ENDPOINTS } from '../config/api';
import { BookOpen } from 'lucide-react';

const CourseEnrollmentModal = ({ studentId, onClose, onEnrollmentSuccess }) => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setFetchLoading(true);
    try {
      const response = await apiRequest(API_ENDPOINTS.COURSES);
      if (response.success) {
        setCourses(response.data || []);
      }
    } catch (err) {
      setError('Failed to load courses: ' + err.message);
    } finally {
      setFetchLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!selectedCourse) {
      setError('Please select a course');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Create a progress record for the student
      const response = await apiRequest(API_ENDPOINTS.PROGRESS, {
        method: 'POST',
        data: {
          student: studentId,
          course: selectedCourse._id,
          hoursCompleted: 0,
          totalHours: selectedCourse.duration || 20,
          status: 'Not Started',
          performanceScore: 0,
          notes: `Enrolled in ${selectedCourse.name}`
        }
      });
      
      if (response.success) {
        onEnrollmentSuccess();
        onClose();
      }
    } catch (err) {
      setError(err.message || 'Enrollment failed');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return <div className="loading-message">Loading courses...</div>;
  }

  if (courses.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: '#a0aec0' }}>
        <BookOpen size={48} style={{ color: '#ff8c00', marginBottom: '1rem' }} />
        <p>No courses available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="course-enrollment">
      <div className="courses-grid">
        {courses.map(course => (
          <div
            key={course._id}
            className={`course-card ${selectedCourse?._id === course._id ? 'selected' : ''}`}
            onClick={() => setSelectedCourse(course)}
          >
            <div className="course-icon">
              <BookOpen size={24} />
            </div>
            <h3>{course.name}</h3>
            <p className="course-description">{course.description}</p>
            <div className="course-details">
              <span>📅 Duration: {course.duration} hours</span>
              <span>💰 Price: Rs. {course.price}</span>
              <span className="course-type">{course.type}</span>
            </div>
          </div>
        ))}
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="modal-actions">
        <button type="button" onClick={onClose} className="btn-cancel">
          Cancel
        </button>
        <button
          onClick={handleEnroll}
          className="btn-submit"
          disabled={!selectedCourse || loading}
        >
          {loading ? 'Enrolling...' : 'Enroll Now'}
        </button>
      </div>
    </div>
  );
};

export default CourseEnrollmentModal;
