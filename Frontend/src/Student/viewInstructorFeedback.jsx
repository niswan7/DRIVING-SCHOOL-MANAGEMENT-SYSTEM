import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, Calendar, User, BookOpen, ArrowLeft, AlertCircle, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getInstructorFeedbackByStudent } from '../utils/feedbackStorage';
import './viewInstructorFeedback.css';

function ViewInstructorFeedback() {
  const navigate = useNavigate();
  const [feedbackData, setFeedbackData] = useState([]);
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  // Load feedback on component mount
  useEffect(() => {
    loadFeedback();
  }, []);

  const loadFeedback = () => {
    // In real app, get current student ID from auth context
    const currentStudentId = '1'; 
    const feedback = getInstructorFeedbackByStudent(currentStudentId);
    setFeedbackData(feedback);
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          size={20}
          fill={i <= rating ? '#ff8c00' : 'transparent'}
          stroke={i <= rating ? '#ff8c00' : '#94a3b8'}
        />
      );
    }
    return stars;
  };

  const handleViewDetails = (feedback) => {
    setSelectedFeedback(feedback);
  };

  const handleBackToList = () => {
    setSelectedFeedback(null);
  };

  if (selectedFeedback) {
    return (
      <div className="view-instructor-feedback-page">
        <div className="feedback-overlay"></div>
        
        <div className="feedback-detail-card">
          <button onClick={handleBackToList} className="back-button">
            <ArrowLeft size={20} />
            Back to All Feedback
          </button>

          <div className="feedback-detail-header">
            <div className="instructor-info">
              <div className="instructor-avatar">{selectedFeedback.instructorAvatar}</div>
              <div>
                <h2 className="instructor-name">{selectedFeedback.instructorName}</h2>
                <p className="lesson-type">
                  <BookOpen size={16} /> {selectedFeedback.lessonType}
                </p>
              </div>
            </div>
            <div className="feedback-meta">
              <div className="rating-display">
                {renderStars(selectedFeedback.rating)}
              </div>
              <p className="lesson-date">
                <Calendar size={16} /> {new Date(selectedFeedback.lessonDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>

          <div className="feedback-sections">
            <div className="feedback-section positive">
              <h3 className="section-title">
                <span className="icon-badge success">✓</span>
                Strengths & Positive Observations
              </h3>
              <p className="section-content">{selectedFeedback.strengths}</p>
            </div>

            <div className="feedback-section improvement">
              <h3 className="section-title">
                <span className="icon-badge warning">⚠</span>
                Areas for Improvement
              </h3>
              <p className="section-content">{selectedFeedback.areasForImprovement}</p>
            </div>

            <div className="feedback-section general">
              <h3 className="section-title">
                <span className="icon-badge info">💬</span>
                Overall Comments
              </h3>
              <p className="section-content">{selectedFeedback.overallComments}</p>
            </div>

            {selectedFeedback.recommendations && (
              <div className="feedback-section recommendations">
                <h3 className="section-title">
                  <span className="icon-badge primary">→</span>
                  Recommendations for Next Lesson
                </h3>
                <p className="section-content">{selectedFeedback.recommendations}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="view-instructor-feedback-page">
      <div className="feedback-overlay"></div>
      
      <div className="feedback-list-container">
        <div className="page-header">
          <button onClick={() => navigate('/student')} className="back-button">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="page-title">Instructor Feedback</h1>
            <p className="page-subtitle">Review feedback and recommendations from your instructors</p>
          </div>
          <button onClick={loadFeedback} className="refresh-button">
            <RefreshCw size={20} />
            Refresh
          </button>
        </div>

        {feedbackData.length === 0 ? (
          <div className="no-feedback">
            <AlertCircle size={60} />
            <h3>No Feedback Yet</h3>
            <p>You haven't received any feedback from your instructors yet. Check back after your lessons.</p>
          </div>
        ) : (
          <div className="feedback-cards-grid">
            {feedbackData.map((feedback) => (
              <div key={feedback.id} className="feedback-card" onClick={() => handleViewDetails(feedback)}>
                <div className="card-header">
                  <div className="instructor-badge">
                    <div className="instructor-avatar-small">{feedback.instructorAvatar}</div>
                    <div>
                      <h3 className="instructor-name-small">{feedback.instructorName}</h3>
                      <p className="lesson-type-small">{feedback.lessonType}</p>
                    </div>
                  </div>
                  <div className="rating-small">
                    {renderStars(feedback.rating)}
                  </div>
                </div>

                <div className="card-content">
                  <div className="date-badge">
                    <Calendar size={14} />
                    {new Date(feedback.lessonDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                  <p className="feedback-preview">
                    {feedback.overallComments.substring(0, 100)}...
                  </p>
                </div>

                <div className="card-footer">
                  <button className="view-details-btn">
                    <MessageSquare size={16} />
                    View Full Feedback
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewInstructorFeedback;
