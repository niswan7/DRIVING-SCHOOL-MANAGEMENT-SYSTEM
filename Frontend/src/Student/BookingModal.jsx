import React, { useState, useEffect } from 'react';
import { apiRequest } from '../utils/apiHelper';
import { API_ENDPOINTS } from '../config/api';
import { Calendar, Clock, User } from 'lucide-react';

const BookingModal = ({ studentId, onClose, onBookingSuccess }) => {
  const [instructors, setInstructors] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [formData, setFormData] = useState({
    instructorId: '',
    date: '',
    time: '',
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

  const fetchInstructorSchedule = async (instructorId) => {
    try {
      const response = await apiRequest(API_ENDPOINTS.INSTRUCTOR_SCHEDULE(instructorId));
      if (response.success) {
        setSchedules(response.data || []);
      }
    } catch (err) {
      setError('Failed to load instructor schedule: ' + err.message);
      setSchedules([]);
    }
  };

  const handleInstructorChange = (e) => {
    const instructorId = e.target.value;
    setFormData({ ...formData, instructorId, time: '' });
    setError('');
    if (instructorId) {
      fetchInstructorSchedule(instructorId);
    } else {
      setSchedules([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await apiRequest(API_ENDPOINTS.LESSONS, {
        method: 'POST',
        data: {
          student: studentId,
          instructor: formData.instructorId,
          date: formData.date,
          time: formData.time,
          status: 'Scheduled'
        }
      });
      
      if (response.success) {
        onBookingSuccess();
        onClose();
      }
    } catch (err) {
      setError(err.message || 'Failed to book lesson');
    } finally {
      setLoading(false);
    }
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <form onSubmit={handleSubmit} className="booking-form">
      <div className="form-group">
        <label><User size={18} /> Select Instructor</label>
        <select
          value={formData.instructorId}
          onChange={handleInstructorChange}
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
        <label><Calendar size={18} /> Select Date</label>
        <input
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          min={getMinDate()}
          required
        />
      </div>

      <div className="form-group">
        <label><Clock size={18} /> Select Time</label>
        {schedules.length > 0 ? (
          <select
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            required
            disabled={!formData.instructorId}
          >
            <option value="">Choose a time slot...</option>
            {schedules.map(schedule => (
              <option key={schedule._id} value={schedule.startTime}>
                {schedule.day}: {schedule.startTime} - {schedule.endTime}
              </option>
            ))}
          </select>
        ) : (
          <input
            type="time"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            required
            disabled={!formData.instructorId}
            placeholder={!formData.instructorId ? "Select an instructor first" : "Select time"}
          />
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="modal-actions">
        <button type="button" onClick={onClose} className="btn-cancel">
          Cancel
        </button>
        <button type="submit" className="btn-submit" disabled={loading}>
          {loading ? 'Booking...' : 'Book Lesson'}
        </button>
      </div>
    </form>
  );
};

export default BookingModal;
