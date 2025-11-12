import React, { useEffect, useState } from 'react';
import { API_ENDPOINTS } from '../config/api';
import { BookOpen, Calendar, User, BarChart, Clock, LogOut, PlusCircle, CreditCard, Bell, Star } from 'lucide-react';
import { apiRequest, getCurrentUser, logout } from '../utils/apiHelper';
import Modal from '../components/Modal';
import BookingModal from './BookingModal';
import PaymentModal from './PaymentModal';
import FeedbackModal from './FeedbackModal';
import CourseEnrollmentModal from './CourseEnrollmentModal';
import './Student.css';

function StudentDashboard() {
  const [studentData, setStudentData] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    nextLesson: null,
    lessons: [],
    progress: null,
    payments: [],
    notifications: [],
    courses: []
  });
  const [stats, setStats] = useState({
    totalLessons: 0,
    completedLessons: 0,
    upcomingLessons: 0,
    totalPaid: 0
  });
  const [error, setError] = useState('');
  const [modals, setModals] = useState({
    booking: false,
    payment: false,
    feedback: false,
    enrollment: false
  });

  useEffect(() => {
    const user = getCurrentUser();
    if (user && user.role === 'student') {
      setStudentData(user);
      fetchDashboardData(user._id);
    } else {
      setError("No student is logged in.");
      // Optional: redirect to login
      // window.location.href = '/login';
    }

    // Animate fade-in for header and cards
    setTimeout(() => {
      document.querySelector('.dashboard-header')?.classList.add('loaded');
      document.querySelector('.dashboard-view')?.classList.add('loaded');
    }, 100);
  }, []);

  const fetchDashboardData = async (studentId) => {
    try {
      const [lessonRes, progressRes, paymentRes, notificationRes, courseRes] = await Promise.all([
        apiRequest(API_ENDPOINTS.UPCOMING_LESSONS_STUDENT(studentId)),
        apiRequest(API_ENDPOINTS.STUDENT_PROGRESS(studentId)),
        apiRequest(API_ENDPOINTS.STUDENT_PAYMENTS(studentId)),
        apiRequest(API_ENDPOINTS.USER_NOTIFICATIONS(studentId)),
        apiRequest(API_ENDPOINTS.COURSES)
      ]);

      const lessons = lessonRes.data || [];
      const payments = paymentRes.data || [];
      const upcomingLessons = lessons.filter(l => new Date(l.date) >= new Date());
      const completedLessons = lessons.filter(l => l.status === 'completed');
      const totalPaid = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

      setDashboardData({
        nextLesson: upcomingLessons[0] || null,
        lessons: lessons,
        progress: progressRes.data?.[0] || { hoursCompleted: 0, totalHours: 20, status: 'Not Started' },
        payments: payments,
        notifications: notificationRes.data || [],
        courses: courseRes.data || []
      });

      setStats({
        totalLessons: lessons.length,
        completedLessons: completedLessons.length,
        upcomingLessons: upcomingLessons.length,
        totalPaid: totalPaid
      });
    } catch (err) {
      setError('Failed to load dashboard data: ' + err.message);
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  const openModal = (modalName) => {
    setModals({ ...modals, [modalName]: true });
  };

  const closeModal = (modalName) => {
    setModals({ ...modals, [modalName]: false });
  };

  const handleBookingSuccess = () => {
    if (studentData) {
      fetchDashboardData(studentData._id);
    }
    alert('Lesson booked successfully!');
  };

  const handlePaymentSuccess = () => {
    if (studentData) {
      fetchDashboardData(studentData._id);
    }
    alert('Payment submitted successfully!');
  };

  const handleFeedbackSuccess = () => {
    alert('Thank you for your feedback!');
  };

  const handleEnrollmentSuccess = () => {
    if (studentData) {
      fetchDashboardData(studentData._id);
    }
    alert('Successfully enrolled in course!');
  };

  if (error) {
    return <div className="dashboard-container"><p className="error-message">{error}</p></div>;
  }

  if (!studentData) {
    return <div className="dashboard-container"><p>Loading student data...</p></div>;
  }
  
  const { progress } = dashboardData;
  const progressPercentage = progress ? (progress.hoursCompleted / progress.totalHours) * 100 : 0;


  return (
    <div className="dashboard-container">
      <div className="dashboard-view">
        <div className="dashboard-header">
          <div className="dashboard-header-main">
            <BookOpen className="header-icon" size={40} />
            <div>
              <h1 className="dashboard-main-title">{studentData.name}'s Portal</h1>
              <p className="dashboard-main-subtitle">
                Welcome back! Here's a summary of your driving journey.
              </p>
            </div>
          </div>
          <button className="logout-button" onClick={handleLogout}>
            <LogOut size={20} /> Logout
          </button>
        </div>

        <div className="dashboard-grid">
          {/* Lesson Scheduling */}
          <div className="dashboard-card">
            <div className="card-header">
              <Calendar className="card-icon" size={24} />
              <h3>Next Lesson</h3>
            </div>
            <div className="card-content">
              {dashboardData.nextLesson ? (
                <>
                  <p className="card-main-info">{new Date(dashboardData.nextLesson.date).toLocaleDateString()}</p>
                  <div className="card-details">
                    <span><Clock size={16} /> {dashboardData.nextLesson.time}</span>
                    <span><User size={16} /> {dashboardData.nextLesson.instructor?.name || 'N/A'}</span>
                  </div>
                  <div className="card-stats">
                    <div className="stat-item">
                      <span className="stat-label">Total Lessons</span>
                      <span className="stat-value">{stats.totalLessons}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Upcoming</span>
                      <span className="stat-value">{stats.upcomingLessons}</span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <p className="progress-status">No upcoming lessons scheduled.</p>
                  {stats.totalLessons > 0 && (
                    <div className="card-stats">
                      <div className="stat-item">
                        <span className="stat-label">Total Lessons</span>
                        <span className="stat-value">{stats.totalLessons}</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Completed</span>
                        <span className="stat-value">{stats.completedLessons}</span>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
            <div className="card-footer">
              <button onClick={() => openModal('booking')} className="card-action-button">Book or Reschedule Lessons</button>
            </div>
          </div>

          {/* Progress Tracking */}
          <div className="dashboard-card">
            <div className="card-header">
              <BarChart className="card-icon" size={24} />
              <h3>Progress Tracking</h3>
            </div>
            <div className="card-content">
              {progress ? (
                <>
                  <p className="card-main-info">
                    {progress.hoursCompleted} / {progress.totalHours} Hours
                  </p>
                  <div className="progress-bar-container">
                    <div className="progress-bar" style={{ width: `${progressPercentage}%` }}></div>
                  </div>
                  <p className="progress-status">{progress.status}</p>
                </>
              ) : (
                <p className="progress-status">Loading progress...</p>
              )}
            </div>
            <div className="card-footer">
              <button onClick={() => alert('Progress details will be shown here')} className="card-action-button">View Detailed Assessments</button>
            </div>
          </div>

          {/* Payments */}
          <div className="dashboard-card">
            <div className="card-header">
              <CreditCard className="card-icon" size={24} />
              <h3>Payments</h3>
            </div>
            <div className="card-content">
              {dashboardData.payments.length > 0 ? (
                <>
                  <p className="card-main-info">Rs. {stats.totalPaid.toFixed(2)}</p>
                  <p className="progress-status">Total Paid ({dashboardData.payments.length} payments)</p>
                  <p className="progress-status">Last Payment: {new Date(dashboardData.payments[0].paymentDate).toLocaleDateString()}</p>
                </>
              ) : (
                <>
                  <p className="card-main-info">Rs. 0.00</p>
                  <p className="progress-status">No payment history found.</p>
                </>
              )}
            </div>
            <div className="card-footer">
              <button onClick={() => openModal('payment')} className="card-action-button">Make Payment or View History</button>
            </div>
          </div>

          {/* Notifications */}
          <div className="dashboard-card">
            <div className="card-header">
              <Bell className="card-icon" size={24} />
              <h3>Notifications</h3>
            </div>
            <div className="card-content">
              <ul className="notification-list">
                {dashboardData.notifications.slice(0, 3).map((n) => (
                  <li key={n._id} className="notification-item">
                    {n.message}
                    <span className="time">{new Date(n.createdAt).toLocaleDateString()}</span>
                  </li>
                ))}
                 {dashboardData.notifications.length === 0 && <p className="progress-status">No new notifications.</p>}
              </ul>
            </div>
          </div>

          {/* Course Enrollment */}
          <div className="dashboard-card">
            <div className="card-header">
              <PlusCircle className="card-icon" size={24} />
              <h3>Course Enrollment</h3>
            </div>
            <div className="card-content">
              <p className="progress-status">
                {dashboardData.courses.length > 0 
                  ? `${dashboardData.courses.length} courses available`
                  : 'Explore and enroll in new driving courses to enhance your skills.'}
              </p>
            </div>
            <div className="card-footer">
              <button onClick={() => openModal('enrollment')} className="card-action-button">Register for a New Course</button>
            </div>
          </div>

          {/* Feedback */}
          <div className="dashboard-card">
            <div className="card-header">
              <Star className="card-icon" size={24} />
              <h3>Feedback</h3>
            </div>
            <div className="card-content">
              <p className="progress-status">
                Your feedback helps us improve. Share your experience with your instructor.
              </p>
            </div>
            <div className="card-footer">
              <button onClick={() => openModal('feedback')} className="card-action-button">Provide Feedback</button>
            </div>
          </div>
        </div>

        {/* Modals */}
        <Modal
          isOpen={modals.booking}
          onClose={() => closeModal('booking')}
          title="Book a Lesson"
          size="medium"
        >
          <BookingModal
            studentId={studentData._id}
            onClose={() => closeModal('booking')}
            onBookingSuccess={handleBookingSuccess}
          />
        </Modal>

        <Modal
          isOpen={modals.payment}
          onClose={() => closeModal('payment')}
          title="Make a Payment"
          size="medium"
        >
          <PaymentModal
            studentId={studentData._id}
            onClose={() => closeModal('payment')}
            onPaymentSuccess={handlePaymentSuccess}
          />
        </Modal>

        <Modal
          isOpen={modals.feedback}
          onClose={() => closeModal('feedback')}
          title="Provide Feedback"
          size="medium"
        >
          <FeedbackModal
            studentId={studentData._id}
            onClose={() => closeModal('feedback')}
            onFeedbackSuccess={handleFeedbackSuccess}
          />
        </Modal>

        <Modal
          isOpen={modals.enrollment}
          onClose={() => closeModal('enrollment')}
          title="Enroll in a Course"
          size="large"
        >
          <CourseEnrollmentModal
            studentId={studentData._id}
            onClose={() => closeModal('enrollment')}
            onEnrollmentSuccess={handleEnrollmentSuccess}
          />
        </Modal>
      </div>
    </div>
  );
}

export default StudentDashboard;
