import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { apiRequest } from '../utils/apiHelper';
import { API_ENDPOINTS } from '../config/api';
import './ManageAssessments.css';

const ManageAssessments = ({ instructorId }) => {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [gradingAssessment, setGradingAssessment] = useState(null);
  const [gradeForm, setGradeForm] = useState({
    score: '',
    feedback: ''
  });
  const [form, setForm] = useState({
    studentId: '',
    courseId: '',
    title: '',
    description: '',
    assessmentUrl: '',
    dueDate: '',
    maxScore: 100
  });

  useEffect(() => {
    if (instructorId) {
      fetchData();
    }
  }, [instructorId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [studentsRes, assessmentsRes, coursesRes] = await Promise.all([
        apiRequest(API_ENDPOINTS.INSTRUCTOR_STUDENTS(instructorId)),
        apiRequest(API_ENDPOINTS.ASSESSMENTS),
        apiRequest(API_ENDPOINTS.COURSES)
      ]);

      setStudents(studentsRes.data || []);
      setCourses(coursesRes.data || []);
      
      // Filter assessments created by this instructor
      const instructorAssessments = (assessmentsRes.data || []).filter(
        a => a.instructorId === instructorId || a.instructorId?._id === instructorId
      );
      setAssessments(instructorAssessments);
      
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch data: ' + err.message);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // If student selection changes, reset course selection
    if (name === 'studentId') {
      setForm({ ...form, [name]: value, courseId: '' });
    } else {
      setForm({ ...form, [name]: value });
    }
    
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.studentId || !form.courseId || !form.title || !form.dueDate) {
      setError('Student, course, title, and due date are required.');
      return;
    }

    try {
      const assessmentData = {
        studentId: form.studentId,
        instructorId: instructorId,
        courseId: form.courseId,
        title: form.title,
        description: form.description,
        assessmentUrl: form.assessmentUrl,
        dueDate: form.dueDate,
        maxScore: parseInt(form.maxScore) || 100,
        status: 'pending'
      };

      if (editingId) {
        await apiRequest(`${API_ENDPOINTS.ASSESSMENTS}/${editingId}`, {
          method: 'PUT',
          data: assessmentData
        });
        setSuccess('Assessment updated successfully!');
      } else {
        await apiRequest(API_ENDPOINTS.ASSESSMENTS, {
          method: 'POST',
          data: assessmentData
        });
        setSuccess('Assessment created successfully!');
      }

      fetchData();
      handleCancel();
    } catch (err) {
      setError('Failed to save assessment: ' + err.message);
    }
  };

  const handleEdit = (assessment) => {
    setEditingId(assessment._id);
    setForm({
      studentId: assessment.studentId?._id || assessment.studentId,
      courseId: assessment.courseId?._id || assessment.courseId || '',
      title: assessment.title,
      description: assessment.description || '',
      assessmentUrl: assessment.assessmentUrl || '',
      dueDate: assessment.dueDate ? new Date(assessment.dueDate).toISOString().split('T')[0] : '',
      maxScore: assessment.maxScore || 100
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this assessment?')) {
      return;
    }

    try {
      await apiRequest(`${API_ENDPOINTS.ASSESSMENTS}/${id}`, { method: 'DELETE' });
      setSuccess('Assessment deleted successfully!');
      fetchData();
    } catch (err) {
      setError('Failed to delete assessment: ' + err.message);
    }
  };

  const handleOpenGrading = (assessment) => {
    setGradingAssessment(assessment);
    setGradeForm({
      score: assessment.score || '',
      feedback: assessment.feedback || ''
    });
    setError('');
    setSuccess('');
  };

  const handleGradeInputChange = (e) => {
    const { name, value } = e.target;
    setGradeForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitGrade = async (e) => {
    e.preventDefault();
    if (!gradingAssessment) return;

    try {
      await apiRequest(API_ENDPOINTS.UPDATE_ASSESSMENT_SCORE(gradingAssessment._id), {
        method: 'PATCH',
        data: {
          score: parseInt(gradeForm.score),
          maxScore: gradingAssessment.maxScore || 100,
          feedback: gradeForm.feedback || ''
        }
      });
      setSuccess('Score updated successfully!');
      setGradingAssessment(null);
      setGradeForm({ score: '', feedback: '' });
      fetchData();
    } catch (err) {
      setError('Failed to update score: ' + err.message);
    }
  };

  const handleCancelGrading = () => {
    setGradingAssessment(null);
    setGradeForm({ score: '', feedback: '' });
    setError('');
    setSuccess('');
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setForm({
      studentId: '',
      courseId: '',
      title: '',
      description: '',
      assessmentUrl: '',
      dueDate: '',
      maxScore: 100
    });
    setError('');
    setSuccess('');
  };

  const getStudentName = (student) => {
    if (!student) return 'N/A';
    if (typeof student === 'string') return 'Loading...';
    if (student.name) return student.name;
    if (student.firstName && student.lastName) {
      return `${student.firstName} ${student.lastName}`;
    }
    if (student.firstName) return student.firstName;
    if (student.email) return student.email;
    return 'N/A';
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'graded': return 'status-completed';
      case 'in-progress': return 'status-in-progress';
      case 'completed': return 'status-in-progress';
      case 'pending': return 'status-pending';
      case 'overdue': return 'status-overdue';
      default: return '';
    }
  };

  // Get filtered courses based on selected student's enrolled courses
  const getAvailableCourses = () => {
    if (!form.studentId) {
      return [];
    }
    
    const selectedStudent = students.find(s => s._id === form.studentId);
    if (!selectedStudent || !selectedStudent.enrolledCourses || selectedStudent.enrolledCourses.length === 0) {
      return [];
    }
    
    // Filter courses that the student has enrolled in
    const enrolledCourseIds = selectedStudent.enrolledCourses.map(courseId => 
      typeof courseId === 'object' ? courseId._id : courseId
    );
    
    return courses.filter(course => 
      enrolledCourseIds.some(id => id.toString() === course._id.toString())
    );
  };

  return (
    <div className="manage-assessments-section">
      <div className="section-header">
        <h1 className="section-title">Manage Assessments</h1>
        <p className="section-subtitle">Create and manage assessments for your students</p>
      </div>

      {error && <div className="message error-message">{error}</div>}
      {success && <div className="message success-message">{success}</div>}

      {!showForm && !gradingAssessment && (
        <button className="btn-create" onClick={() => setShowForm(true)}>
          <Plus size={20} /> Create New Assessment
        </button>
      )}

      {gradingAssessment && (
        <div className="assessment-form-card grading-form">
          <h2 className="card-title">Grade Assessment</h2>
          <div className="grading-info">
            <p><strong>Assessment:</strong> {gradingAssessment.title}</p>
            <p><strong>Student:</strong> {getStudentName(gradingAssessment.studentId)}</p>
            <p><strong>Max Score:</strong> {gradingAssessment.maxScore}</p>
            {gradingAssessment.completionDate && (
              <p><strong>Submitted:</strong> {new Date(gradingAssessment.completionDate).toLocaleDateString()}</p>
            )}
            {gradingAssessment.assessmentUrl && (
              <p>
                <a 
                  href={gradingAssessment.assessmentUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="assessment-link"
                >
                  View Assessment →
                </a>
              </p>
            )}
          </div>
          <form onSubmit={handleSubmitGrade} className="assessment-form">
            <div className="form-group">
              <label>Score (out of {gradingAssessment.maxScore}) *</label>
              <input
                type="number"
                name="score"
                value={gradeForm.score}
                onChange={handleGradeInputChange}
                min="0"
                max={gradingAssessment.maxScore}
                required
                placeholder="Enter score"
              />
            </div>
            <div className="form-group">
              <label>Feedback</label>
              <textarea
                name="feedback"
                value={gradeForm.feedback}
                onChange={handleGradeInputChange}
                rows="4"
                placeholder="Enter feedback for the student (optional)"
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-save">
                <Save size={18} /> Submit Grade
              </button>
              <button type="button" className="btn-cancel" onClick={handleCancelGrading}>
                <X size={18} /> Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {showForm && (
        <div className="assessment-form-card">
          <h2 className="card-title">{editingId ? 'Edit Assessment' : 'Create New Assessment'}</h2>
          <form onSubmit={handleSubmit} className="assessment-form">
            <div className="form-row">
              <div className="form-group">
                <label>Student *</label>
                <select
                  name="studentId"
                  value={form.studentId}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select a student</option>
                  {students.map(student => (
                    <option key={student._id} value={student._id}>
                      {getStudentName(student)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Course *</label>
                <select
                  name="courseId"
                  value={form.courseId}
                  onChange={handleInputChange}
                  required
                  disabled={!form.studentId}
                >
                  <option value="">
                    {!form.studentId ? 'Select a student first' : 'Select a course'}
                  </option>
                  {getAvailableCourses().map(course => (
                    <option key={course._id} value={course._id}>
                      {course.name || course.title}
                    </option>
                  ))}
                </select>
                {form.studentId && getAvailableCourses().length === 0 && (
                  <small style={{ color: '#ff6b6b', marginTop: '0.25rem', display: 'block' }}>
                    This student has not enrolled in any courses yet
                  </small>
                )}
              </div>
            </div>

            <div className="form-group">
              <label>Title *</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleInputChange}
                placeholder="e.g., Theory Test - Traffic Rules"
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleInputChange}
                placeholder="Describe the assessment..."
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>Assessment URL</label>
              <input
                type="url"
                name="assessmentUrl"
                value={form.assessmentUrl}
                onChange={handleInputChange}
                placeholder="https://forms.google.com/..."
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Due Date *</label>
                <input
                  type="date"
                  name="dueDate"
                  value={form.dueDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Max Score</label>
                <input
                  type="number"
                  name="maxScore"
                  value={form.maxScore}
                  onChange={handleInputChange}
                  min="1"
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-save">
                <Save size={18} /> {editingId ? 'Update' : 'Create'}
              </button>
              <button type="button" className="btn-cancel" onClick={handleCancel}>
                <X size={18} /> Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="assessments-list-card">
        <h2 className="card-title">All Assessments</h2>
        {loading ? (
          <p className="empty-message">Loading...</p>
        ) : assessments.length > 0 ? (
          <div className="assessments-list">
            {assessments
              .sort((a, b) => {
                // Pending and in-progress assessments first
                const priorityA = (a.status === 'pending' || a.status === 'in-progress') ? 0 : 1;
                const priorityB = (b.status === 'pending' || b.status === 'in-progress') ? 0 : 1;
                
                if (priorityA !== priorityB) {
                  return priorityA - priorityB;
                }
                
                // Then sort by due date descending (newest first)
                return new Date(b.dueDate) - new Date(a.dueDate);
              })
              .map(assessment => (
              <div key={assessment._id} className="assessment-item">
                <div className="assessment-header">
                  <h3>{assessment.title}</h3>
                  <span className={`status-badge ${getStatusColor(assessment.status)}`}>
                    {assessment.status}
                  </span>
                </div>
                <div className="assessment-details">
                  <p><strong>Student:</strong> {getStudentName(assessment.studentId)}</p>
                  {assessment.courseId && (
                    <p><strong>Course:</strong> {assessment.courseId.name || assessment.courseId.title || 'N/A'}</p>
                  )}
                  {assessment.description && <p><strong>Description:</strong> {assessment.description}</p>}
                  <p><strong>Due Date:</strong> {new Date(assessment.dueDate).toLocaleDateString()}</p>
                  {assessment.completionDate && (
                    <p><strong>Completed:</strong> {new Date(assessment.completionDate).toLocaleDateString()}</p>
                  )}
                  {assessment.score !== null && assessment.score !== undefined && (
                    <p className="score-info">
                      <strong>Score:</strong> {assessment.score} / {assessment.maxScore} ({((assessment.score / assessment.maxScore) * 100).toFixed(1)}%)
                    </p>
                  )}
                  {assessment.feedback && (
                    <p><strong>Feedback:</strong> {assessment.feedback}</p>
                  )}
                </div>
                <div className="assessment-actions">
                  {((assessment.status === 'in-progress' || assessment.status === 'completed') && !assessment.score && assessment.score !== 0) && (
                    <button 
                      className="btn-score" 
                      onClick={() => handleOpenGrading(assessment)}
                      title="Grade Assessment"
                    >
                      Grade
                    </button>
                  )}
                  {assessment.status === 'pending' && (
                    <>
                      <button 
                        className="btn-edit" 
                        onClick={() => handleEdit(assessment)}
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        className="btn-delete" 
                        onClick={() => handleDelete(assessment._id)}
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="empty-message">No assessments created yet.</p>
        )}
      </div>
    </div>
  );
};

export default ManageAssessments;
