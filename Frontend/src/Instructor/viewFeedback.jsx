import React, { useState } from 'react';
import { Star, Filter, MessageCircle, AlertCircle } from 'lucide-react';
import './ViewFeedback.css';

const ViewFeedback = () => {
  // Dummy data for feedback - in a real app, this would be fetched from the backend.
  const allFeedback = [
    { id: 1, student: 'Jane Smith', course: 'Beginner Lessons', date: '2025-10-18', rating: 5, comment: 'Amazing instructor, very patient and clear!' },
    { id: 2, student: 'Mike Johnson', course: 'Advanced Training', date: '2025-10-17', rating: 4, comment: 'Good session, but wished we spent more time on parking.' },
    { id: 3, student: 'Sarah Lee', course: 'Beginner Lessons', date: '2025-10-16', rating: 5, comment: 'Exceeded my expectations. Highly recommended.' },
    { id: 4, student: 'Chris Miller', course: 'Defensive Driving', date: '2025-10-15', rating: 3, comment: 'The course content was good, but the schedule was a bit rushed.' },
  ];

  const [feedback, setFeedback] = useState(allFeedback);
  const [filter, setFilter] = useState({
    course: '',
    date: '',
    student: ''
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
      filteredFeedback = filteredFeedback.filter(f => f.student.toLowerCase().includes(filter.student.toLowerCase()));
    }

    setFeedback(filteredFeedback);
    setShowNoFeedbackMessage(filteredFeedback.length === 0);
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
                  <span className="student-name">{f.student}</span>
                  <div className="feedback-rating">
                    {renderRatingStars(f.rating)}
                  </div>
                </div>
                <div className="feedback-meta">
                  <p className="feedback-course">{f.course}</p>
                  <p className="feedback-date">{f.date}</p>
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
