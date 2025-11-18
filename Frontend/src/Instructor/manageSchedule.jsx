import React, { useState, useEffect } from 'react';
import { Trash2, AlertCircle, Save, Calendar } from 'lucide-react';
import { apiRequest } from '../utils/apiHelper';
import { API_ENDPOINTS } from '../config/api';
import './ManageSchedule.css';

const ManageSchedule = ({ instructorId }) => {
  const [schedule, setSchedule] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSchedules, setSelectedSchedules] = useState([]);
  const [form, setForm] = useState({
    startTime: '09:00',
    endTime: '17:00',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchSchedule = async () => {
    if (!instructorId) return;
    try {
      // Get schedules for current month
      const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
      const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

      // Format dates in local timezone
      const startDateStr = `${monthStart.getFullYear()}-${String(monthStart.getMonth() + 1).padStart(2, '0')}-${String(monthStart.getDate()).padStart(2, '0')}`;
      const endDateStr = `${monthEnd.getFullYear()}-${String(monthEnd.getMonth() + 1).padStart(2, '0')}-${String(monthEnd.getDate()).padStart(2, '0')}`;

      const response = await apiRequest(
        `${API_ENDPOINTS.INSTRUCTOR_SCHEDULE(instructorId)}?startDate=${startDateStr}&endDate=${endDateStr}`
      );
      setSchedule(response.data || []);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, [instructorId, currentMonth]);

  useEffect(() => {
    if (selectedDate) {
      fetchSchedulesForDate(selectedDate);
    }
  }, [selectedDate]);

  const fetchSchedulesForDate = async (date) => {
    if (!date || !instructorId) return;
    try {
      // Format date in local timezone
      const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      const response = await apiRequest(
        `${API_ENDPOINTS.SCHEDULES}/instructor/${instructorId}/date/${dateStr}`
      );
      setSelectedSchedules(response.data || []);
      
      // Set form with first schedule if exists
      if (response.data && response.data.length > 0) {
        setForm({
          startTime: response.data[0].startTime,
          endTime: response.data[0].endTime,
        });
      } else {
        setForm({
          startTime: '09:00',
          endTime: '17:00',
        });
      }
    } catch (err) {
      console.error('Error fetching schedules for date:', err);
      setSelectedSchedules([]);
    }
  };

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSaveAvailability = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!selectedDate) {
      setError('Please select a date first.');
      return;
    }

    if (!form.startTime || !form.endTime) {
      setError('Start and end times are required.');
      return;
    }

    if (form.startTime >= form.endTime) {
      setError('End time must be after start time.');
      return;
    }

    try {
      // Format date in local timezone
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      
      // Delete existing schedules for this date first
      for (const sched of selectedSchedules) {
        await apiRequest(API_ENDPOINTS.SCHEDULE_BY_ID(sched._id), { method: 'DELETE' });
      }
      
      // Create new schedule
      const newSlot = await apiRequest(API_ENDPOINTS.SCHEDULES, {
        method: 'POST',
        data: {
          instructorId: instructorId,
          date: dateStr,
          startTime: form.startTime,
          endTime: form.endTime,
        },
      });
      
      setSuccess('Availability saved successfully!');
      fetchSchedule();
      fetchSchedulesForDate(selectedDate);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteAvailability = async () => {
    if (!selectedDate || selectedSchedules.length === 0) {
      setError('No availability to delete for this date.');
      return;
    }

    if (window.confirm('Are you sure you want to delete availability for this date?')) {
      try {
        for (const sched of selectedSchedules) {
          await apiRequest(API_ENDPOINTS.SCHEDULE_BY_ID(sched._id), { method: 'DELETE' });
        }
        setSuccess('Availability deleted successfully!');
        setSelectedSchedules([]);
        setForm({ startTime: '09:00', endTime: '17:00' });
        fetchSchedule();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  // Calendar functions
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    return days;
  };

  const isDateInPast = (date) => {
    if (!date) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const hasScheduleForDate = (date) => {
    if (!date) return false;
    // Format date in local timezone
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    return schedule.some(sched => {
      const schedDate = new Date(sched.date);
      const schedDateStr = `${schedDate.getFullYear()}-${String(schedDate.getMonth() + 1).padStart(2, '0')}-${String(schedDate.getDate()).padStart(2, '0')}`;
      return schedDateStr === dateStr;
    });
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    setSelectedDate(null);
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    setSelectedDate(null);
  };

  const handleDateSelect = (date) => {
    if (!isDateInPast(date)) {
      setSelectedDate(date);
      setError('');
      setSuccess('');
    }
  };

  return (
    <div className="manage-schedule-section">
      <div className="section-header">
        <h1 className="section-title"><Calendar size={24} /> Manage Schedule</h1>
        <p className="section-subtitle">
          Set your available dates and times for lessons. Click on a date to set availability.
        </p>
      </div>

      <div className="schedule-container">
        {/* Left side - Calendar */}
        <div className="calendar-card">
          <div className="calendar-header">
            <button className="calendar-nav-btn" onClick={prevMonth}>‹</button>
            <h3>{currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h3>
            <button className="calendar-nav-btn" onClick={nextMonth}>›</button>
          </div>

          <div className="calendar-legend">
            <div className="legend-item">
              <span className="legend-indicator has-schedule"></span>
              <span>Available</span>
            </div>
            <div className="legend-item">
              <span className="legend-indicator no-schedule"></span>
              <span>Not Set</span>
            </div>
            <div className="legend-item">
              <span className="legend-indicator past-date"></span>
              <span>Past Date</span>
            </div>
          </div>

          <div className="calendar-grid">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="calendar-day-header">{day}</div>
            ))}
            {getDaysInMonth(currentMonth).map((date, index) => {
              const isPast = isDateInPast(date);
              const hasSchedule = hasScheduleForDate(date);
              const isSelected = selectedDate?.toDateString() === date?.toDateString();
              
              return (
                <div
                  key={index}
                  className={`calendar-day ${
                    !date ? 'empty' : ''
                  } ${
                    isPast ? 'past' : 'future'
                  } ${
                    hasSchedule ? 'has-schedule' : ''
                  } ${
                    isSelected ? 'selected' : ''
                  }`}
                  onClick={() => date && !isPast && handleDateSelect(date)}
                >
                  {date ? date.getDate() : ''}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right side - Time Selection */}
        <div className="time-selection-card">
          <h2 className="card-title">
            {selectedDate 
              ? `Set Availability for ${selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}`
              : 'Select a Date'
            }
          </h2>

          {selectedDate ? (
            <>
              <form className="time-form" onSubmit={handleSaveAvailability}>
                <div className="form-group">
                  <label>From:</label>
                  <input
                    type="time"
                    name="startTime"
                    value={form.startTime}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>To:</label>
                  <input
                    type="time"
                    name="endTime"
                    value={form.endTime}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {error && (
                  <div className="error-message">
                    <AlertCircle size={16} /> {error}
                  </div>
                )}

                {success && (
                  <div className="success-message">
                    ✓ {success}
                  </div>
                )}

                <div className="form-actions">
                  <button type="submit" className="save-btn">
                    <Save size={18} /> Save Changes
                  </button>
                  {selectedSchedules.length > 0 && (
                    <button type="button" className="delete-btn" onClick={handleDeleteAvailability}>
                      <Trash2 size={18} /> Remove Availability
                    </button>
                  )}
                </div>
              </form>

              {selectedSchedules.length > 0 && (
                <div className="current-availability">
                  <h3>Current Availability:</h3>
                  <p className="availability-time">
                    {selectedSchedules[0].startTime} - {selectedSchedules[0].endTime}
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="no-selection">
              <Calendar size={48} />
              <p>Click on a date in the calendar to set your availability</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageSchedule;
