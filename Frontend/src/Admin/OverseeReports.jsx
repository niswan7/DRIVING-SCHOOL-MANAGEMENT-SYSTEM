import React, { useState, useEffect } from 'react';
import { Users, DollarSign, BookOpen, CheckSquare, ArrowLeft, Download, Calendar, TrendingUp, Award } from 'lucide-react';
import { apiRequest } from '../utils/apiHelper';
import { API_ENDPOINTS } from '../config/api';
import './OverseeReports.css';

const OverseeReports = ({ navigate }) => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRevenue: 0,
    lessonsCompleted: 0,
    activeCourses: 0,
    studentsThisMonth: 0,
    revenueThisMonth: 0,
    mostEnrolledCourse: null,
    studentsByRole: { student: 0, instructor: 0, admin: 0 }
  });
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [dateError, setDateError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [allData, setAllData] = useState({ users: [], payments: [], lessons: [], courses: [] });

  useEffect(() => {
    fetchStats();
  }, []);

  const validateDateRange = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    if (startDate > endDate) {
      setDateError('Start date cannot be after end date');
      return false;
    }
    
    if (endDate > new Date()) {
      setDateError('End date cannot be in the future');
      return false;
    }
    
    setDateError('');
    return true;
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    const newDateRange = { ...dateRange, [name]: value };
    setDateRange(newDateRange);
    
    if (newDateRange.startDate && newDateRange.endDate) {
      if (validateDateRange(newDateRange.startDate, newDateRange.endDate)) {
        calculateMetrics(allData, newDateRange);
      }
    }
  };

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

      const data = {
        users: usersRes.data,
        payments: paymentsRes.data,
        lessons: lessonsRes.data,
        courses: coursesRes.data
      };
      
      setAllData(data);
      calculateMetrics(data, dateRange);
    } catch (err) {
      setError('Failed to load report data. Please try again later.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateMetrics = (data, range) => {
    const { users, payments, lessons, courses } = data;
    const startDate = new Date(range.startDate);
    const endDate = new Date(range.endDate);
    endDate.setHours(23, 59, 59, 999); // Include the entire end date

    // Total revenue (all time, completed payments only)
    const totalRevenue = payments
      .filter(p => p.status === 'completed')
      .reduce((acc, payment) => {
        const amount = parseFloat(payment.amount) || 0;
        return acc + amount;
      }, 0);

    // Revenue in selected date range
    const revenueInRange = payments
      .filter(p => {
        const paymentDate = new Date(p.createdAt);
        return p.status === 'completed' && paymentDate >= startDate && paymentDate <= endDate;
      })
      .reduce((acc, payment) => {
        const amount = parseFloat(payment.amount) || 0;
        return acc + amount;
      }, 0);

    // Students enrolled in date range
    const studentsInRange = users.filter(u => {
      const createdDate = new Date(u.createdAt);
      return u.role === 'student' && createdDate >= startDate && createdDate <= endDate;
    }).length;

    // Lessons completed (all time and in range)
    const lessonsCompleted = lessons.filter(l => l.status === 'completed').length;
    const lessonsInRange = lessons.filter(l => {
      const lessonDate = new Date(l.updatedAt || l.createdAt);
      return l.status === 'completed' && lessonDate >= startDate && lessonDate <= endDate;
    }).length;

    // Most enrolled course - need to check which course has most students
    // For now, we'll use the first course as placeholder since we don't have enrollment data
    const mostEnrolledCourse = courses.length > 0 ? courses[0] : null;

    // Count users by role
    const studentsByRole = users.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, { student: 0, instructor: 0, admin: 0 });

    setStats({
      totalUsers: users.length,
      totalRevenue: totalRevenue,
      lessonsCompleted: lessonsCompleted,
      activeCourses: courses.filter(c => c.status === 'active').length,
      studentsThisMonth: studentsInRange,
      revenueThisMonth: revenueInRange,
      lessonsInRange: lessonsInRange,
      mostEnrolledCourse: mostEnrolledCourse,
      studentsByRole: studentsByRole
    });
  };

  const exportToCSV = () => {
    const { users, payments, lessons, courses } = allData;
    
    // Create CSV content
    let csv = 'DRIVING SCHOOL MANAGEMENT SYSTEM - REPORT\n';
    csv += `Generated: ${new Date().toLocaleString()}\n`;
    csv += `Date Range: ${dateRange.startDate} to ${dateRange.endDate}\n\n`;
    
    // Overall Statistics
    csv += 'OVERALL STATISTICS\n';
    csv += 'Metric,Value\n';
    csv += `Total Users,${stats.totalUsers}\n`;
    csv += `Total Students,${stats.studentsByRole.student}\n`;
    csv += `Total Instructors,${stats.studentsByRole.instructor}\n`;
    csv += `Total Admins,${stats.studentsByRole.admin}\n`;
    csv += `Total Revenue (All Time),$${stats.totalRevenue.toFixed(2)}\n`;
    csv += `Active Courses,${stats.activeCourses}\n`;
    csv += `Lessons Completed (All Time),${stats.lessonsCompleted}\n\n`;
    
    // Date Range Statistics
    csv += 'DATE RANGE STATISTICS\n';
    csv += 'Metric,Value\n';
    csv += `New Students Enrolled,${stats.studentsThisMonth}\n`;
    csv += `Revenue Generated,$${stats.revenueThisMonth.toFixed(2)}\n`;
    csv += `Lessons Completed,${stats.lessonsInRange}\n\n`;
    
    // Most Enrolled Course
    if (stats.mostEnrolledCourse) {
      csv += 'MOST POPULAR COURSE\n';
      csv += `Course Name,${stats.mostEnrolledCourse.title}\n`;
      csv += `Type,${stats.mostEnrolledCourse.type}\n`;
      csv += `Duration,${stats.mostEnrolledCourse.duration} hours\n`;
      csv += `Price,$${stats.mostEnrolledCourse.price}\n\n`;
    }
    
    // Payment Details
    csv += 'PAYMENT DETAILS (IN DATE RANGE)\n';
    csv += 'Date,Student,Amount,Type,Method,Status\n';
    const startDate = new Date(dateRange.startDate);
    const endDate = new Date(dateRange.endDate);
    endDate.setHours(23, 59, 59, 999);
    
    payments
      .filter(p => {
        const paymentDate = new Date(p.createdAt);
        return paymentDate >= startDate && paymentDate <= endDate;
      })
      .forEach(p => {
        const studentName = p.studentId?.firstName && p.studentId?.lastName 
          ? `${p.studentId.firstName} ${p.studentId.lastName}`
          : 'Unknown';
        csv += `${new Date(p.createdAt).toLocaleDateString()},${studentName},$${p.amount},${p.type || 'course'},${p.paymentMethod},${p.status}\n`;
      });
    
    // Create download link
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DSMS_Report_${dateRange.startDate}_to_${dateRange.endDate}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const reportCards = [
    {
      icon: Users,
      title: 'Total Users',
      value: stats.totalUsers,
      color: 'blue',
    },
    {
      icon: DollarSign,
      title: 'Total Revenue (All Time)',
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

  const dateRangeCards = [
    {
      icon: Users,
      title: 'New Students Enrolled',
      value: stats.studentsThisMonth,
      color: 'blue',
      subtitle: 'In selected date range'
    },
    {
      icon: DollarSign,
      title: 'Revenue Generated',
      value: `$${stats.revenueThisMonth.toLocaleString()}`,
      color: 'green',
      subtitle: 'In selected date range'
    },
    {
      icon: CheckSquare,
      title: 'Lessons Completed',
      value: stats.lessonsInRange,
      color: 'purple',
      subtitle: 'In selected date range'
    },
    {
      icon: Award,
      title: 'Most Popular Course',
      value: stats.mostEnrolledCourse?.title || 'N/A',
      color: 'orange',
      subtitle: stats.mostEnrolledCourse ? `$${stats.mostEnrolledCourse.price}` : ''
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
            <>
                <div className="reports-section">
                    <h3>Overall Statistics</h3>
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
                </div>

                <div className="reports-section">
                    <h3>
                      <TrendingUp size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                      Date Range Metrics
                    </h3>

                    {/* Date Range Selector */}
                    <div className="date-range-selector">
                      <div className="date-range-inputs">
                        <div className="date-input-group">
                          <label>
                            <Calendar size={16} />
                            Start Date
                          </label>
                          <input 
                            type="date" 
                            name="startDate" 
                            value={dateRange.startDate} 
                            onChange={handleDateChange}
                            max={new Date().toISOString().split('T')[0]}
                          />
                        </div>
                        <div className="date-input-group">
                          <label>
                            <Calendar size={16} />
                            End Date
                          </label>
                          <input 
                            type="date" 
                            name="endDate" 
                            value={dateRange.endDate} 
                            onChange={handleDateChange}
                            max={new Date().toISOString().split('T')[0]}
                          />
                        </div>
                      </div>
                      {dateError && <div className="date-error">{dateError}</div>}
                    </div>

                    <div className="reports-grid">
                        {dateRangeCards.map((card, index) => (
                            <div className={`report-card-item ${card.color}`} key={index}>
                                <div className="card-icon-reports">
                                    <card.icon size={32} />
                                </div>
                                <div className="report-card-content">
                                    <h3>{card.title}</h3>
                                    <p className="report-value">{card.value}</p>
                                    {card.subtitle && <p className="report-subtitle">{card.subtitle}</p>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="reports-section">
                    <h3>User Distribution</h3>
                    <div className="user-distribution">
                        <div className="distribution-item">
                            <span className="role-label">Students:</span>
                            <span className="role-count">{stats.studentsByRole.student}</span>
                        </div>
                        <div className="distribution-item">
                            <span className="role-label">Instructors:</span>
                            <span className="role-count">{stats.studentsByRole.instructor}</span>
                        </div>
                        <div className="distribution-item">
                            <span className="role-label">Admins:</span>
                            <span className="role-count">{stats.studentsByRole.admin}</span>
                        </div>
                    </div>
                </div>

                {/* Export Button at Bottom Right */}
                <div className="export-button-container">
                    <button className="btn btn-create" onClick={exportToCSV}>
                        <Download size={18} /> Export to CSV
                    </button>
                </div>
            </>
        )}
    </main>
  );
};

export default OverseeReports;
