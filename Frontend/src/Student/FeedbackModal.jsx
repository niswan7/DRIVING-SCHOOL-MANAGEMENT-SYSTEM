import React, { useState, useEffect } from 'react';
import { apiRequest } from '../utils/apiHelper';
import { API_ENDPOINTS } from '../config/api';
import { Star, MessageSquare } from 'lucide-react';

const FeedbackModal = ({ studentId, onClose, onFeedbackSuccess }) => {
  const [instructors, setInstructors] = useState([]);
  const [formData, setFormData] = useState({
    instructorId: '',
    rating: 5,
    comment: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchInstructors();
  }, []);

  const fetchInstructors = async () => {
    try {
      const response = await apiRequest(API_ENDPOINTS.USERS_BY_ROLE('instructor'));
      if (response.success) {
        setInstructors(response.data || []);
      }
    } catch (err) {
      setError('Failed to load instructors: ' + err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await apiRequest(API_ENDPOINTS.FEEDBACK, {
        method: 'POST',
        data: {
          student: studentId,
          instructor: formData.instructorId,
          rating: formData.rating,
          comment: formData.comment
        }
      });
      
      if (response.success) {
        onFeedbackSuccess();
        onClose();
      }
    } catch (err) {
      setError(err.message || 'Failed to submit feedback');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="feedback-form">
      <div className="form-group">
        <label>Select Instructor</label>
        <select
          value={formData.instructorId}
          onChange={(e) => setFormData({ ...formData, instructorId: e.target.value })}
          required
        >
          <option value="">Choose an instructor...</option>
          {instructors.map(instructor => (
            <option key={instructor._id} value={instructor._id}>
              {instructor.firstName} {instructor.lastName}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label><Star size={18} /> Rating</label>
        <div className="rating-stars">
          {[1, 2, 3, 4, 5].map(star => (
            <Star
              key={star}
              size={32}
              fill={star <= formData.rating ? '#ffc107' : 'none'}
              stroke={star <= formData.rating ? '#ffc107' : '#a0aec0'}
              onClick={() => setFormData({ ...formData, rating: star })}
              style={{ cursor: 'pointer' }}
            />
          ))}
        </div>
        <p style={{ color: '#a0aec0', fontSize: '0.9rem', margin: '0.5rem 0 0 0' }}>
          {formData.rating} out of 5 stars
        </p>
      </div>

      <div className="form-group">
        <label><MessageSquare size={18} /> Your Feedback</label>
        <textarea
          value={formData.comment}
          onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
          placeholder="Share your experience with this instructor..."
          rows="5"
          required
        />
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="modal-actions">
        <button type="button" onClick={onClose} className="btn-cancel">
          Cancel
        </button>
        <button type="submit" className="btn-submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Feedback'}
        </button>
      </div>
    </form>
  );
};

export default FeedbackModal;
