import React, { useState } from 'react';
import { PlusCircle, Trash2, Copy, AlertCircle } from 'lucide-react';
import './ManageSchedule.css';

const ManageSchedule = () => {
  // Dummy data for schedule - in a real app, this would be from the backend
  const [schedule, setSchedule] = useState([
    { id: 1, day: 'Monday', startTime: '09:00', endTime: '12:00' },
    { id: 2, day: 'Wednesday', startTime: '13:00', endTime: '17:00' },
  ]);

  const [form, setForm] = useState({
    day: 'Monday',
    startTime: '',
    endTime: '',
  });

  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(''); // Clear error on input change
  };

  const handleAddAvailability = (e) => {
    e.preventDefault();

    if (!form.startTime || !form.endTime) {
      setError('Invalid time range entered: Start and end times are required.');
      return;
    }

    // Check for overlapping availability (Exceptional Path)
    const isOverlapping = schedule.some(slot =>
      slot.day === form.day &&
      ((form.startTime >= slot.startTime && form.startTime < slot.endTime) ||
       (form.endTime > slot.startTime && form.endTime <= slot.endTime))
    );

    if (isOverlapping) {
      setError('Overlapping availability already set. Please choose a different time slot.');
      return;
    }

    const newAvailability = {
      id: Date.now(),
      day: form.day,
      startTime: form.startTime,
      endTime: form.endTime,
    };

    setSchedule([...schedule, newAvailability]);
    setForm({ day: 'Monday', startTime: '', endTime: '' });
  };

  const handleDeleteAvailability = (id) => {
    setSchedule(schedule.filter(slot => slot.id !== id));
  };

  const handleCopyPreviousWeek = () => {
    // This is the Alternative Path functionality
    // In a real app, you would fetch last week's data. Here, we'll just duplicate existing data.
    const copiedSchedule = schedule.map(slot => ({
      ...slot,
      id: Date.now() + Math.random(),
    }));
    setSchedule([...schedule, ...copiedSchedule]);
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
                <li key={slot.id} className="schedule-item">
                  <div className="slot-details">
                    <p className="slot-info">
                      <strong>Day:</strong> {slot.day}
                    </p>
                    <p className="slot-info">
                      <strong>Time:</strong> {slot.startTime} - {slot.endTime}
                    </p>
                  </div>
                  <button onClick={() => handleDeleteAvailability(slot.id)} className="delete-btn">
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
