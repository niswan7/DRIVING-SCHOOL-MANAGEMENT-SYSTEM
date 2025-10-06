import React from 'react';
import { Award, Users, Calendar, Clock, BarChart2, MessageSquare, Briefcase, UserCheck } from 'lucide-react';
import './DashboardHome.css';

const DashboardHome = ({ data, setActivePage }) => {

  const quickStats = [
    {
      icon: <UserCheck size={40} />,
      title: 'Active Students',
      value: '52', // Placeholder value
      description: 'Currently enrolled and active',
      color: 'blue'
    },
    {
      icon: <Calendar size={40} />,
      title: 'Upcoming Lessons',
      value: data?.upcomingLessons?.length || '0',
      description: 'Lessons in the next 7 days',
      color: 'green'
    },
    {
      icon: <BarChart2 size={40} />,
      title: 'Average Rating',
      value: '4.8/5', // Placeholder value
      description: 'Based on student feedback',
      color: 'purple'
    },
    {
      icon: <Clock size={40} />,
      title: 'Hours This Month',
      value: '45', // Placeholder value
      description: 'Total teaching hours',
      color: 'orange'
    }
  ];

  return (
    <div className="dashboard-home-section">
      <div className="dashboard-header-content">
        <h1 className="dashboard-title-main">
          Welcome back, {data?.name || 'Instructor'}!
        </h1>
        <p className="dashboard-description">
          Here's a quick overview of your activities and performance.
        </p>
      </div>

      <div className="dashboard-stats-grid">
        {quickStats.map((stat, index) => (
          <div className={`dashboard-card ${stat.color}`} key={index}>
            <div className="card-icon">{stat.icon}</div>
            <h3>{stat.title}</h3>
            <p className="stat-value">{stat.value}</p>
            <p className="stat-description">{stat.description}</p>
          </div>
        ))}
      </div>

      <div className="dashboard-actions-grid">
        <div className="action-card" onClick={() => setActivePage('lessons')}>
          <Briefcase size={50} />
          <p>Manage Lessons</p>
        </div>
        <div className="action-card" onClick={() => setActivePage('schedule')}>
          <Calendar size={50} />
          <p>Update Schedule</p>
        </div>
        <div className="action-card" onClick={() => setActivePage('progress')}>
          <Users size={50} />
          <p>Track Student Progress</p>
        </div>
        <div className="action-card" onClick={() => setActivePage('feedback')}>
          <MessageSquare size={50} />
          <p>View Feedback</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
