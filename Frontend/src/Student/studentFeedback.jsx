import React, { useState } from 'react';
import { Star, Send, CheckCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { addStudentFeedback } from '../utils/feedbackStorage';
import './studentFeedback.css';

function StudentFeedback() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    instructorName: '',
    courseName: '',
    rating: 0,
    comment: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle rating selection
  const handleRatingClick = (rating) => {
    setFormData(prev => ({
      ...prev,
      rating
    }));
    if (errors.rating) {
      setErrors(prev => ({
        ...prev,
        rating: ''
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.instructorName.trim()) {
      newErrors.instructorName = 'Please select an instructor';
    }
    if (!formData.courseName.trim()) {
      newErrors.courseName = 'Please select a course';
    }
    if (formData.rating === 0) {
      newErrors.rating = 'Please provide a rating';
    }
    if (!formData.comment.trim()) {
      newErrors.comment = 'Please write your feedback';
    } else if (formData.comment.trim().length < 10) {
      newErrors.comment = 'Feedback should be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('Form submitted with data:', formData);

    if (!validateForm()) {
      console.log('Validation failed with errors:', errors);
      return;
    }

    setIsSubmitting(true);

    try {
      // Save feedback to localStorage
      const feedbackData = {
        studentName: 'John Doe', // In real app, get from auth context
        studentId: '1', // In real app, get from auth context
        instructorName: formData.instructorName,
        course: formData.courseName,
        rating: formData.rating,
        comment: formData.comment
      };
      
      console.log('Saving feedback:', feedbackData);
      addStudentFeedback(feedbackData);
      
      console.log('Feedback submitted successfully!');
      setIsSuccess(true);

      // Reset form after 3 seconds and redirect
      setTimeout(() => {
        navigate('/student');
      }, 3000);

    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render star rating
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          size={36}
          className={`star ${i <= (hoveredRating || formData.rating) ? 'active' : ''}`}
          fill={i <= (hoveredRating || formData.rating) ? '#ff8c00' : 'transparent'}
          stroke={i <= (hoveredRating || formData.rating) ? '#ff8c00' : '#94a3b8'}
          onMouseEnter={() => setHoveredRating(i)}
          onMouseLeave={() => setHoveredRating(0)}
          onClick={() => handleRatingClick(i)}
          style={{ cursor: 'pointer' }}
        />
      );
    }
    return stars;
  };

  if (isSuccess) {
    return (
      <div className="feedback-page-container">
        <div className="feedback-overlay"></div>
        <div className="feedback-card success-card">
          <div className="success-animation">
            <CheckCircle className="success-icon" size={80} />
          </div>
          <h2 className="success-title">Thank You!</h2>
          <p className="success-message">
            Your feedback has been submitted successfully. We appreciate your valuable input!
          </p>
          <p className="redirect-message">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="feedback-page-container">
      <div className="feedback-overlay"></div>
      
      <div className="feedback-card">
        <div className="feedback-header">
          <button onClick={() => navigate('/student')} className="back-button">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="feedback-title">Submit Feedback</h2>
            <p className="feedback-subtitle">
              Share your experience and help us improve our services
            </p>
          </div>
        </div>

        <form className="feedback-form" onSubmit={handleSubmit}>
          {/* Instructor Selection */}
          <div className="form-group">
            <label htmlFor="instructorName">Instructor Name *</label>
            <select
              id="instructorName"
              name="instructorName"
              className={`feedback-input ${errors.instructorName ? 'error' : ''}`}
              value={formData.instructorName}
              onChange={handleChange}
              disabled={isSubmitting}
            >
              <option value="">Select an instructor</option>
              <option value="Jane Smith">Jane Smith</option>
              <option value="John Doe">John Doe</option>
              <option value="Mike Johnson">Mike Johnson</option>
              <option value="Sarah Wilson">Sarah Wilson</option>
            </select>
            {errors.instructorName && <span className="error-text">{errors.instructorName}</span>}
          </div>

          {/* Course Selection */}
          <div className="form-group">
            <label htmlFor="courseName">Course/Lesson Type *</label>
            <select
              id="courseName"
              name="courseName"
              className={`feedback-input ${errors.courseName ? 'error' : ''}`}
              value={formData.courseName}
              onChange={handleChange}
              disabled={isSubmitting}
            >
              <option value="">Select a course</option>
              <option value="Two Wheeler Only">Two Wheeler Only</option>
              <option value="Four Wheeler Only">Four Wheeler Only</option>
              <option value="Both Two Wheeler and Four Wheeler">Both Two Wheeler and Four Wheeler</option>
              <option value="Heavy Vehicle License">Heavy Vehicle License</option>
            </select>
            {errors.courseName && <span className="error-text">{errors.courseName}</span>}
          </div>

          {/* Rating */}
          <div className="form-group">
            <label>Rate Your Experience *</label>
            <div className="rating-container">
              {renderStars()}
            </div>
            {formData.rating > 0 && (
              <p className="rating-text">
                {formData.rating === 1 && 'Poor'}
                {formData.rating === 2 && 'Fair'}
                {formData.rating === 3 && 'Good'}
                {formData.rating === 4 && 'Very Good'}
                {formData.rating === 5 && 'Excellent'}
              </p>
            )}
            {errors.rating && <span className="error-text">{errors.rating}</span>}
          </div>

          {/* Feedback Comment */}
          <div className="form-group">
            <label htmlFor="comment">Your Feedback *</label>
            <textarea
              id="comment"
              name="comment"
              rows="6"
              placeholder="Tell us about your experience... What did you like? What can we improve?"
              className={`feedback-textarea ${errors.comment ? 'error' : ''}`}
              value={formData.comment}
              onChange={handleChange}
              disabled={isSubmitting}
            ></textarea>
            <div className="textarea-footer">
              <span className="char-count">{formData.comment.length} characters</span>
              {errors.comment && <span className="error-text">{errors.comment}</span>}
            </div>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="submit-feedback-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="loading-spinner"></span>
                Submitting...
              </>
            ) : (
              <>
                <Send size={20} />
                Submit Feedback
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default StudentFeedback;
