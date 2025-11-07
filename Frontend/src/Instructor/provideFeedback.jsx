import React, { useState } from 'react';
import { User, Send, CheckCircle, Star, MessageSquare, Calendar } from 'lucide-react';
import { addInstructorFeedback } from '../utils/feedbackStorage';
import './provideFeedback.css';

const ProvideFeedback = () => {
  const [formData, setFormData] = useState({
    studentId: '',
    lessonDate: '',
    lessonType: '',
    rating: 0,
    strengths: '',
    areasForImprovement: '',
    overallComments: '',
    recommendations: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);

  // Dummy student data - in real app, fetch from backend
  const students = [
    { id: '1', name: 'Jane Smith', course: 'Two Wheeler Only' },
    { id: '2', name: 'Mike Johnson', course: 'Four Wheeler Only' },
    { id: '3', name: 'Sarah Lee', course: 'Both Two Wheeler and Four Wheeler' },
    { id: '4', name: 'Chris Miller', course: 'Heavy Vehicle License' },
    { id: '5', name: 'Emily Davis', course: 'Two Wheeler Only' },
    { id: '6', name: 'David Brown', course: 'Four Wheeler Only' }
  ];

  const lessonTypes = [
    'Two Wheeler Only',
    'Four Wheeler Only',
    'Both Two Wheeler and Four Wheeler',
    'Heavy Vehicle License'
  ];

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

    if (!formData.studentId) {
      newErrors.studentId = 'Please select a student';
    }
    if (!formData.lessonDate) {
      newErrors.lessonDate = 'Please select lesson date';
    }
    if (!formData.lessonType) {
      newErrors.lessonType = 'Please select lesson type';
    }
    if (formData.rating === 0) {
      newErrors.rating = 'Please provide a performance rating';
    }
    if (!formData.strengths.trim()) {
      newErrors.strengths = 'Please mention student strengths';
    }
    if (!formData.areasForImprovement.trim()) {
      newErrors.areasForImprovement = 'Please mention areas for improvement';
    }
    if (!formData.overallComments.trim()) {
      newErrors.overallComments = 'Please provide overall comments';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Get selected student info
      const selectedStudent = students.find(s => s.id === formData.studentId);
      
      // Save feedback to localStorage
      const feedbackData = {
        instructorName: 'John Doe', // In real app, get from auth context
        instructorId: 'instructor1', // In real app, get from auth context
        instructorAvatar: 'JD', // In real app, get from auth context
        studentName: selectedStudent.name,
        studentId: formData.studentId,
        lessonType: formData.lessonType,
        lessonDate: formData.lessonDate,
        rating: formData.rating,
        strengths: formData.strengths,
        areasForImprovement: formData.areasForImprovement,
        overallComments: formData.overallComments,
        recommendations: formData.recommendations
      };
      
      addInstructorFeedback(feedbackData);

      console.log('Feedback submitted:', feedbackData);
      setIsSuccess(true);

      // Reset form after 3 seconds
      setTimeout(() => {
        setIsSuccess(false);
        setFormData({
          studentId: '',
          lessonDate: '',
          lessonType: '',
          rating: 0,
          strengths: '',
          areasForImprovement: '',
          overallComments: '',
          recommendations: ''
        });
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
    const labels = ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];
    
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <div key={i} className="star-wrapper">
          <Star
            size={40}
            className={`star ${i <= (hoveredRating || formData.rating) ? 'active' : ''}`}
            fill={i <= (hoveredRating || formData.rating) ? '#ff8c00' : 'transparent'}
            stroke={i <= (hoveredRating || formData.rating) ? '#ff8c00' : '#94a3b8'}
            onMouseEnter={() => setHoveredRating(i)}
            onMouseLeave={() => setHoveredRating(0)}
            onClick={() => handleRatingClick(i)}
            style={{ cursor: 'pointer' }}
          />
          <span className="star-label">{labels[i - 1]}</span>
        </div>
      );
    }
    return stars;
  };

  if (isSuccess) {
    return (
      <div className="provide-feedback-section">
        <div className="success-card">
          <div className="success-animation">
            <CheckCircle className="success-icon" size={80} />
          </div>
          <h2 className="success-title">Feedback Submitted!</h2>
          <p className="success-message">
            Your feedback has been successfully sent to the student.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="provide-feedback-section">
      <div className="section-header">
        <h1 className="section-title">Provide Student Feedback</h1>
        <p className="section-subtitle">
          Share constructive feedback to help your students improve their driving skills
        </p>
      </div>

      <div className="feedback-form-card">
        <form className="instructor-feedback-form" onSubmit={handleSubmit}>
          {/* Student and Lesson Info Section */}
          <div className="form-section">
            <h3 className="section-heading">
              <User size={22} /> Student & Lesson Information
            </h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="studentId">Select Student *</label>
                <select
                  id="studentId"
                  name="studentId"
                  className={`feedback-input ${errors.studentId ? 'error' : ''}`}
                  value={formData.studentId}
                  onChange={handleChange}
                  disabled={isSubmitting}
                >
                  <option value="">Choose a student</option>
                  {students.map(student => (
                    <option key={student.id} value={student.id}>
                      {student.name} - {student.course}
                    </option>
                  ))}
                </select>
                {errors.studentId && <span className="error-text">{errors.studentId}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="lessonDate">Lesson Date *</label>
                <input
                  type="date"
                  id="lessonDate"
                  name="lessonDate"
                  className={`feedback-input ${errors.lessonDate ? 'error' : ''}`}
                  value={formData.lessonDate}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  max={new Date().toISOString().split('T')[0]}
                />
                {errors.lessonDate && <span className="error-text">{errors.lessonDate}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="lessonType">Lesson Type *</label>
              <select
                id="lessonType"
                name="lessonType"
                className={`feedback-input ${errors.lessonType ? 'error' : ''}`}
                value={formData.lessonType}
                onChange={handleChange}
                disabled={isSubmitting}
              >
                <option value="">Select lesson type</option>
                {lessonTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {errors.lessonType && <span className="error-text">{errors.lessonType}</span>}
            </div>
          </div>

          {/* Performance Rating Section */}
          <div className="form-section">
            <h3 className="section-heading">
              <Star size={22} /> Performance Rating
            </h3>
            
            <div className="rating-container">
              {renderStars()}
            </div>
            {errors.rating && <span className="error-text">{errors.rating}</span>}
          </div>

          {/* Feedback Details Section */}
          <div className="form-section">
            <h3 className="section-heading">
              <MessageSquare size={22} /> Detailed Feedback
            </h3>

            <div className="form-group">
              <label htmlFor="strengths">Strengths & Positive Observations *</label>
              <textarea
                id="strengths"
                name="strengths"
                rows="4"
                placeholder="What did the student do well? (e.g., smooth gear changes, good lane positioning...)"
                className={`feedback-textarea ${errors.strengths ? 'error' : ''}`}
                value={formData.strengths}
                onChange={handleChange}
                disabled={isSubmitting}
              ></textarea>
              {errors.strengths && <span className="error-text">{errors.strengths}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="areasForImprovement">Areas for Improvement *</label>
              <textarea
                id="areasForImprovement"
                name="areasForImprovement"
                rows="4"
                placeholder="What skills need more practice? (e.g., parallel parking, checking blind spots...)"
                className={`feedback-textarea ${errors.areasForImprovement ? 'error' : ''}`}
                value={formData.areasForImprovement}
                onChange={handleChange}
                disabled={isSubmitting}
              ></textarea>
              {errors.areasForImprovement && <span className="error-text">{errors.areasForImprovement}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="overallComments">Overall Comments & Progress Notes *</label>
              <textarea
                id="overallComments"
                name="overallComments"
                rows="4"
                placeholder="Provide general observations about the student's progress and performance..."
                className={`feedback-textarea ${errors.overallComments ? 'error' : ''}`}
                value={formData.overallComments}
                onChange={handleChange}
                disabled={isSubmitting}
              ></textarea>
              {errors.overallComments && <span className="error-text">{errors.overallComments}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="recommendations">Recommendations for Next Lesson (Optional)</label>
              <textarea
                id="recommendations"
                name="recommendations"
                rows="3"
                placeholder="Suggest focus areas or exercises for the next session..."
                className="feedback-textarea"
                value={formData.recommendations}
                onChange={handleChange}
                disabled={isSubmitting}
              ></textarea>
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
};

export default ProvideFeedback;
