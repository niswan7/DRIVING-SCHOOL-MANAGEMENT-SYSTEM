import React, { useState, useEffect } from 'react';
import Header from "./header.jsx";
import Sidebar from "./sidebar.jsx";
import { apiRequest, getCurrentUser } from '../utils/apiHelper.js';
import { API_ENDPOINTS } from '../config/api.js';

// Import all the instructor pages
import DashboardHome from './dashboardHome.jsx';
import ManageLessons from './manageLesson.jsx';
import ManageSchedule from './manageSchedule.jsx';
import ConductLessons from './conductLesson.jsx';
import TrackProgress from './trackProgress.jsx';
import ViewFeedback from './viewFeedback.jsx';
import Notifications from './notifications.jsx';

import './InstructorDashboard.css';

const InstructorDashboard = () => {
  const [activePage, setActivePage] = useState('home');
  const [instructorData, setInstructorData] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    upcomingLessons: [],
    recentFeedback: []
  });

  useEffect(() => {
    const user = getCurrentUser();
    if (user && user.role === 'instructor') {
      setInstructorData(user);
      fetchDashboardData(user._id);
    }
  }, []);

  const fetchDashboardData = async (instructorId) => {
    try {
      const [lessonsRes, feedbackRes, ratingRes, studentsRes] = await Promise.all([
        apiRequest(API_ENDPOINTS.UPCOMING_LESSONS_INSTRUCTOR(instructorId)),
        apiRequest(API_ENDPOINTS.INSTRUCTOR_FEEDBACK(instructorId)),
        apiRequest(API_ENDPOINTS.INSTRUCTOR_RATING(instructorId)),
        apiRequest(API_ENDPOINTS.INSTRUCTOR_STUDENTS(instructorId)),
      ]);

      setDashboardData({
        name: instructorData?.name,
        upcomingLessons: lessonsRes.data || [],
        recentFeedback: feedbackRes.data || [],
        averageRating: ratingRes.data?.averageRating || 0,
        activeStudents: studentsRes.data?.length || 0,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return <DashboardHome data={dashboardData} />;
      case 'schedule':
        return <ManageSchedule instructorId={instructorData?._id} />;
      case 'lessons':
        return <ManageLessons instructorId={instructorData?._id} />;
      case 'conduct-lessons':
        return <ConductLessons instructorId={instructorData?._id} />;
      case 'progress':
        return <TrackProgress instructorId={instructorData?._id} />;
      case 'feedback':
        return <ViewFeedback instructorId={instructorData?._id} />;
      case 'notifications':
        return <Notifications userId={instructorData?._id} />;
      default:
        return <DashboardHome data={dashboardData} />;
    }
  };

  return (
    <div className="instructor-dashboard-container">
      <Header instructorName={`${instructorData?.firstName} ${instructorData?.lastName}`} />
      <div className="main-layout">
        <Sidebar setActivePage={setActivePage} activePage={activePage} />
        <div className="content-area">
          {instructorData ? renderPage() : <p>Loading...</p>}
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;
