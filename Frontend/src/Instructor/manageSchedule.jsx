import React, { useState, useEffect } from 'react';
import { PlusCircle, Trash2, Copy, AlertCircle } from 'lucide-react';
import { apiRequest } from '../utils/apiHelper';
import { API_ENDPOINTS } from '../config/api';
import './ManageSchedule.css';

const ManageSchedule = ({ instructorId }) => {
  const [schedule, setSchedule] = useState([]);
  const [form, setForm] = useState({
    day: 'Monday',
    startTime: '',
    endTime: '',
  });
  const [error, setError] = useState('');

  const fetchSchedule = async () => {
    if (!instructorId) return;
    try {
      const response = await apiRequest(API_ENDPOINTS.INSTRUCTOR_SCHEDULE(instructorId));
      setSchedule(response.data || []);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, [instructorId]);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleAddAvailability = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.startTime || !form.endTime) {
      setError('Start and end times are required.');
      return;
    }

    if (form.startTime >= form.endTime) {
      setError('End time must be after start time.');
      return;
    }

    try {
      const newSlot = await apiRequest(API_ENDPOINTS.SCHEDULES, {
        method: 'POST',
        data: { ...form, instructorId: instructorId },
      });
      setSchedule([...schedule, newSlot.data]);
      setForm({ day: 'Monday', startTime: '', endTime: '' });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteAvailability = async (id) => {
    if (window.confirm('Are you sure you want to delete this availability slot?')) {
      try {
        await apiRequest(API_ENDPOINTS.SCHEDULE_BY_ID(id), { method: 'DELETE' });
        setSchedule(schedule.filter(slot => slot._id !== id));
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleCopyPreviousWeek = async () => {
    if (!instructorId) {
        setError('Instructor ID is not available to copy schedule.');
        return;
    }
    if (window.confirm('This will copy last week\'s schedule and add it to the current one. Proceed?')) {
        try {
            const response = await apiRequest(API_ENDPOINTS.COPY_SCHEDULE(instructorId), { method: 'POST' });
            if (response.data) {
                // Assuming the backend returns the newly created schedules
                setSchedule(prev => [...prev, ...response.data]);
            } else {
                // As a fallback, just refetch all schedules
                fetchSchedule();
            }
        } catch (err) {
            setError(err.message);
        }
    }
  };

  return (
    <div className="manage-schedule-section">
      <div className="section-header">
        <h1 className="section-title">Manage Schedule</h1>
        <p className="section-subtitle">
          Set and update your available times for lessons.
        </p>
      </div>

      <div className="card-container">
        <div className="schedule-form-card">
          <h2 className="card-title">Add New Availability</h2>
          <form className="schedule-form" onSubmit={handleAddAvailability}>
            <label>
              Day of the Week:
              <select name="day" value={form.day} onChange={handleInputChange}>
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
                <option value="Saturday">Saturday</option>
                <option value="Sunday">Sunday</option>
              </select>
            </label>
            <div className="form-row">
              <label>
                Start Time:
                <input
                  type="time"
                  name="startTime"
                  value={form.startTime}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                End Time:
                <input
                  type="time"
                  name="endTime"
                  value={form.endTime}
                  onChange={handleInputChange}
                  required
                />
              </label>
            </div>
            {error && (
              <p className="error-message"><AlertCircle size={16} /> {error}</p>
            )}
            <div className="form-actions">
              <button type="submit" className="add-btn"><PlusCircle size={18} /> Add Slot</button>
              <button type="button" className="copy-btn" onClick={handleCopyPreviousWeek}><Copy size={18} /> Copy from Last Week</button>
            </div>
          </form>
        </div>

        <div className="schedule-list-card">
          <h2 className="card-title">Your Availability</h2>
          {schedule.length > 0 ? (
            <ul className="schedule-list">
              {schedule.map(slot => (
                <li key={slot._id} className="schedule-item">
                  <div className="slot-details">
                    <p className="slot-info">
                      <strong>Day:</strong> {slot.day}
                    </p>
                    <p className="slot-info">
                      <strong>Time:</strong> {slot.startTime} - {slot.endTime}
                    </p>
                  </div>
                  <button onClick={() => handleDeleteAvailability(slot._id)} className="delete-btn">
                    <Trash2 size={16} /> Delete
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-schedule-msg">No availability set yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageSchedule;
