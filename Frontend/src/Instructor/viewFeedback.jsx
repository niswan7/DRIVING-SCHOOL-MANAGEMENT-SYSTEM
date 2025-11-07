import React, { useState, useEffect } from 'react';
import { Star, Filter, MessageCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { getStudentFeedback } from '../utils/feedbackStorage';
import './ViewFeedback.css';

const ViewFeedback = () => {
  // Load feedback from localStorage
  const [allFeedback, setAllFeedback] = useState([]);
  const [feedback, setFeedback] = useState([]);
  
  useEffect(() => {
    loadFeedback();
  }, []);

  const loadFeedback = () => {
    const storedFeedback = getStudentFeedback();
    setAllFeedback(storedFeedback);
    setFeedback(storedFeedback);
    setShowNoFeedbackMessage(storedFeedback.length === 0);
  };
  const [filter, setFilter] = useState({
    course: '',
    date: '',
    student: '',
    rating: ''
  });
  const [showNoFeedbackMessage, setShowNoFeedbackMessage] = useState(false);

  const handleFilterChange = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  const handleApplyFilter = (e) => {
    e.preventDefault();
    let filteredFeedback = allFeedback;

    if (filter.course) {
      filteredFeedback = filteredFeedback.filter(f => f.course.toLowerCase().includes(filter.course.toLowerCase()));
    }
    if (filter.date) {
      filteredFeedback = filteredFeedback.filter(f => f.date === filter.date);
    }
    if (filter.student) {
      filteredFeedback = filteredFeedback.filter(f => f.studentName.toLowerCase().includes(filter.student.toLowerCase()));
    }
    if (filter.rating) {
      filteredFeedback = filteredFeedback.filter(f => f.rating === parseInt(filter.rating));
    }

    setFeedback(filteredFeedback);
    setShowNoFeedbackMessage(filteredFeedback.length === 0);
  };

  const handleResetFilter = () => {
    setFilter({
      course: '',
      date: '',
      student: '',
      rating: ''
    });
    setFeedback(allFeedback);
    setShowNoFeedbackMessage(false);
  };

  const handleRefresh = () => {
    loadFeedback();
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

  // Calculate statistics
  const totalFeedback = feedback.length;
  const averageRating = totalFeedback > 0 
    ? (feedback.reduce((sum, f) => sum + f.rating, 0) / totalFeedback).toFixed(1)
    : 0;
  const fiveStarCount = feedback.filter(f => f.rating === 5).length;

  return (
    <div className="view-feedback-section">
      <div className="section-header">
        <h1 className="section-title">Student Feedback</h1>
        <p className="section-subtitle">
          Review ratings and comments submitted by your students.
        </p>
        <button onClick={handleRefresh} className="refresh-btn">
          <RefreshCw size={18} /> Refresh Feedback
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="feedback-stats">
        <div className="stat-card">
          <div className="stat-value">{totalFeedback}</div>
          <div className="stat-label">Total Reviews</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{averageRating}</div>
          <div className="stat-label">Average Rating</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{fiveStarCount}</div>
          <div className="stat-label">5-Star Reviews</div>
        </div>
      </div>

      <div className="filter-card">
        <h2 className="card-title"><Filter size={24} /> Filter Feedback</h2>
        <form onSubmit={handleApplyFilter} className="filter-form">
          <div className="filter-row">
            <div className="form-group">
              <label htmlFor="student">Student Name</label>
              <input 
                type="text" 
                id="student" 
                name="student" 
                value={filter.student} 
                onChange={handleFilterChange} 
                placeholder="e.g., Jane Smith" 
              />
            </div>
            <div className="form-group">
              <label htmlFor="course">Course Name</label>
              <input 
                type="text" 
                id="course" 
                name="course" 
                value={filter.course} 
                onChange={handleFilterChange} 
                placeholder="e.g., Beginner Lessons" 
              />
            </div>
          </div>
          <div className="filter-row">
            <div className="form-group">
              <label htmlFor="date">Date</label>
              <input 
                type="date" 
                id="date" 
                name="date" 
                value={filter.date} 
                onChange={handleFilterChange} 
              />
            </div>
            <div className="form-group">
              <label htmlFor="rating">Rating</label>
              <select 
                id="rating" 
                name="rating" 
                value={filter.rating} 
                onChange={handleFilterChange}
                className="filter-select"
              >
                <option value="">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>
          </div>
          <div className="filter-actions">
            <button type="submit" className="filter-btn">Apply Filters</button>
            <button type="button" className="reset-btn" onClick={handleResetFilter}>
              <RefreshCw size={18} /> Reset
            </button>
          </div>
        </form>
      </div>

      <div className="feedback-list-card">
        <h2 className="card-title"><MessageCircle size={24} /> Feedback List ({totalFeedback})</h2>
        {showNoFeedbackMessage ? (
          <div className="no-feedback-message">
            <AlertCircle size={40} />
            <p>No feedback available for the selected filters.</p>
          </div>
        ) : (
          <ul className="feedback-list">
            {feedback.map(f => (
              <li key={f.id} className="feedback-item">
                <div className="feedback-header">
                  <span className="student-name">{f.studentName}</span>
                  <div className="feedback-rating">
                    {renderRatingStars(f.rating)}
                  </div>
                </div>
                <div className="feedback-meta">
                  <p className="feedback-course">📚 {f.course}</p>
                  <p className="feedback-date">📅 {new Date(f.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
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
