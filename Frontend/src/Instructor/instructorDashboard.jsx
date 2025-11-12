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
    console.log('Current user:', user);
    if (user && user.role === 'instructor') {
      setInstructorData(user);
      const userId = user._id || user.id;
      console.log('Fetching dashboard data for instructor:', userId);
      fetchDashboardData(userId);
    } else {
      console.error('User is not an instructor or not logged in');
    }
  }, []);

  const fetchDashboardData = async (instructorId) => {
    try {
      console.log('Fetching dashboard data with instructor ID:', instructorId);
      const [lessonsRes, feedbackRes, ratingRes, studentsRes] = await Promise.all([
        apiRequest(API_ENDPOINTS.UPCOMING_LESSONS_INSTRUCTOR(instructorId)),
        apiRequest(API_ENDPOINTS.INSTRUCTOR_FEEDBACK(instructorId)),
        apiRequest(API_ENDPOINTS.INSTRUCTOR_RATING(instructorId)),
        apiRequest(API_ENDPOINTS.INSTRUCTOR_STUDENTS(instructorId)),
      ]);

      console.log('Dashboard data fetched:', {
        lessons: lessonsRes,
        feedback: feedbackRes,
        rating: ratingRes,
        students: studentsRes
      });

      setDashboardData({
        name: `${instructorData?.firstName || ''} ${instructorData?.lastName || ''}`.trim() || 'Instructor',
        upcomingLessons: lessonsRes.data || [],
        recentFeedback: feedbackRes.data || [],
        averageRating: ratingRes.data?.averageRating || 0,
        activeStudents: studentsRes.data?.length || 0,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      // Set default data even if fetch fails
      setDashboardData({
        name: `${instructorData?.firstName || ''} ${instructorData?.lastName || ''}`.trim() || 'Instructor',
        upcomingLessons: [],
        recentFeedback: [],
        averageRating: 0,
        activeStudents: 0,
      });
    }
  };

  const renderPage = () => {
    const userId = instructorData?._id || instructorData?.id;
    
    switch (activePage) {
      case 'home':
        return <DashboardHome data={dashboardData} setActivePage={setActivePage} />;
      case 'schedule':
        return <ManageSchedule instructorId={userId} />;
      case 'lessons':
        return <ManageLessons instructorId={userId} />;
      case 'conduct-lessons':
        return <ConductLessons instructorId={userId} />;
      case 'progress':
        return <TrackProgress instructorId={userId} />;
      case 'feedback':
        return <ViewFeedback instructorId={userId} />;
      case 'notifications':
        return <Notifications userId={userId} />;
      default:
        return <DashboardHome data={dashboardData} setActivePage={setActivePage} />;
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
