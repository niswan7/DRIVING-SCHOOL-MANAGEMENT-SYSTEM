import React, { useState, useEffect } from 'react';
import { User, Award, TrendingUp, CheckCircle } from 'lucide-react';
import { apiRequest } from '../utils/apiHelper';
import { API_ENDPOINTS } from '../config/api';
import './ManageStudentProgress.css';

const ManageStudentProgress = ({ instructorId }) => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentCourses, setStudentCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [completingCourse, setCompletingCourse] = useState(null);

  useEffect(() => {
    fetchInstructorStudents();
  }, [instructorId]);

  const fetchInstructorStudents = async () => {
    if (!instructorId) return;
    try {
      setLoading(true);
      const res = await apiRequest(API_ENDPOINTS.INSTRUCTOR_STUDENTS(instructorId));
      setStudents(res.data || []);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch students: ' + err.message);
      setLoading(false);
    }
  };

  const fetchStudentCourses = async (studentId) => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      const token = localStorage.getItem('token');
      const API_BASE_URL = 'http://localhost:3000/api';
      
      // Fetch student data to get completedCourses
      const studentResponse = await fetch(`${API_BASE_URL}${API_ENDPOINTS.USER_BY_ID(studentId)}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const studentData = await studentResponse.json();
      const completedCourses = studentData.data?.completedCourses || [];
      
      // Fetch enrolled courses using instructor-specific endpoint
      const enrolledResponse = await fetch(`${API_BASE_URL}${API_ENDPOINTS.INSTRUCTOR_STUDENT_COURSES(instructorId, studentId)}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const enrolledData = await enrolledResponse.json();
      
      if (enrolledData.success && enrolledData.data) {
        // For each course, fetch progress data
        const coursesWithProgress = await Promise.all(
          enrolledData.data.map(async (course) => {
            try {
              // Fetch bookings for this course
              const bookingsResponse = await fetch(`${API_BASE_URL}/bookings?studentId=${studentId}&courseId=${course._id}`, {
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              });
              
              const bookingsData = await bookingsResponse.json();
              
              let attendanceHours = 0;
              let totalBookings = 0;
              let attendedBookings = 0;
              
              if (bookingsData.success) {
                totalBookings = bookingsData.data.length;
                const completedBookings = bookingsData.data.filter(b => b.status === 'completed');
                attendedBookings = completedBookings.filter(b => b.attendance === 'attended').length;
                attendanceHours = completedBookings.reduce((sum, b) => sum + (b.duration || 60), 0) / 60;
              }
              
              // Fetch assessments for this course
              const assessmentsResponse = await fetch(`${API_BASE_URL}/assessments/student/${studentId}/course/${course._id}`, {
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              });
              
              const assessmentsData = await assessmentsResponse.json();
              
              let totalAssessments = 0;
              let gradedAssessments = 0;
              let averageScore = 0;
              
              if (assessmentsData.success && assessmentsData.data) {
                totalAssessments = assessmentsData.data.length;
                const graded = assessmentsData.data.filter(a => a.status === 'graded' && a.score !== null);
                gradedAssessments = graded.length;
                
                if (graded.length > 0) {
                  const totalScore = graded.reduce((sum, a) => {
                    const percentage = (a.score / a.maxScore) * 100;
                    return sum + percentage;
                  }, 0);
                  averageScore = totalScore / graded.length;
                }
              }
              
              const requiredHours = course.duration || course.totalHours || 20;
              const hoursPercentage = (attendanceHours / requiredHours) * 100;
              const assessmentPercentage = totalAssessments > 0 ? (gradedAssessments / totalAssessments) * 100 : 0;
              
              // Overall completion: 60% attendance + 40% assessments
              const completionPercentage = (hoursPercentage * 0.6) + (assessmentPercentage * 0.4);
              
              // Check if course is already marked as completed
              const isCompleted = completedCourses.some(c => c.courseId.toString() === course._id.toString());
              const completedInfo = completedCourses.find(c => c.courseId.toString() === course._id.toString());
              
              return {
                ...course,
                isCompleted,
                completedAt: completedInfo?.completedAt,
                progress: {
                  attendanceHours,
                  requiredHours,
                  totalBookings,
                  attendedBookings,
                  hoursPercentage: Math.min(hoursPercentage, 100),
                  totalAssessments,
                  gradedAssessments,
                  averageScore,
                  assessmentPercentage,
                  completionPercentage: Math.min(completionPercentage, 100)
                }
              };
            } catch (err) {
              console.error(`Error fetching progress for course ${course._id}:`, err);
              return {
                ...course,
                progress: {
                  attendanceHours: 0,
                  requiredHours: course.duration || 20,
                  totalBookings: 0,
                  attendedBookings: 0,
                  hoursPercentage: 0,
                  totalAssessments: 0,
                  gradedAssessments: 0,
                  averageScore: 0,
                  assessmentPercentage: 0,
                  completionPercentage: 0
                }
              };
            }
          })
        );
        
        // Sort by completion percentage (descending)
        const sortedCourses = coursesWithProgress.sort((a, b) => 
          b.progress.completionPercentage - a.progress.completionPercentage
        );
        
        setStudentCourses(sortedCourses);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching student courses:', err);
      setError('Failed to fetch student courses');
      setLoading(false);
    }
  };

  const handleSelectStudent = (student) => {
    setSelectedStudent(student);
    fetchStudentCourses(student._id);
  };

  const handleMarkCourseComplete = async (courseId, courseName) => {
    if (!confirm(`Mark "${courseName}" as completed for ${selectedStudent.name}?`)) {
      return;
    }

    try {
      setCompletingCourse(courseId);
      setError('');
      setSuccess('');
      
      const token = localStorage.getItem('token');
      const API_BASE_URL = 'http://localhost:3000/api';
      
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.COMPLETE_COURSE(selectedStudent._id)}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          courseId,
          instructorId 
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccess(`Course "${courseName}" marked as completed!`);
        // Refresh the course list
        await fetchStudentCourses(selectedStudent._id);
      } else {
        setError(data.message || 'Failed to mark course as complete');
      }
      
    } catch (err) {
      setError('Failed to mark course as complete: ' + err.message);
    } finally {
      setCompletingCourse(null);
    }
  };

  const getCompletionColor = (percentage) => {
    if (percentage >= 100) return 'completion-complete';
    if (percentage >= 75) return 'completion-high';
    if (percentage >= 50) return 'completion-medium';
    if (percentage >= 25) return 'completion-low';
    return 'completion-very-low';
  };

  return (
    <div className="manage-student-progress-section">
      <div className="section-header">
        <h1 className="section-title">Manage Student Progress</h1>
        <p className="section-subtitle">
          Monitor student course completion and performance
        </p>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="progress-container">
        {/* Student List */}
        <div className="student-list-card">
          <h2 className="card-title">
            <User size={20} />
            Select Student
          </h2>
          {loading && !selectedStudent && <p className="loading-message">Loading students...</p>}
          <ul className="student-list">
            {students.map(student => (
              <li
                key={student._id}
                className={`student-item ${selectedStudent?._id === student._id ? 'active' : ''}`}
                onClick={() => handleSelectStudent(student)}
              >
                <div className="user-icon"><User size={20} /></div>
                <div className="student-details">
                  <p className="student-name" spellCheck={false}>
                    {student.firstName && student.lastName 
                      ? `${student.firstName} ${student.lastName}`
                      : student.name || student.email}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Course Progress Details */}
        <div className="progress-details-card">
          {selectedStudent ? (
            <>
              <h2 className="card-title">
                <TrendingUp size={20} />
                {selectedStudent.firstName && selectedStudent.lastName 
                  ? `${selectedStudent.firstName} ${selectedStudent.lastName}'s Progress`
                  : `${selectedStudent.name || selectedStudent.email}'s Progress`}
              </h2>
              
              {loading ? (
                <p className="loading-message">Loading course progress...</p>
              ) : studentCourses.length > 0 ? (
                <div className="courses-list">
                  {studentCourses.map(course => (
                    <div key={course._id} className="course-progress-item">
                      <div className="course-header">
                        <h3>
                          {course.name || course.title}
                          {course.isCompleted && (
                            <span style={{ marginLeft: '10px', fontSize: '0.9rem', color: '#22c55e' }}>✓ Completed</span>
                          )}
                        </h3>
                        <span className={`completion-badge ${getCompletionColor(course.progress.completionPercentage)}`}>
                          {course.progress.completionPercentage.toFixed(1)}%
                        </span>
                      </div>
                      
                      <div className="progress-details">
                        <div className="progress-stat">
                          <span className="stat-label">Attendance Hours:</span>
                          <span className="stat-value">
                            {course.progress.attendanceHours.toFixed(1)} / {course.progress.requiredHours} hrs
                            ({course.progress.hoursPercentage.toFixed(1)}%)
                          </span>
                        </div>
                        
                        <div className="progress-stat">
                          <span className="stat-label">Sessions Attended:</span>
                          <span className="stat-value">
                            {course.progress.attendedBookings} / {course.progress.totalBookings}
                          </span>
                        </div>
                        
                        <div className="progress-stat">
                          <span className="stat-label">Assessments Graded:</span>
                          <span className="stat-value">
                            {course.progress.gradedAssessments} / {course.progress.totalAssessments}
                            {course.progress.averageScore > 0 && 
                              ` (Avg: ${course.progress.averageScore.toFixed(1)}%)`}
                          </span>
                        </div>
                      </div>
                      
                      <div className="progress-bar">
                        <div 
                          className={`progress-fill ${getCompletionColor(course.progress.completionPercentage)}`}
                          style={{ width: `${Math.min(course.progress.completionPercentage, 100)}%` }}
                        ></div>
                      </div>
                      
                      {course.isCompleted && course.completedAt && (
                        <div className="progress-stat" style={{ marginTop: '0.5rem', color: '#22c55e' }}>
                          <span className="stat-label">Completed on:</span>
                          <span className="stat-value">{new Date(course.completedAt).toLocaleDateString()}</span>
                        </div>
                      )}
                      
                      {course.progress.completionPercentage >= 100 && !course.isCompleted && (
                        <div className="course-actions">
                          <button
                            onClick={() => handleMarkCourseComplete(course._id, course.name || course.title)}
                            disabled={completingCourse === course._id}
                            className="btn-complete"
                          >
                            <CheckCircle size={18} />
                            {completingCourse === course._id ? 'Marking...' : 'Mark as Completed'}
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <Award size={48} />
                  <p>No enrolled courses found for this student.</p>
                </div>
              )}
            </>
          ) : (
            <div className="empty-state">
              <User size={48} />
              <p>Select a student to view their course progress</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageStudentProgress;
