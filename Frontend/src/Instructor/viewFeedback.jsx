import React, { useState, useEffect } from 'react';
import { Star, Filter, MessageCircle, AlertCircle } from 'lucide-react';
import { apiRequest } from '../utils/apiHelper';
import { API_ENDPOINTS } from '../config/api';
import './ViewFeedback.css';

const ViewFeedback = ({ instructorId }) => {
  const [allFeedback, setAllFeedback] = useState([]);
  const [filteredFeedback, setFilteredFeedback] = useState([]);
  const [filter, setFilter] = useState({
    course: '',
    date: '',
    student: ''
  });
  const [error, setError] = useState('');

  const fetchFeedback = async () => {
    if (!instructorId) return;
    try {
      const response = await apiRequest(API_ENDPOINTS.INSTRUCTOR_FEEDBACK(instructorId));
      setAllFeedback(response.data || []);
      setFilteredFeedback(response.data || []);
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

    if (filter.course) {
      feedbackToFilter = feedbackToFilter.filter(f => f.course?.name.toLowerCase().includes(filter.course.toLowerCase()));
    }
    if (filter.date) {
      feedbackToFilter = feedbackToFilter.filter(f => new Date(f.createdAt).toISOString().split('T')[0] === filter.date);
    }
    if (filter.student) {
      feedbackToFilter = feedbackToFilter.filter(f => f.student?.name.toLowerCase().includes(filter.student.toLowerCase()));
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
        <h2 className="card-title"><Filter size={24} /> Filter Feedback</h2>
        <form onSubmit={handleApplyFilter} className="filter-form">
          <div className="form-group">
            <label htmlFor="student">Student Name</label>
            <input type="text" id="student" name="student" value={filter.student} onChange={handleFilterChange} placeholder="e.g., Jane Smith" />
          </div>
          <div className="form-group">
            <label htmlFor="course">Course Name</label>
            <input type="text" id="course" name="course" value={filter.course} onChange={handleFilterChange} placeholder="e.g., Beginner Lessons" />
          </div>
          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input type="date" id="date" name="date" value={filter.date} onChange={handleFilterChange} />
          </div>
          <button type="submit" className="filter-btn">Apply Filters</button>
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
            {filteredFeedback.map(f => (
              <li key={f._id} className="feedback-item">
                <div className="feedback-header">
                  <span className="student-name">{f.student?.name || 'Anonymous'}</span>
                  <div className="feedback-rating">
                    {renderRatingStars(f.rating)}
                  </div>
                </div>
                <div className="feedback-meta">
                  <p className="feedback-course">{f.course?.name || 'General Feedback'}</p>
                  <p className="feedback-date">{new Date(f.createdAt).toLocaleDateString()}</p>
                </div>
                <p className="feedback-comment">{f.comment}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ViewFeedback;
