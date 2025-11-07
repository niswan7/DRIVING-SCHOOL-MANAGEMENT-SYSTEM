import React from 'react';
import { Home, ClipboardList, Calendar, TrendingUp, MessageSquare, Bell, UserCheck, Edit } from 'lucide-react';
import'./style.css'
const Sidebar = ({ activePage, setActivePage }) => {
  return (
    <div className="sidebar">
      <h3 className="sidebar-title">Dashboard</h3>
      <ul className="sidebar-nav-list">
        <li 
          className={`sidebar-nav-item ${activePage === 'home' ? 'active' : ''}`}
          onClick={() => setActivePage('home')}
        >
          <Home size={20} />
          <span>Home</span>
        </li>
        <li 
          className={`sidebar-nav-item ${activePage === 'lessons' ? 'active' : ''}`}
          onClick={() => setActivePage('lessons')}
        >
          <ClipboardList size={20} />
          <span>Manage Lessons</span>
        </li>
        <li 
          className={`sidebar-nav-item ${activePage === 'schedule' ? 'active' : ''}`}
          onClick={() => setActivePage('schedule')}
        >
          <Calendar size={20} />
          <span>Manage Schedule</span>
        </li>
        <li 
          className={`sidebar-nav-item ${activePage === 'conduct-lessons' ? 'active' : ''}`}
          onClick={() => setActivePage('conduct-lessons')}
        >
          <UserCheck size={20} />
          <span>Conduct Lessons</span>
        </li>
        <li 
          className={`sidebar-nav-item ${activePage === 'progress' ? 'active' : ''}`}
          onClick={() => setActivePage('progress')}
        >
          <TrendingUp size={20} />
          <span>Track Progress</span>
        </li>
        <li 
          className={`sidebar-nav-item ${activePage === 'provide-feedback' ? 'active' : ''}`}
          onClick={() => setActivePage('provide-feedback')}
        >
          <Edit size={20} />
          <span>Provide Feedback</span>
        </li>
        <li 
          className={`sidebar-nav-item ${activePage === 'feedback' ? 'active' : ''}`}
          onClick={() => setActivePage('feedback')}
        >
          <MessageSquare size={20} />
          <span>View Feedback</span>
        </li>
        <li 
          className={`sidebar-nav-item ${activePage === 'notifications' ? 'active' : ''}`}
          onClick={() => setActivePage('notifications')}
        >
          <Bell size={20} />
          <span>Notifications</span>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
