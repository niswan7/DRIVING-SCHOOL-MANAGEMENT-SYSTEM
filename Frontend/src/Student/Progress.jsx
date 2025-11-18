import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/api';
import './Pages.css';

const Progress = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [attendanceProgress, setAttendanceProgress] = useState(null);
  const [assessments, setAssessments] = useState([]);
  const [completingAssessment, setCompletingAssessment] = useState(null);

  useEffect(() => {
    fetchEnrolledCourses();
  }, []);

  const fetchEnrolledCourses = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      
      if (!userStr) {
        console.error('User not found');
        setLoading(false);
        return;
      }
      
      const user = JSON.parse(userStr);
      const userId = user._id || user.id;
      
      const API_BASE_URL = 'http://localhost:3000/api';
      
      // Fetch enrolled courses
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.GET_ENROLLED_COURSES(userId)}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      console.log('Enrolled courses:', data);
      
      if (data.success && data.data && data.data.length > 0) {
        setCourses(data.data);
        // Auto-select first course
        setSelectedCourse(data.data[0]);
        fetchCourseProgress(userId, data.data[0]);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching enrolled courses:', error);
      setLoading(false);
    }
  };

  const fetchCourseProgress = async (studentId, course) => {
    try {
      const token = localStorage.getItem('token');
      const API_BASE_URL = 'http://localhost:3000/api';
      
      // Fetch attendance progress (bookings)
      const bookingsResponse = await fetch(`${API_BASE_URL}/bookings?studentId=${studentId}&courseId=${course._id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const bookingsData = await bookingsResponse.json();
      console.log('Bookings data:', bookingsData);
      console.log('Course data:', course);
      
      if (bookingsData.success) {
        const completedBookings = bookingsData.data.filter(b => b.status === 'completed');
        const totalHours = completedBookings.reduce((sum, b) => sum + (b.duration || 60), 0) / 60;
        const attendedCount = completedBookings.filter(b => b.attendance === 'attended').length;
        
        setAttendanceProgress({
          totalBookings: bookingsData.data.length,
          completedBookings: completedBookings.length,
          attendedCount: attendedCount,
          totalHours: totalHours,
          requiredHours: course?.duration || course?.totalHours || 20
        });
      }
      
      // Fetch assessments
      const assessmentsResponse = await fetch(`${API_BASE_URL}/assessments/student/${studentId}/course/${course._id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const assessmentsData = await assessmentsResponse.json();
      console.log('Assessments data:', assessmentsData);
      
      if (assessmentsData.success) {
        // Sort assessments: pending/in-progress first, then others by due date descending
        const sortedAssessments = (assessmentsData.data || []).sort((a, b) => {
          // Pending and in-progress assessments go to the top
          const aPriority = (a.status === 'pending' || a.status === 'in-progress') ? 0 : 1;
          const bPriority = (b.status === 'pending' || b.status === 'in-progress') ? 0 : 1;
          
          if (aPriority !== bPriority) {
            return aPriority - bPriority;
          }
          
          // Within same priority group, sort by due date descending
          return new Date(b.dueDate) - new Date(a.dueDate);
        });
        
        setAssessments(sortedAssessments);
      }
    } catch (error) {
      console.error('Error fetching course progress:', error);
    }
  };

  const handleCourseChange = (course) => {
    setSelectedCourse(course);
    const userStr = localStorage.getItem('user');
    const user = JSON.parse(userStr);
    const userId = user._id || user.id;
    setAttendanceProgress(null); // Reset while loading
    setAssessments([]); // Reset while loading
    fetchCourseProgress(userId, course);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'graded': return 'status-completed';
      case 'in-progress': return 'status-upcoming';
      case 'completed': return 'status-upcoming';
      case 'pending': return 'status-pending';
      case 'overdue': return 'status-cancelled';
      default: return '';
    }
  };

  const getStatusLabel = (status) => {
    if (status === 'in-progress') return 'Pending Review';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const handleMarkAsCompleted = async (assessmentId) => {
    try {
      setCompletingAssessment(assessmentId);
      const token = localStorage.getItem('token');
      const API_BASE_URL = 'http://localhost:3000/api';
      
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.COMPLETE_ASSESSMENT(assessmentId)}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Refresh assessments
        const userStr = localStorage.getItem('user');
        const user = JSON.parse(userStr);
        const userId = user._id || user.id;
        fetchCourseProgress(userId, selectedCourse);
      } else {
        alert('Failed to mark assessment as completed: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error marking assessment as completed:', error);
      alert('Failed to mark assessment as completed');
    } finally {
      setCompletingAssessment(null);
    }
  };

  const attendancePercentage = attendanceProgress ? 
    (attendanceProgress.totalHours / attendanceProgress.requiredHours * 100).toFixed(1) : 0;

  return (
    <div className="page-container">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate('/Dashboard')}>
          <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back to Dashboard
        </button>
        <h1>My Progress & Assessments</h1>
      </div>

      <div className="page-content">
        {loading ? (
          <div className="empty-state-page">
            <p>Loading...</p>
          </div>
        ) : courses.length === 0 ? (
          <div className="empty-state-page">
            <p>No enrolled courses found. Please enroll in a course first.</p>
            <button className="btn btn-primary" onClick={() => navigate('/Dashboard/course-registration')}>
              Enroll in a Course
            </button>
          </div>
        ) : (
          <>
            {/* Course Selector */}
            <div className="course-selector">
              <label htmlFor="course">Select Course:</label>
              <select 
                id="course"
                value={selectedCourse?._id || ''}
                onChange={(e) => {
                  const course = courses.find(c => c._id === e.target.value);
                  handleCourseChange(course);
                }}
              >
                {courses.map(course => (
                  <option key={course._id} value={course._id}>
                    {course.name || course.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Attendance Progress Section */}
            <div className="progress-section">
              <h2>Attendance & Hours Progress</h2>
              {attendanceProgress ? (
                <div className="progress-card">
                  <div className="progress-stats">
                    <div className="stat-item">
                      <span className="stat-label">Total Hours</span>
                      <span className="stat-value">{attendanceProgress.totalHours.toFixed(1)} / {attendanceProgress.requiredHours}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Sessions Attended</span>
                      <span className="stat-value">{attendanceProgress.attendedCount} / {attendanceProgress.totalBookings}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Completion</span>
                      <span className="stat-value">{attendancePercentage}%</span>
                    </div>
                  </div>
                  <div className="progress-bar-large">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${Math.min(attendancePercentage, 100)}%` }}
                    ></div>
                  </div>
                </div>
              ) : (
                <p className="empty-state">No attendance data available</p>
              )}
            </div>

            {/* Assessments Section */}
            <div className="progress-section">
              <h2>Assessments</h2>
              {assessments.length > 0 ? (
                <div className="list-container">
                  {assessments.map(assessment => (
                    <div key={assessment._id} className="list-item">
                      <div className="list-item-header">
                        <h3>{assessment.title}</h3>
                        <span className={`status-badge ${getStatusColor(assessment.status)}`}>
                          {getStatusLabel(assessment.status)}
                        </span>
                      </div>
                      <div className="list-item-details">
                        {assessment.description && (
                          <p className="assessment-description">{assessment.description}</p>
                        )}
                        <div className="detail-row">
                          <svg className="icon-small" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                            <line x1="16" y1="2" x2="16" y2="6"/>
                            <line x1="8" y1="2" x2="8" y2="6"/>
                            <line x1="3" y1="10" x2="21" y2="10"/>
                          </svg>
                          <span>Due: {new Date(assessment.dueDate).toLocaleDateString()}</span>
                        </div>
                        {assessment.completionDate && (
                          <div className="detail-row">
                            <svg className="icon-small" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                              <polyline points="22 4 12 14.01 9 11.01"/>
                            </svg>
                            <span>Completed: {new Date(assessment.completionDate).toLocaleDateString()}</span>
                          </div>
                        )}
                        {assessment.score !== null && (
                          <div className="detail-row score-row">
                            <svg className="icon-small" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                            </svg>
                            <span>Score: {assessment.score} / {assessment.maxScore} ({((assessment.score / assessment.maxScore) * 100).toFixed(1)}%)</span>
                          </div>
                        )}
                        {assessment.feedback && (
                          <div className="feedback-box">
                            <strong>Instructor Feedback:</strong>
                            <p>{assessment.feedback}</p>
                          </div>
                        )}
                        {assessment.assessmentUrl && assessment.status === 'pending' && (
                          <div className="list-item-actions">
                            <a 
                              href={assessment.assessmentUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="btn-primary"
                            >
                              Start Assessment
                            </a>
                            <button
                              onClick={() => handleMarkAsCompleted(assessment._id)}
                              disabled={completingAssessment === assessment._id}
                              className="btn-secondary"
                            >
                              {completingAssessment === assessment._id ? 'Submitting...' : 'Submit Assessment'}
                            </button>
                          </div>
                        )}
                        {assessment.assessmentUrl && (assessment.status === 'in-progress' || assessment.status === 'completed' || assessment.status === 'graded') && (
                          <div className="list-item-actions">
                            <a 
                              href={assessment.assessmentUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="btn-secondary"
                            >
                              View Assessment
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state-page">
                  <p>No assessments found for this course.</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Progress;
