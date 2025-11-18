import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL, { API_ENDPOINTS } from '../config/api';
import './Pages.css';
import './BookLesson.css';

const BookLesson = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Select course, 2: Select instructor & date, 3: Select time
  
  // Form data
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [lessonType, setLessonType] = useState('practical');
  const [notes, setNotes] = useState('');

  // Data from API
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [availability, setAvailability] = useState({ available: false, slots: [], fullyBooked: false });
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [instructorAvailableDates, setInstructorAvailableDates] = useState([]);
  const [fullyBookedDates, setFullyBookedDates] = useState([]);

  // Fetch enrolled courses
  useEffect(() => {
    fetchEnrolledCourses();
    fetchInstructors();
  }, []);

  // Fetch availability when instructor and date change
  useEffect(() => {
    if (selectedInstructor && selectedDate) {
      fetchAvailability();
    }
  }, [selectedInstructor, selectedDate]);

  // Fetch instructor schedule when instructor is selected
  useEffect(() => {
    if (selectedInstructor) {
      fetchInstructorSchedule();
    } else {
      setInstructorAvailableDates([]);
    }
  }, [selectedInstructor, currentMonth]);

  const fetchEnrolledCourses = async () => {
    try {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        console.error('No user found in localStorage');
        return;
      }
      
      const user = JSON.parse(userStr);
      const userId = user._id || user.id;
      
      console.log('Fetching enrolled courses for user:', userId);

      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.USERS}/${userId}/enrolled-courses`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        console.error('Failed to fetch enrolled courses:', response.status, response.statusText);
        return;
      }
      
      const data = await response.json();
      console.log('Enrolled courses response:', data);
      
      if (data.success) {
        setEnrolledCourses(data.data);
      }
    } catch (error) {
      console.error('Error fetching enrolled courses:', error);
    }
  };

  const fetchInstructors = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Fetching instructors with token:', token ? 'Present' : 'Missing');
      
      const response = await fetch(`${API_BASE_URL}/users/role/instructor`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        console.error('Failed to fetch instructors:', response.status, response.statusText);
        return;
      }
      
      const data = await response.json();
      console.log('Instructors response:', data);
      
      if (data.success) {
        setInstructors(data.data);
      }
    } catch (error) {
      console.error('Error fetching instructors:', error);
    }
  };

  const fetchInstructorSchedule = async () => {
    if (!selectedInstructor) return;
    
    try {
      const token = localStorage.getItem('token');
      
      // Get date range for current month
      const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
      const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
      
      // Format dates in local timezone
      const startDateStr = `${monthStart.getFullYear()}-${String(monthStart.getMonth() + 1).padStart(2, '0')}-${String(monthStart.getDate()).padStart(2, '0')}`;
      const endDateStr = `${monthEnd.getFullYear()}-${String(monthEnd.getMonth() + 1).padStart(2, '0')}-${String(monthEnd.getDate()).padStart(2, '0')}`;
      
      console.log('Fetching schedule for instructor:', selectedInstructor._id);
      
      const response = await fetch(
        `${API_BASE_URL}/schedules/instructor/${selectedInstructor._id}?startDate=${startDateStr}&endDate=${endDateStr}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      if (!response.ok) {
        console.error('Failed to fetch instructor schedule:', response.status);
        setInstructorAvailableDates([]);
        return;
      }
      
      const data = await response.json();
      console.log('Instructor schedule response:', data);
      
      if (data.success && data.data) {
        // Extract dates from schedules
        const availableDates = data.data.map(sched => new Date(sched.date));
        setInstructorAvailableDates(availableDates);
      } else {
        setInstructorAvailableDates([]);
      }
    } catch (error) {
      console.error('Error fetching instructor schedule:', error);
      setInstructorAvailableDates([]);
    }
  };

  const fetchAvailability = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Use local date string to avoid timezone issues
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      
      const dayOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][selectedDate.getDay()];
      
      console.log('Fetching availability for:', {
        instructor: selectedInstructor._id,
        instructorName: `${selectedInstructor.firstName} ${selectedInstructor.lastName}`,
        date: dateStr,
        dayOfWeek: dayOfWeek,
        selectedDate: selectedDate
      });
      
      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.LESSONS}/availability/${selectedInstructor._id}/${dateStr}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      if (!response.ok) {
        console.error('Failed to fetch availability:', response.status, response.statusText);
        setAvailability({ available: false, slots: [], fullyBooked: false });
        return;
      }
      
      const data = await response.json();
      console.log('Availability response:', data);
      
      if (data.success) {
        setAvailability(data.data);
        
        // Track fully booked dates
        if (data.data.fullyBooked) {
          setFullyBookedDates(prev => {
            const dateExists = prev.some(d => d.toDateString() === selectedDate.toDateString());
            if (!dateExists) {
              return [...prev, new Date(selectedDate)];
            }
            return prev;
          });
        }
      } else {
        setAvailability({ available: false, slots: [], fullyBooked: false });
      }
    } catch (error) {
      console.error('Error fetching availability:', error);
      setAvailability({ available: false, slots: [], fullyBooked: false });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      const user = JSON.parse(userStr);
      const userId = user._id || user.id;

      // Format date to YYYY-MM-DD in local timezone
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;

      const lessonData = {
        instructorId: selectedInstructor._id,
        studentId: userId,
        courseId: selectedCourse._id,
        date: formattedDate,
        time: selectedTime,
        duration: 60,
        type: lessonType,
        status: 'scheduled',
        notes: notes
      };

      console.log('Booking lesson with date:', formattedDate, 'from selectedDate:', selectedDate);

      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.LESSONS}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(lessonData)
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (data.success) {
        alert('Lesson booked successfully!');
        navigate('/Dashboard');
      } else {
        console.error('Booking failed:', data);
        alert(`Failed to book lesson: ${data.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error booking lesson:', error);
      alert(`Failed to book lesson: ${error.message}`);
    } finally {
      setLoading(false);
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

  const isDateSelectable = (date) => {
    if (!date) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today;
  };

  const isDateAvailable = (date) => {
    if (!date || !selectedInstructor) return false;
    return instructorAvailableDates.some(availableDate => 
      availableDate.toDateString() === date.toDateString()
    );
  };

  const isDateFullyBooked = (date) => {
    if (!date || !selectedInstructor) return false;
    return fullyBookedDates.some(bookedDate => 
      bookedDate.toDateString() === date.toDateString()
    );
  };

  const formatDate = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' 
    });
  };

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    const today = new Date();
    const prevMonthDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    if (prevMonthDate >= new Date(today.getFullYear(), today.getMonth(), 1)) {
      setCurrentMonth(prevMonthDate);
    }
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedTime(null);
    setAvailability({ available: false, slots: [] });
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate('/Dashboard')}>
          <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back to Dashboard
        </button>
        <h1>Book a Lesson</h1>
      </div>

      <div className="page-content">
        {/* Progress Steps */}
        <div className="booking-steps">
          <div className={`step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
            <div className="step-number">1</div>
            <div className="step-label">Select Course</div>
          </div>
          <div className={`step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
            <div className="step-number">2</div>
            <div className="step-label">Choose Date</div>
          </div>
          <div className={`step ${step >= 3 ? 'active' : ''}`}>
            <div className="step-number">3</div>
            <div className="step-label">Select Time</div>
          </div>
        </div>

        {/* Step 1: Select Course */}
        {step === 1 && (
          <div className="booking-card">
            <h2>Select a Course</h2>
            <p className="subtitle">Choose the course for which you want to book a lesson</p>
            
            {enrolledCourses.length === 0 ? (
              <div className="empty-state">
                <p>You haven't enrolled in any courses yet.</p>
                <button 
                  className="btn btn-primary"
                  onClick={() => navigate('/Dashboard/course-registration')}
                >
                  Enroll in a Course
                </button>
              </div>
            ) : (
              <div className="courses-grid">
                {enrolledCourses.map(course => (
                  <div
                    key={course._id}
                    className={`course-card ${selectedCourse?._id === course._id ? 'selected' : ''}`}
                    onClick={() => setSelectedCourse(course)}
                  >
                    <div className="course-type-badge">
                      {course.type === 'car' ? '🚗' : '🏍️'} {course.type}
                    </div>
                    <h3>{course.title}</h3>
                    <p className="course-description">{course.description}</p>
                    <div className="course-meta">
                      <span>📚 {course.duration} hours</span>
                      <span>💰 ${course.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {selectedCourse && (
              <div className="button-group">
                <button className="btn btn-primary btn-large" onClick={() => setStep(2)}>
                  Continue
                </button>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Select Instructor and Date */}
        {step === 2 && (
          <div className="booking-card">
            <button className="btn-text" onClick={() => setStep(1)}>← Back to Course Selection</button>
            
            <h2>Choose Instructor & Date</h2>
            <p className="subtitle">Course: <strong>{selectedCourse?.title}</strong></p>

            <div className="section">
              <h3>Select Instructor</h3>
              <div className="instructors-grid">
                {instructors.map(instructor => {
                  const fullName = `${instructor.firstName} ${instructor.lastName}`;
                  const initials = `${instructor.firstName?.[0] || ''}${instructor.lastName?.[0] || ''}`.toUpperCase();
                  
                  return (
                    <div
                      key={instructor._id}
                      className={`instructor-card ${selectedInstructor?._id === instructor._id ? 'selected' : ''}`}
                      onClick={() => {
                        setSelectedInstructor(instructor);
                        setSelectedDate(null);
                        setSelectedTime(null);
                      }}
                    >
                      <div className="instructor-avatar">
                        {initials}
                      </div>
                      <div className="instructor-info">
                        <h4>{fullName}</h4>
                        <p>{instructor.email}</p>
                        {instructor.phone && <p>📞 {instructor.phone}</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {selectedInstructor && (
              <div className="section">
                <h3>Select Date</h3>
                <div className="calendar-legend">
                  <div className="legend-item">
                    <span className="legend-indicator available"></span>
                    <span>Instructor Available</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-indicator fully-booked"></span>
                    <span>Fully Booked</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-indicator unavailable"></span>
                    <span>Not Available</span>
                  </div>
                </div>
                <div className="calendar-container">
                  <div className="calendar-header">
                    <button
                      className="calendar-nav-btn"
                      onClick={prevMonth}
                      disabled={currentMonth.getMonth() === new Date().getMonth()}
                    >
                      ‹
                    </button>
                    <h3>
                      {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </h3>
                    <button className="calendar-nav-btn" onClick={nextMonth}>›</button>
                  </div>

                  <div className="calendar-grid">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <div key={day} className="calendar-day-header">{day}</div>
                    ))}
                    {getDaysInMonth(currentMonth).map((date, index) => {
                      const isAvailable = isDateAvailable(date);
                      const isFullyBooked = isDateFullyBooked(date);
                      const isSelectable = isDateSelectable(date) && !isFullyBooked;
                      const isSelected = selectedDate?.toDateString() === date?.toDateString();
                      
                      let title = '';
                      if (isFullyBooked) {
                        title = 'Fully booked';
                      } else if (isAvailable) {
                        title = 'Instructor available';
                      }
                      
                      return (
                        <div
                          key={index}
                          className={`calendar-day ${
                            !date ? 'empty' : ''
                          } ${
                            !isSelectable ? 'disabled' : 'selectable'
                          } ${
                            isAvailable && !isFullyBooked ? 'available' : ''
                          } ${
                            isFullyBooked ? 'fully-booked' : ''
                          } ${
                            isSelected ? 'selected' : ''
                          }`}
                          onClick={() => isSelectable && handleDateSelect(date)}
                          title={title}
                        >
                          {date ? date.getDate() : ''}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {selectedDate && (
                  <div className="selected-date-info">
                    <p>📅 Selected Date: <strong>{formatDate(selectedDate)}</strong></p>
                  </div>
                )}
              </div>
            )}

            {selectedInstructor && selectedDate && (
              <div className="button-group">
                <button className="btn btn-primary btn-large" onClick={() => setStep(3)}>
                  Continue to Time Selection
                </button>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Select Time */}
        {step === 3 && (
          <div className="booking-card">
            <button className="btn-text" onClick={() => setStep(2)}>← Back to Date Selection</button>

            <h2>Select Time Slot</h2>
            <div className="booking-summary">
              <p><strong>Course:</strong> {selectedCourse?.title}</p>
              <p><strong>Instructor:</strong> {selectedInstructor?.name}</p>
              <p><strong>Date:</strong> {formatDate(selectedDate)}</p>
            </div>

            <div className="section">
              <div className="form-group">
                <label>Lesson Type</label>
                <select value={lessonType} onChange={(e) => setLessonType(e.target.value)} className="form-control">
                  <option value="practical">Practical Driving</option>
                  <option value="theory">Theory Class</option>
                </select>
              </div>

              <h3>Available Time Slots</h3>
              {availability.available ? (
                <div className="time-slots-grid">
                  {availability.slots.map(time => (
                    <button
                      key={time}
                      className={`time-slot ${selectedTime === time ? 'selected' : ''}`}
                      onClick={() => setSelectedTime(time)}
                    >
                      {formatTime(time)}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <p>⚠️ No available time slots for this date.</p>
                  <p>Please select a different date or instructor.</p>
                  <button className="btn btn-secondary" onClick={() => setStep(2)}>Change Date</button>
                </div>
              )}

              {selectedTime && (
                <div className="form-group">
                  <label>Additional Notes (Optional)</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any specific requirements or notes for the instructor..."
                    className="form-control"
                    rows="3"
                  />
                </div>
              )}
            </div>

            {selectedTime && (
              <form onSubmit={handleSubmit}>
                <div className="button-group">
                  <button type="submit" className="btn btn-primary btn-large" disabled={loading}>
                    {loading ? 'Booking...' : 'Confirm Booking'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookLesson;