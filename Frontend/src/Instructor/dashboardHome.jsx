import React from 'react';
import { Award, Users, Calendar, Clock, BarChart2, MessageSquare, Briefcase, UserCheck } from 'lucide-react';
import './DashboardHome.css';

const DashboardHome = ({ data, setActivePage }) => {

  const quickStats = [
    {
      icon: <UserCheck size={40} />,
      title: 'Active Students',
      value: data?.activeStudents || '0',
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
      value: `${data?.averageRating?.toFixed(1) || 'N/A'}/5`,
      description: 'Based on student feedback',
      color: 'purple'
    },
    {
      icon: <Clock size={40} />,
      title: 'Hours This Month',
      value: '45', // This would require more complex calculation
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
    </div>
  );
};

export default DashboardHome;
