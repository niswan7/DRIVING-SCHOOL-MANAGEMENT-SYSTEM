import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import BookLesson from './BookLesson';
import LessonHistory from './LessonHistory';
import Progress from './Progress';
import MakePayment from './MakePayment';
import PaymentHistory from './PaymentHistory';
import Notifications from './Notification';
import CourseRegistration from './CourseRegistration';
import Feedback from './Feedback';
import { API_ENDPOINTS } from '../config/api';
import './Dashboard.css';

const DashboardHome = () => {
  const navigate = useNavigate();
  
  // State management for dynamic data
  const [dashboardData, setDashboardData] = useState({
    user: {
      name: "User",
      title: "'s Portal"
    },
    nextLesson: null,
    upcomingAssessments: [],
    progress: {
      completed: 0,
      total: 20,
      status: "Not Started"
    },
    payments: {
      balance: 0.00,
      history: [],
      pendingCount: 0
    },
    notifications: [],
    courses: [],
    enrolledCourses: []
  });

  const [loading, setLoading] = useState(true);

  // Simulate API call - Replace with actual backend call
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      
      if (!userStr) {
        console.error('User not found in localStorage');
        setLoading(false);
        return;
      }
      
      const user = JSON.parse(userStr);
      const userId = user._id || user.id;
      
      if (!userId) {
        console.error('User ID not found in user object');
        setLoading(false);
        return;
      }
      
      const API_BASE_URL = 'http://localhost:3000/api';
      
      // Fetch user's enrolled courses
      const enrolledResponse = await fetch(`${API_BASE_URL}${API_ENDPOINTS.GET_ENROLLED_COURSES(userId)}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const enrolledData = await enrolledResponse.json();
      console.log('Enrolled courses response:', enrolledData);
      
      if (enrolledData.success) {
        setDashboardData(prev => ({
          ...prev,
          enrolledCourses: enrolledData.data || []
        }));
      }
      
      // Fetch upcoming bookings
      const bookingsResponse = await fetch(`${API_BASE_URL}/bookings/student/${userId}/upcoming`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Bookings response status:', bookingsResponse.status);
      const bookingsData = await bookingsResponse.json();
      console.log('Upcoming bookings response:', bookingsData);
      console.log('Bookings data array:', bookingsData.data);
      console.log('Number of bookings:', bookingsData.data ? bookingsData.data.length : 0);
      
      if (bookingsData.success && bookingsData.data && bookingsData.data.length > 0) {
        // Get the next upcoming booking
        const nextBooking = bookingsData.data[0];
        console.log('Setting next booking:', nextBooking);
        setDashboardData(prev => ({
          ...prev,
          nextLesson: nextBooking
        }));
      } else {
        console.log('No upcoming bookings found');
        setDashboardData(prev => ({
          ...prev,
          nextLesson: null
        }));
      }
      
      // Fetch upcoming assessments
      const assessmentsResponse = await fetch(`${API_BASE_URL}/assessments/student/${userId}/upcoming`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const assessmentsData = await assessmentsResponse.json();
      console.log('Upcoming assessments response:', assessmentsData);
      
      if (assessmentsData.success && assessmentsData.data) {
        setDashboardData(prev => ({
          ...prev,
          upcomingAssessments: assessmentsData.data || []
        }));
      }
      
      // Fetch payment summary
      const paymentsResponse = await fetch(`${API_BASE_URL}${API_ENDPOINTS.STUDENT_PAYMENT_SUMMARY(userId)}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const paymentsData = await paymentsResponse.json();
      console.log('Payment summary response:', paymentsData);
      
      if (paymentsData.success) {
        setDashboardData(prev => ({
          ...prev,
          payments: {
            balance: Number(paymentsData.data?.pendingAmount || 0),
            history: paymentsData.data?.recentPayments || [],
            pendingCount: Number(paymentsData.data?.pendingCount || 0)
          }
        }));
      }
      
      // Fetch notifications
      const notificationsResponse = await fetch(`${API_BASE_URL}${API_ENDPOINTS.USER_NOTIFICATIONS(userId)}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const notificationsData = await notificationsResponse.json();
      console.log('Notifications response:', notificationsData);
      
      if (notificationsData.success && notificationsData.data) {
        // Get only unread notifications for the dashboard card
        const unreadNotifications = notificationsData.data.filter(n => !n.read).slice(0, 3);
        setDashboardData(prev => ({
          ...prev,
          notifications: unreadNotifications
        }));
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      // Replace with actual logout API call
      // await fetch('/api/logout', { method: 'POST' });
      console.log('Logging out...');
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const progressPercentage = (dashboardData.progress.completed / dashboardData.progress.total) * 100;

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <div className="icon-box">
              <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <line x1="9" y1="3" x2="9" y2="21"/>
              </svg>
            </div>
            <div className="header-text">
              <h1>{dashboardData.user.name}{dashboardData.user.title}</h1>
              <p>Welcome back! Here's a summary of your driving journey.</p>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Logout
          </button>
        </div>
      </header>

      {/* Dashboard Grid */}
      <div className="dashboard-grid">
        {/* Next Lesson Card */}
        <div className="card">
          <div className="card-header">
            <svg className="icon orange" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <h2>Next Lesson</h2>
          </div>
          <div className="card-body">
            {dashboardData.nextLesson ? (
              <div className="lesson-details">
                <p><strong>Date:</strong> {new Date(dashboardData.nextLesson.date).toLocaleDateString()}</p>
                <p><strong>Time:</strong> {dashboardData.nextLesson.time}</p>
                <p><strong>Duration:</strong> {dashboardData.nextLesson.duration} minutes</p>
                <p><strong>Type:</strong> {dashboardData.nextLesson.type}</p>
                {dashboardData.nextLesson.notes && (
                  <p><strong>Notes:</strong> {dashboardData.nextLesson.notes}</p>
                )}
              </div>
            ) : (
              <p className="empty-state">No upcoming lessons scheduled.</p>
            )}
          </div>
          <div className="card-actions">
            <button className="btn btn-primary" onClick={() => navigate('book-lesson')}>
              Book Lesson
            </button>
            <button className="btn btn-secondary" onClick={() => navigate('lesson-history')}>
              View Lesson History
            </button>
          </div>
        </div>

        {/* Progress & Assessments Card */}
        <div className="card card-highlight">
          <div className="card-header">
            <svg className="icon orange" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M3 3v18h18"/>
              <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/>
            </svg>
            <h2>Progress & Assessments</h2>
          </div>
          <div className="card-body">
            {dashboardData.upcomingAssessments.length > 0 ? (
              <div className="assessments-preview">
                <p className="section-label">Upcoming Assessments</p>
                {dashboardData.upcomingAssessments.slice(0, 2).map(assessment => (
                  <div key={assessment._id} className="assessment-item">
                    <p className="assessment-title">{assessment.title}</p>
                    <p className="assessment-due">Due: {new Date(assessment.dueDate).toLocaleDateString()}</p>
                  </div>
                ))}
                {dashboardData.upcomingAssessments.length > 2 && (
                  <p className="more-info">+{dashboardData.upcomingAssessments.length - 2} more</p>
                )}
              </div>
            ) : (
              <p className="empty-state">No upcoming assessments</p>
            )}
          </div>
          <div className="card-actions">
            <button className="btn btn-primary" onClick={() => navigate('progress')}>
              View Progress & Assessments
            </button>
          </div>
        </div>

        {/* Payments Card */}
        <div className="card">
          <div className="card-header">
            <svg className="icon orange" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
              <line x1="1" y1="10" x2="23" y2="10"/>
            </svg>
            <h2>Payments</h2>
          </div>
          <div className="card-body">
            {(dashboardData.payments?.balance || 0) > 0 ? (
              <>
                <p className="payment-label">Pending Amount</p>
                <h3 className="payment-amount">Rs. {(dashboardData.payments?.balance || 0).toFixed(2)}</h3>
                <p className="payment-status">
                  {dashboardData.payments.pendingCount} pending payment{dashboardData.payments.pendingCount > 1 ? 's' : ''}
                </p>
              </>
            ) : (
              <div className="no-pending-payments">
                <svg className="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                <p>No Pending Payments</p>
              </div>
            )}
          </div>
          <div className="card-actions">
            <button className="btn btn-primary" onClick={() => navigate('payment-history')}>
              View Payments
            </button>
          </div>
        </div>

        {/* Notifications Card */}
        <div className="card">
          <div className="card-header">
            <svg className="icon orange" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            <h2>Notifications</h2>
          </div>
          <div className="card-body">
            <div className="notifications-list">
              {dashboardData.notifications.length > 0 ? (
                dashboardData.notifications.slice(0, 1).map(notification => (
                  <div key={notification._id} className="notification-item">
                    <p className="notification-message">
                      <strong>{notification.title}</strong><br />
                      {notification.message}
                    </p>
                    <span className="notification-date">
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))
              ) : (
                <p className="empty-state">No new notifications</p>
              )}
            </div>
          </div>
          <div className="card-actions">
            <button className="btn btn-primary" onClick={() => navigate('notifications')}>
              View All Notifications
            </button>
          </div>
        </div>

        {/* Course Enrollment Card */}
        <div className="card">
          <div className="card-header">
            <svg className="icon orange" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="16"/>
              <line x1="8" y1="12" x2="16" y2="12"/>
            </svg>
            <h2>Course Enrollment</h2>
          </div>
          <div className="card-body">
            {loading ? (
              <p className="empty-state">Loading courses...</p>
            ) : dashboardData.enrolledCourses.length > 0 ? (
              <div className="enrolled-courses-list">
                <p className="card-description" style={{ marginBottom: '12px' }}>
                  You are enrolled in {dashboardData.enrolledCourses.length} course{dashboardData.enrolledCourses.length !== 1 ? 's' : ''}:
                </p>
                <div className="enrolled-courses-preview">
                  {dashboardData.enrolledCourses.slice(0, 2).map((course) => (
                    <div key={course._id} className="enrolled-course-item">
                      <div className="course-item-header">
                        <span className="course-type-badge">
                          {course.type === 'manual' ? '🚗' : '⚙️'} {course.type}
                        </span>
                      </div>
                      <h4 className="course-item-title">{course.title}</h4>
                      <p className="course-item-price">Rs. {course.price?.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
                {dashboardData.enrolledCourses.length > 2 && (
                  <p className="more-courses-text">
                    +{dashboardData.enrolledCourses.length - 2} more course{dashboardData.enrolledCourses.length - 2 !== 1 ? 's' : ''}
                  </p>
                )}
              </div>
            ) : (
              <p className="card-description">
                Explore and enroll in new driving courses to enhance your skills.
              </p>
            )}
          </div>
          <div className="card-actions">
            <button className="btn btn-primary" onClick={() => navigate('course-registration')}>
              {dashboardData.enrolledCourses.length > 0 ? 'View All Courses' : 'Register for a New Course'}
            </button>
          </div>
        </div>

        {/* Feedback Card */}
        <div className="card">
          <div className="card-header">
            <svg className="icon orange" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
            <h2>Feedback</h2>
          </div>
          <div className="card-body">
            <p className="card-description">
              Your feedback helps us improve. Share your experience with your instructor.
            </p>
          </div>
          <div className="card-actions">
            <button className="btn btn-primary" onClick={() => navigate('feedback')}>
              Provide Feedback
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  return (
    <div className="dashboard">
      <Routes>
        <Route path="/" element={<DashboardHome />} />
        <Route path="/book-lesson" element={<BookLesson />} />
        <Route path="/lesson-history" element={<LessonHistory />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/make-payment" element={<MakePayment />} />
        <Route path="/payment-history" element={<PaymentHistory />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/course-registration" element={<CourseRegistration />} />
        <Route path="/feedback" element={<Feedback />} />
      </Routes>
    </div>
  );
};

export default Dashboard;
