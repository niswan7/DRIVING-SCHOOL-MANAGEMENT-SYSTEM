import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/api';
import './Pages.css';

const Feedback = () => {
  const navigate = useNavigate();
  const [feedbackData, setFeedbackData] = useState({
    courseId: '',
    instructorId: '',
    rating: 0,
    category: 'general',
    message: ''
  });
  const [completedCourses, setCompletedCourses] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCompletedCourses();
  }, []);

  const fetchCompletedCourses = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      
      if (!userStr) {
        setError('User not found');
        setLoading(false);
        return;
      }
      
      const user = JSON.parse(userStr);
      const userId = user._id || user.id;
      
      const API_BASE_URL = 'http://localhost:3000/api';
      
      // Fetch user data to get completed courses
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.USER_BY_ID(userId)}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (data.success && data.data.completedCourses && data.data.completedCourses.length > 0) {
        // Fetch course details for each completed course
        const coursesWithDetails = await Promise.all(
          data.data.completedCourses.map(async (completedCourse) => {
            const courseResponse = await fetch(`${API_BASE_URL}${API_ENDPOINTS.COURSE_BY_ID(completedCourse.courseId)}`, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            const courseData = await courseResponse.json();
            return {
              ...completedCourse,
              courseDetails: courseData.data
            };
          })
        );
        
        setCompletedCourses(coursesWithDetails);
      } else {
        setError('You have not completed any courses yet. Complete a course to provide feedback.');
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching completed courses:', error);
      setError('Failed to fetch completed courses');
      setLoading(false);
    }
  };

  const fetchInstructorsForCourse = async (courseId) => {
    try {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      const user = JSON.parse(userStr);
      const userId = user._id || user.id;
      const API_BASE_URL = 'http://localhost:3000/api';
      
      // Fetch all bookings for this student and course to find instructors
      const response = await fetch(`${API_BASE_URL}/bookings?studentId=${userId}&courseId=${courseId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (data.success && data.data) {
        // Extract unique instructors from bookings
        const instructorMap = new Map();
        data.data.forEach(booking => {
          if (booking.instructorId) {
            const instructor = booking.instructorId;
            if (instructor._id) {
              instructorMap.set(instructor._id.toString(), {
                _id: instructor._id,
                name: `${instructor.firstName} ${instructor.lastName}`
              });
            }
          }
        });
        
        setInstructors(Array.from(instructorMap.values()));
      }
    } catch (error) {
      console.error('Error fetching instructors:', error);
    }
  };

  const handleCourseChange = (e) => {
    const courseId = e.target.value;
    setFeedbackData({
      ...feedbackData,
      courseId,
      instructorId: '' // Reset instructor when course changes
    });
    
    if (courseId) {
      fetchInstructorsForCourse(courseId);
    } else {
      setInstructors([]);
    }
  };

  const handleChange = (e) => {
    setFeedbackData({
      ...feedbackData,
      [e.target.name]: e.target.value
    });
  };

  const handleRating = (rating) => {
    setFeedbackData({
      ...feedbackData,
      rating
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (feedbackData.rating === 0) {
      setError('Please provide a rating');
      return;
    }
    
    if (!feedbackData.courseId || !feedbackData.instructorId) {
      setError('Please select both a course and an instructor');
      return;
    }
    
    try {
      setSubmitting(true);
      setError('');
      
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      const user = JSON.parse(userStr);
      const userId = user._id || user.id;
      const API_BASE_URL = 'http://localhost:3000/api';
      
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.FEEDBACK}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          studentId: userId,
          instructorId: feedbackData.instructorId,
          courseId: feedbackData.courseId,
          rating: feedbackData.rating,
          category: feedbackData.category,
          comment: feedbackData.message
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert('Thank you for your feedback!');
        navigate('/dashboard');
      } else {
        setError(data.message || 'Failed to submit feedback');
      }
      
      setSubmitting(false);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setError('Failed to submit feedback. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate('/dashboard')}>
          <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back to Dashboard
        </button>
        <h1>Provide Feedback</h1>
      </div>

      <div className="page-content">
        {loading ? (
          <div className="empty-state-page">
            <p>Loading completed courses...</p>
          </div>
        ) : error && completedCourses.length === 0 ? (
          <div className="empty-state-page">
            <svg className="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
            <p>{error}</p>
          </div>
        ) : (
          <div className="form-card">
            <div className="feedback-intro">
              <svg className="feedback-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
              <p>Your feedback helps us improve our services and training quality.</p>
            </div>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="courseId">Select Completed Course</label>
                <select
                  id="courseId"
                  name="courseId"
                  value={feedbackData.courseId}
                  onChange={handleCourseChange}
                  required
                >
                  <option value="">Choose a completed course</option>
                  {completedCourses.map(course => (
                    <option key={course.courseId} value={course.courseId}>
                      {course.courseDetails?.name || course.courseDetails?.title || 'Course'}
                      {' '}- Completed on {new Date(course.completedAt).toLocaleDateString()}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="instructorId">Select Instructor</label>
                <select
                  id="instructorId"
                  name="instructorId"
                  value={feedbackData.instructorId}
                  onChange={handleChange}
                  required
                  disabled={!feedbackData.courseId}
                >
                  <option value="">Choose an instructor</option>
                  {instructors.map(instructor => (
                    <option key={instructor._id} value={instructor._id}>
                      {instructor.name}
                    </option>
                  ))}
                </select>
                {!feedbackData.courseId && (
                  <small style={{ color: '#888', fontSize: '0.85rem' }}>
                    Please select a course first
                  </small>
                )}
              </div>

              <div className="form-group">
                <label>Rate Your Experience</label>
                <div className="star-rating">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      className={`star ${star <= feedbackData.rating ? 'active' : ''}`}
                      onClick={() => handleRating(star)}
                    >
                      <svg viewBox="0 0 24 24" fill={star <= feedbackData.rating ? "currentColor" : "none"} stroke="currentColor">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                      </svg>
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="category">Feedback Category</label>
                <select
                  id="category"
                  name="category"
                  value={feedbackData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="general">General Feedback</option>
                  <option value="teaching">Teaching Quality</option>
                  <option value="vehicle">Vehicle Condition</option>
                  <option value="scheduling">Scheduling</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="message">Your Feedback</label>
                <textarea
                  id="message"
                  name="message"
                  value={feedbackData.message}
                  onChange={handleChange}
                  rows="6"
                  placeholder="Share your experience, suggestions, or concerns..."
                  required
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-primary btn-large"
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : 'Submit Feedback'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Feedback;