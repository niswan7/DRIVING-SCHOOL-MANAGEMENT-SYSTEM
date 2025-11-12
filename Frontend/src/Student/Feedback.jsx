import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Pages.css';

const Feedback = () => {
  const navigate = useNavigate();
  const [feedbackData, setFeedbackData] = useState({
    instructor: '',
    rating: 0,
    category: 'general',
    message: ''
  });
  const [instructors, setInstructors] = useState([
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Smith' },
    { id: 3, name: 'Mike Johnson' }
  ]);

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
      alert('Please provide a rating');
      return;
    }
    try {
      // Replace with actual API call
      // await fetch('/api/feedback', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(feedbackData)
      // });
      console.log('Submitting feedback:', feedbackData);
      alert('Thank you for your feedback!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit feedback. Please try again.');
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
        <div className="form-card">
          <div className="feedback-intro">
            <svg className="feedback-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
            <p>Your feedback helps us improve our services and training quality.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="instructor">Select Instructor</label>
              <select
                id="instructor"
                name="instructor"
                value={feedbackData.instructor}
                onChange={handleChange}
                required
              >
                <option value="">Choose an instructor</option>
                {instructors.map(instructor => (
                  <option key={instructor.id} value={instructor.id}>
                    {instructor.name}
                  </option>
                ))}
              </select>
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

            <button type="submit" className="btn btn-primary btn-large">
              Submit Feedback
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Feedback;