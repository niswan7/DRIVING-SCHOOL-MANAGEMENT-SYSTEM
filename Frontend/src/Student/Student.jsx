import React from 'react';
import { BookOpen, Calendar, User, BarChart, Clock, LogOut, PlusCircle, CreditCard, Bell, Star } from 'lucide-react';
import './Student.css';


function StudentDashboard() {
    
    const handleLogout = () => {
    window.location.href = '/';
};

const studentData = {
    name: 'John Doe',
    nextLesson: {
        date: 'October 8, 2025',
      time: '2:00 PM',
      instructor: 'Jane Smith',
    },
    progress: {
        hours: 12,
        totalHours: 20,
        status: 'On Track',
    },
    payment: {
        lastPaid: 'September 15, 2025',
        amount: '$499.00'
    },
    notifications: [
        { id: 1, text: 'Your lesson on Oct 8 is confirmed.', time: '1 day ago' },
        { id: 2, text: 'Payment of $499.00 received.', time: '3 days ago' },
        { id: 3, text: 'New course "Defensive Driving" is available.', time: '1 week ago' },
    ]
};

const progressPercentage = (studentData.progress.hours / studentData.progress.totalHours) * 100;

return (
    <>
    <div className="dashboard-container">
      <div className="dashboard-view">
        <div className="dashboard-header">
          <div className="dashboard-header-main">
            <BookOpen className="header-icon" size={40} />
            <div>
              <h1 className="dashboard-main-title">{studentData.name}'s Portal</h1>
              <p className="dashboard-main-subtitle">Welcome back! Here's a summary of your driving journey.</p>
            </div>
          </div>
          <button className="logout-button" onClick={handleLogout}>
            <LogOut size={20} /> Logout
          </button>
        </div>

        <div className="dashboard-grid">
          {/* Lesson Scheduling Card */}
          <div className="dashboard-card">
            <div className="card-header">
              <Calendar className="card-icon" size={24} />
              <h3>Lesson Scheduling</h3>
            </div>
            <div className="card-content">
              <p className="card-main-info">{studentData.nextLesson.date}</p>
              <div className="card-details">
                <span><Clock size={16} /> {studentData.nextLesson.time}</span>
                <span><User size={16} /> {studentData.nextLesson.instructor}</span>
              </div>
            </div>
            <div className="card-footer">
              <a href="#" className="card-action-button">Book or Reschedule Lessons</a>
            </div>
          </div>

          {/* Progress Tracking Card */}
          <div className="dashboard-card">
            <div className="card-header">
              <BarChart className="card-icon" size={24} />
              <h3>Progress Tracking</h3>
            </div>
            <div className="card-content">
              <p className="card-main-info">{studentData.progress.hours} / {studentData.progress.totalHours} Hours</p>
              <div className="progress-bar-container">
                <div className="progress-bar" style={{ width: `${progressPercentage}%` }}></div>
              </div>
              <p className="progress-status">{studentData.progress.status}</p>
            </div>
             <div className="card-footer">
              <a href="#" className="card-action-button">View Detailed Assessments</a>
            </div>
          </div>
          
          {/* Payments Card */}
          <div className="dashboard-card">
            <div className="card-header">
              <CreditCard className="card-icon" size={24} />
              <h3>Payments</h3>
            </div>
            <div className="card-content">
               <p className="card-main-info">{studentData.payment.amount}</p>
               <p className="progress-status">Last Payment: {studentData.payment.lastPaid}</p>
            </div>
             <div className="card-footer">
              <a href="#" className="card-action-button">Make Payment or View History</a>
            </div>
          </div>
          
          {/* Notifications Card */}
          <div className="dashboard-card">
            <div className="card-header">
              <Bell className="card-icon" size={24} />
              <h3>Notifications</h3>
            </div>
            <div className="card-content">
               <ul className="notification-list">
                  {studentData.notifications.map(n => (
                      <li key={n.id} className="notification-item">
                          {n.text}
                          <span className="time">{n.time}</span>
                      </li>
                  ))}
               </ul>
            </div>
          </div>

          {/* Course Enrollment Card */}
          <div className="dashboard-card">
            <div className="card-header">
              <PlusCircle className="card-icon" size={24} />
              <h3>Course Enrollment</h3>
            </div>
            <div className="card-content">
              <p className="progress-status">Explore and enroll in new driving courses to enhance your skills.</p>
            </div>
            <div className="card-footer">
              <a href="#" className="card-action-button">Register for a New Course</a>
            </div>
          </div>

          {/* Feedback Card */}
          <div className="dashboard-card">
            <div className="card-header">
              <Star className="card-icon" size={24} />
              <h3>Feedback</h3>
            </div>
            <div className="card-content">
              <p className="progress-status">Your feedback helps us improve. Share your experience with your instructor.</p>
            </div>
            <div className="card-footer">
              <a href="#" className="card-action-button">Provide Feedback</a>
            </div>
          </div>

        </div>
      </div>
    </div>
    </>
  );
}

export default StudentDashboard;

