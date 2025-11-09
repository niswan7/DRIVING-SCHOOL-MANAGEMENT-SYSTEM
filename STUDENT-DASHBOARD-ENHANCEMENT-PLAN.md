# Student Dashboard Enhancement Plan

## Implementation Steps

### 1. Create Reusable Modal Components

Create `Frontend/src/components/Modal.jsx`:
```jsx
import React from 'react';
import { X } from 'lucide-react';
import './Modal.css';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content-student" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-student">
          <h2>{title}</h2>
          <button className="modal-close-student" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        <div className="modal-body-student">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
```

### 2. Create Booking Modal Component

Create `Frontend/src/Student/BookingModal.jsx`:
```jsx
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
    courseId: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchInstructors();
  }, []);

  const fetchInstructors = async () => {
    try {
      const response = await apiRequest(API_ENDPOINTS.USERS_BY_ROLE('instructor'));
      setInstructors(response.data || []);
    } catch (err) {
      setError('Failed to load instructors');
    }
  };

  const fetchInstructorSchedule = async (instructorId) => {
    try {
      const response = await apiRequest(API_ENDPOINTS.INSTRUCTOR_SCHEDULE(instructorId));
      setSchedules(response.data || []);
    } catch (err) {
      setError('Failed to load instructor schedule');
    }
  };

  const handleInstructorChange = (e) => {
    const instructorId = e.target.value;
    setFormData({ ...formData, instructorId });
    if (instructorId) {
      fetchInstructorSchedule(instructorId);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await apiRequest(API_ENDPOINTS.LESSONS, {
        method: 'POST',
        data: {
          student: studentId,
          instructor: formData.instructorId,
          date: formData.date,
          time: formData.time,
          status: 'Scheduled'
        }
      });
      
      onBookingSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to book lesson');
    } finally {
      setLoading(false);
    }
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
          min={new Date().toISOString().split('T')[0]}
          required
        />
      </div>

      <div className="form-group">
        <label><Clock size={18} /> Select Time</label>
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
```

### 3. Create Payment Modal Component

Create `Frontend/src/Student/PaymentModal.jsx`:
```jsx
import React, { useState } from 'react';
import { apiRequest } from '../utils/apiHelper';
import { API_ENDPOINTS } from '../config/api';
import { CreditCard, DollarSign } from 'lucide-react';

const PaymentModal = ({ studentId, onClose, onPaymentSuccess }) => {
  const [formData, setFormData] = useState({
    amount: '',
    paymentMethod: 'card',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await apiRequest(API_ENDPOINTS.PAYMENTS, {
        method: 'POST',
        data: {
          studentId,
          amount: parseFloat(formData.amount),
          paymentMethod: formData.paymentMethod,
          paymentDate: new Date().toISOString(),
          status: 'pending',
          description: formData.description
        }
      });
      
      onPaymentSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <div className="form-group">
        <label><DollarSign size={18} /> Amount (Rs.)</label>
        <input
          type="number"
          min="0"
          step="0.01"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          placeholder="Enter amount"
          required
        />
      </div>

      <div className="form-group">
        <label><CreditCard size={18} /> Payment Method</label>
        <select
          value={formData.paymentMethod}
          onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
          required
        >
          <option value="card">Credit/Debit Card</option>
          <option value="cash">Cash</option>
          <option value="bank_transfer">Bank Transfer</option>
          <option value="online">Online Payment</option>
        </select>
      </div>

      <div className="form-group">
        <label>Description (Optional)</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Add payment notes..."
          rows="3"
        />
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="modal-actions">
        <button type="button" onClick={onClose} className="btn-cancel">
          Cancel
        </button>
        <button type="submit" className="btn-submit" disabled={loading}>
          {loading ? 'Processing...' : 'Submit Payment'}
        </button>
      </div>
    </form>
  );
};

export default PaymentModal;
```

### 4. Create Feedback Modal Component

Create `Frontend/src/Student/FeedbackModal.jsx`:
```jsx
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
      setInstructors(response.data || []);
    } catch (err) {
      setError('Failed to load instructors');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await apiRequest(API_ENDPOINTS.FEEDBACK, {
        method: 'POST',
        data: {
          student: studentId,
          instructor: formData.instructorId,
          rating: formData.rating,
          comment: formData.comment
        }
      });
      
      onFeedbackSuccess();
      onClose();
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
      </div>

      <div className="form-group">
        <label><MessageSquare size={18} /> Your Feedback</label>
        <textarea
          value={formData.comment}
          onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
          placeholder="Share your experience..."
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
```

### 5. Create Course Enrollment Modal

Create `Frontend/src/Student/CourseEnrollmentModal.jsx`:
```jsx
import React, { useState, useEffect } from 'react';
import { apiRequest } from '../utils/apiHelper';
import { API_ENDPOINTS } from '../config/api';
import { BookOpen } from 'lucide-react';

const CourseEnrollmentModal = ({ studentId, onClose, onEnrollmentSuccess }) => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await apiRequest(API_ENDPOINTS.COURSES);
      setCourses(response.data || []);
    } catch (err) {
      setError('Failed to load courses');
    }
  };

  const handleEnroll = async () => {
    if (!selectedCourse) {
      setError('Please select a course');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Create a progress record for the student
      await apiRequest(API_ENDPOINTS.PROGRESS, {
        method: 'POST',
        data: {
          student: studentId,
          course: selectedCourse._id,
          hoursCompleted: 0,
          totalHours: selectedCourse.duration || 20,
          status: 'Not Started',
          performanceScore: 0
        }
      });
      
      onEnrollmentSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Enrollment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="course-enrollment">
      <div className="courses-grid">
        {courses.map(course => (
          <div
            key={course._id}
            className={`course-card ${selectedCourse?._id === course._id ? 'selected' : ''}`}
            onClick={() => setSelectedCourse(course)}
          >
            <div className="course-icon">
              <BookOpen size={24} />
            </div>
            <h3>{course.name}</h3>
            <p className="course-description">{course.description}</p>
            <div className="course-details">
              <span>Duration: {course.duration} hours</span>
              <span>Price: Rs. {course.price}</span>
              <span className="course-type">{course.type}</span>
            </div>
          </div>
        ))}
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="modal-actions">
        <button type="button" onClick={onClose} className="btn-cancel">
          Cancel
        </button>
        <button
          onClick={handleEnroll}
          className="btn-submit"
          disabled={!selectedCourse || loading}
        >
          {loading ? 'Enrolling...' : 'Enroll Now'}
        </button>
      </div>
    </div>
  );
};

export default CourseEnrollmentModal;
```

### 6. Update Student.jsx

Add state and handlers for modals:
```jsx
const [modals, setModals] = useState({
  booking: false,
  payment: false,
  feedback: false,
  enrollment: false
});

const openModal = (modalName) => {
  setModals({ ...modals, [modalName]: true });
};

const closeModal = (modalName) => {
  setModals({ ...modals, [modalName]: false });
};

const handleBookingSuccess = () => {
  fetchDashboardData(studentData._id);
  alert('Lesson booked successfully!');
};

// Similar handlers for other modals...
```

Update card action buttons:
```jsx
<button onClick={() => openModal('booking')} className="card-action-button">
  Book or Reschedule Lessons
</button>

<button onClick={() => openModal('payment')} className="card-action-button">
  Make Payment or View History
</button>

<button onClick={() => openModal('feedback')} className="card-action-button">
  Provide Feedback
</button>

<button onClick={() => openModal('enrollment')} className="card-action-button">
  Register for a New Course
</button>
```

Add modals to JSX:
```jsx
<Modal
  isOpen={modals.booking}
  onClose={() => closeModal('booking')}
  title="Book a Lesson"
>
  <BookingModal
    studentId={studentData._id}
    onClose={() => closeModal('booking')}
    onBookingSuccess={handleBookingSuccess}
  />
</Modal>

// Similar for other modals...
```

## Additional CSS Needed

Create `Frontend/src/Student/ModalsEnhanced.css` with modern styling for:
- Modal overlays and containers
- Form groups and inputs
- Button styles
- Course cards grid
- Rating stars
- Error messages
- Loading states

All with animations, hover effects, and gradient styles matching the Admin dashboard.

## Testing Checklist

After implementation:
- [ ] Test lesson booking with different instructors
- [ ] Test payment submission
- [ ] Test feedback with star ratings
- [ ] Test course enrollment
- [ ] Verify data refreshes after modal closes
- [ ] Test responsive design on mobile
- [ ] Verify error handling
- [ ] Check loading states

