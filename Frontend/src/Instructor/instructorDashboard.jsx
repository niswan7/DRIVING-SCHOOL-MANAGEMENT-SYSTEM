import React, { useState, useEffect } from 'react';
import Header from "./header.jsx";
import Sidebar from "./sidebar.jsx";

// Import all the instructor pages
import DashboardHome from './dashboardHome.jsx';
import ManageLessons from './manageLesson.jsx';
import ManageSchedule from './manageSchedule.jsx';
import ConductLessons from './conductLesson.jsx';
import TrackProgress from './trackProgress.jsx';
import ViewFeedback from './viewFeedback.jsx';
import ProvideFeedback from './provideFeedback.jsx';
import Notifications from './notifications.jsx';

import './InstructorDashboard.css';

const InstructorDashboard = () => {
  const [activePage, setActivePage] = useState('home');
  const [instructorData, setInstructorData] = useState(null);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);

  // A dummy function to simulate fetching instructor data from the backend
  useEffect(() => {
    // In a real application, this would be an API call
    const fetchInstructorData = async () => {
      const dummyData = {
        name: 'John Doe',
        avatar: 'path/to/avatar.jpg',
        upcomingLessons: [
          { id: 1, student: 'Alice', time: '10:00 AM' },
          { id: 2, student: 'Bob', time: '02:00 PM' }
        ],
        recentFeedback: [
          { id: 1, student: 'Charlie', rating: 5, comment: 'Great lesson!' }
        ]
      };
      setInstructorData(dummyData);
    };

    fetchInstructorData();
  }, []);

  // Calculate unread notifications count
  const updateNotificationCount = (count) => {
    setUnreadNotificationCount(count);
  };

  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return <DashboardHome data={instructorData} />;
      case 'schedule':
        return <ManageSchedule />;
      case 'lessons':
        return <ManageLessons />;
      case 'conduct-lessons':
        return <ConductLessons />;
      case 'progress':
        return <TrackProgress />;
      case 'feedback':
        return <ViewFeedback />;
      case 'provide-feedback':
        return <ProvideFeedback />;
      case 'notifications':
        return <Notifications onNotificationCountChange={updateNotificationCount} />;
      default:
        return <DashboardHome data={instructorData} />;
    }
  };  return (
    <div className="instructor-dashboard-container">
      <Header instructorName={instructorData?.name} />
      <div className="main-layout">
        <Sidebar setActivePage={setActivePage} activePage={activePage} unreadNotificationCount={unreadNotificationCount} />
        <div className="content-area">
          {renderPage()}
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;

