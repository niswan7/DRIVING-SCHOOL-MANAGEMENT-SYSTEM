import React, { useState, useEffect } from 'react';
import { Users, DollarSign, BookOpen, CheckSquare, ArrowLeft } from 'lucide-react';
import { apiRequest } from '../utils/apiHelper';
import { API_ENDPOINTS } from '../config/api';
import './OverseeReports.css';

const OverseeReports = ({ navigate }) => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRevenue: 0,
    lessonsCompleted: 0,
    activeCourses: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      setError('');
      try {
        // These API calls run in parallel for efficiency
        const [usersRes, paymentsRes, lessonsRes, coursesRes] = await Promise.all([
          apiRequest(API_ENDPOINTS.USERS),
          apiRequest(API_ENDPOINTS.PAYMENTS),
          apiRequest(API_ENDPOINTS.LESSONS),
          apiRequest(API_ENDPOINTS.COURSES)
        ]);

        const totalRevenue = paymentsRes.data.reduce((acc, payment) => acc + payment.amount, 0);
        const lessonsCompleted = lessonsRes.data.filter(l => l.status === 'Completed').length;

        setStats({
          totalUsers: usersRes.data.length,
          totalRevenue: totalRevenue,
          lessonsCompleted: lessonsCompleted,
          activeCourses: coursesRes.data.length,
        });
      } catch (err) {
        setError('Failed to load report data. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const reportCards = [
    {
      icon: Users,
      title: 'Total Users',
      value: stats.totalUsers,
      color: 'blue',
    },
    {
      icon: DollarSign,
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      color: 'green',
    },
    {
      icon: CheckSquare,
      title: 'Lessons Completed',
      value: stats.lessonsCompleted,
      color: 'purple',
    },
    {
      icon: BookOpen,
      title: 'Active Courses',
      value: stats.activeCourses,
      color: 'orange',
    },
  ];

  return (
    <main className="manage-generic-container">
        <div className="manage-users-controls">
            <button className="btn-back" onClick={() => navigate('dashboard')}>
                <ArrowLeft size={20} /> Back to Dashboard
            </button>
        </div>
        <div className="reports-header">
            <h2>System Reports</h2>
            <p>An overview of key metrics and activities across the platform.</p>
        </div>

        {isLoading && <div className="loading-message">Loading reports...</div>}
        {error && <div className="error-message">{error}</div>}

        {!isLoading && !error && (
            <div className="reports-grid">
                {reportCards.map((card, index) => (
                    <div className={`report-card-item ${card.color}`} key={index}>
                        <div className="card-icon-reports">
                            <card.icon size={32} />
                        </div>
                        <div className="report-card-content">
                            <h3>{card.title}</h3>
                            <p className="report-value">{card.value}</p>
                        </div>
                    </div>
                ))}
            </div>
        )}
    </main>
  );
};

export default OverseeReports;
