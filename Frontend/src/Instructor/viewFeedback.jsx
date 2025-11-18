import React, { useState, useEffect } from 'react';
import { Star, Filter, MessageCircle, AlertCircle } from 'lucide-react';
import { apiRequest } from '../utils/apiHelper';
import { API_ENDPOINTS } from '../config/api';
import './ViewFeedback.css';

const ViewFeedback = ({ instructorId }) => {
  const [allFeedback, setAllFeedback] = useState([]);
  const [filteredFeedback, setFilteredFeedback] = useState([]);
  const [courses, setCourses] = useState([]);
  const [filter, setFilter] = useState({
    courseId: '',
    date: ''
  });
  const [error, setError] = useState('');

  const fetchFeedback = async () => {
    if (!instructorId) return;
    try {
      const response = await apiRequest(API_ENDPOINTS.INSTRUCTOR_FEEDBACK(instructorId));
      const feedbackData = response.data || [];
      console.log('Feedback data:', feedbackData);
      setAllFeedback(feedbackData);
      setFilteredFeedback(feedbackData);
      
      // Extract unique courses from feedback
      const courseMap = new Map();
      
      feedbackData.forEach(f => {
        if (f.courseId) {
          // Handle both populated and non-populated courseId
          let courseId, courseName;
          
          if (typeof f.courseId === 'object' && f.courseId._id) {
            // courseId is populated
            courseId = f.courseId._id;
            courseName = f.courseId.name || f.courseId.title || 'Course';
          } else if (typeof f.courseId === 'string') {
            // courseId is just an ID string
            courseId = f.courseId;
            courseName = 'Course'; // We'll need to fetch course details
          }
          
          if (courseId && !courseMap.has(courseId.toString())) {
            courseMap.set(courseId.toString(), { _id: courseId, name: courseName });
          }
        }
      });
      
      console.log('Extracted courses:', Array.from(courseMap.values()));
      setCourses(Array.from(courseMap.values()));
    } catch (err) {
      setError('Failed to fetch feedback: ' + err.message);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, [instructorId]);

  const handleFilterChange = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  const handleApplyFilter = (e) => {
    e.preventDefault();
    let feedbackToFilter = [...allFeedback];

    if (filter.courseId) {
      feedbackToFilter = feedbackToFilter.filter(f => {
        const fCourseId = f.courseId?._id || f.courseId;
        return fCourseId && fCourseId.toString() === filter.courseId;
      });
    }
    if (filter.date) {
      feedbackToFilter = feedbackToFilter.filter(f => new Date(f.createdAt).toISOString().split('T')[0] === filter.date);
    }

    setFilteredFeedback(feedbackToFilter);
  };

  const renderRatingStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star
          key={i}
          size={20}
          fill={i < rating ? '#ffc107' : 'transparent'}
          stroke={i < rating ? '#ffc107' : '#a0aec0'}
        />
      );
    }
    return stars;
  };

  return (
    <div className="view-feedback-section">
      <div className="section-header">
        <h1 className="section-title">View Feedback</h1>
        <p className="section-subtitle">
          Review ratings and comments submitted by your students.
        </p>
      </div>

      <div className="filter-card">
        <h2 className="card-title"><Filter size={20} /> Filter Feedback</h2>
        <form onSubmit={handleApplyFilter} className="filter-form">
          <div className="filter-row">
            <div className="form-group">
              <label htmlFor="courseId">Course</label>
              <select 
                id="courseId" 
                name="courseId" 
                value={filter.courseId} 
                onChange={handleFilterChange}
              >
                <option value="">All Courses</option>
                {courses.map(course => (
                  <option key={course._id} value={course._id}>
                    {course.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="date">Date</label>
              <input type="date" id="date" name="date" value={filter.date} onChange={handleFilterChange} />
            </div>
            <div className="form-group filter-actions">
              <button type="submit" className="filter-btn">Apply</button>
              <button 
                type="button" 
                className="clear-btn" 
                onClick={() => {
                  setFilter({ courseId: '', date: '' });
                  setFilteredFeedback(allFeedback);
                }}
              >
                Clear
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="feedback-list-card">
        <h2 className="card-title"><MessageCircle size={24} /> Student Feedback</h2>
        {error && <p className="error-message">{error}</p>}
        {filteredFeedback.length === 0 && !error ? (
          <div className="no-feedback-message">
            <AlertCircle size={40} />
            <p>No feedback available for the selected filters.</p>
          </div>
        ) : (
          <ul className="feedback-list">
            {filteredFeedback.map(f => {
              const courseName = f.courseId?.name || f.courseId?.title || 'General Feedback';
              
              return (
                <li key={f._id} className="feedback-item">
                  <div className="feedback-header">
                    <div className="feedback-rating">
                      {renderRatingStars(f.rating)}
                    </div>
                  </div>
                  <div className="feedback-meta">
                    <p className="feedback-course">{courseName}</p>
                    {f.category && <p className="feedback-category">{f.category}</p>}
                    <p className="feedback-date">{new Date(f.createdAt).toLocaleDateString()}</p>
                  </div>
                  <p className="feedback-comment">{f.comment}</p>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ViewFeedback;
