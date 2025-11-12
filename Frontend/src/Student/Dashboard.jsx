import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import BookLesson from './BookLesson';
import LessonHistory from './LessonHistory';
import Assessments from './Assessments';
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
    progress: {
      completed: 0,
      total: 20,
      status: "Not Started"
    },
    payments: {
      balance: 0.00,
      history: []
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
      const userId = localStorage.getItem('userId');
      
      if (!userId) {
        console.error('User ID not found');
        setLoading(false);
        return;
      }
      
      // Fetch user's enrolled courses
      const API_BASE_URL = 'http://localhost:3000/api';
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
            <p className="empty-state">
              {dashboardData.nextLesson ? dashboardData.nextLesson.details : "No upcoming lessons scheduled."}
            </p>
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

        {/* Progress Tracking Card */}
        <div className="card card-highlight">
          <div className="card-header">
            <svg className="icon orange" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M3 3v18h18"/>
              <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/>
            </svg>
            <h2>Progress Tracking</h2>
          </div>
          <div className="card-body">
            <div className="progress-info">
              <h3 className="progress-hours">
                {dashboardData.progress.completed} / {dashboardData.progress.total} Hours
              </h3>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <p className="progress-status">{dashboardData.progress.status}</p>
            </div>
          </div>
          <div className="card-actions">
            <button className="btn btn-primary" onClick={() => navigate('assessments')}>
              View Detailed Assessments
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
            <h3 className="payment-amount">Rs. {dashboardData.payments.balance.toFixed(2)}</h3>
            <p className="empty-state">
              {dashboardData.payments.history.length === 0 ? "No payment history found." : ""}
            </p>
          </div>
          <div className="card-actions">
            <button className="btn btn-primary" onClick={() => navigate('make-payment')}>
              Make Payment
            </button>
            <button className="btn btn-secondary" onClick={() => navigate('payment-history')}>
              View Payment History
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
                  <div key={notification.id} className="notification-item">
                    <p className="notification-message">{notification.message}</p>
                    <span className="notification-date">{notification.date}</span>
                  </div>
                ))
              ) : (
                <p className="empty-state">No notifications</p>
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
        <Route path="/assessments" element={<Assessments />} />
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
