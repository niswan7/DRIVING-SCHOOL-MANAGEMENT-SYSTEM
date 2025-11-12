import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api';
import './Pages.css';

const CourseRegistration = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCourses();
    fetchEnrolledCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.COURSES}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch courses');
      }

      const data = await response.json();
      
      if (data.success) {
        // Filter only active courses
        const activeCourses = data.data.filter(course => course.status === 'active');
        setCourses(activeCourses);
      } else {
        setError(data.message || 'Failed to load courses');
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      setError('Failed to load courses. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchEnrolledCourses = async () => {
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));
      
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.USER_BY_ID(user._id)}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data.enrolledCourses) {
          setEnrolledCourses(data.data.enrolledCourses.map(course => 
            typeof course === 'object' ? course._id : course
          ));
        }
      }
    } catch (error) {
      console.error('Error fetching enrolled courses:', error);
    }
  };

  const handleEnroll = async (courseId) => {
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));

      const response = await fetch(`${API_BASE_URL}/users/${user._id}/enroll`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ courseId })
      });

      const data = await response.json();

      if (data.success) {
        alert('Successfully enrolled in the course!');
        // Update local enrolled courses list
        setEnrolledCourses([...enrolledCourses, courseId]);
        
        // Update user in localStorage
        const updatedUser = { ...user, enrolledCourses: [...(user.enrolledCourses || []), courseId] };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      } else {
        alert(data.message || 'Failed to enroll. Please try again.');
      }
    } catch (error) {
      console.error('Error enrolling in course:', error);
      alert('Failed to enroll. Please try again.');
    }
  };

  const isEnrolled = (courseId) => {
    return enrolledCourses.includes(courseId.toString()) || 
           enrolledCourses.includes(courseId);
  };

  const getCourseTypeLabel = (type) => {
    const types = {
      'beginner': '🟢 Beginner',
      'intermediate': '🟡 Intermediate',
      'advanced': '🔴 Advanced'
    };
    return types[type] || type;
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="page-header">
          <button className="back-btn" onClick={() => navigate('/dashboard')}>
            <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back to Dashboard
          </button>
          <h1>Course Registration</h1>
        </div>
        <div className="page-content">
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <p>Loading courses...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="page-header">
          <button className="back-btn" onClick={() => navigate('/dashboard')}>
            <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back to Dashboard
          </button>
          <h1>Course Registration</h1>
        </div>
        <div className="page-content">
          <div style={{ textAlign: 'center', padding: '50px', color: '#e74c3c' }}>
            <p>{error}</p>
            <button className="btn btn-primary" onClick={fetchCourses}>
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate('/dashboard')}>
          <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back to Dashboard
        </button>
        <h1>Course Registration</h1>
      </div>

      <div className="page-content">
        {courses.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <p>No courses available at the moment.</p>
          </div>
        ) : (
          <div className="courses-grid">
            {courses.map(course => (
              <div key={course._id} className="course-card">
                <div className="course-header">
                  <h3>{course.title}</h3>
                  <span className="course-price">Rs. {course.price?.toLocaleString() || '0'}</span>
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <span className="course-type-badge">{getCourseTypeLabel(course.type)}</span>
                </div>
                <p className="course-description">{course.description || 'No description available'}</p>
                <div className="course-details">
                  <div className="detail-item">
                    <svg className="icon-small" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12 6 12 12 16 14"/>
                    </svg>
                    <span>{course.duration} hours</span>
                  </div>
                </div>
                {course.syllabus && course.syllabus.length > 0 && (
                  <div className="course-features">
                    <h4>Syllabus:</h4>
                    <ul>
                      {course.syllabus.slice(0, 4).map((item, index) => (
                        <li key={index}>
                          <svg className="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {course.requirements && course.requirements.length > 0 && (
                  <div className="course-requirements">
                    <h4>Requirements:</h4>
                    <ul style={{ fontSize: '0.9em', color: '#666' }}>
                      {course.requirements.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <button 
                  className="btn btn-primary btn-large"
                  onClick={() => handleEnroll(course._id)}
                  disabled={isEnrolled(course._id)}
                  style={isEnrolled(course._id) ? { 
                    backgroundColor: '#95a5a6', 
                    cursor: 'not-allowed' 
                  } : {}}
                >
                  {isEnrolled(course._id) ? '✓ Already Enrolled' : 'Enroll Now'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseRegistration;