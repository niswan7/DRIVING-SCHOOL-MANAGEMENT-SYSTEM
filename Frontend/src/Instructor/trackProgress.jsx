import React, { useState, useEffect } from 'react';
import { User, Clipboard, TrendingUp, AlertCircle, Eye } from 'lucide-react';
import { apiRequest } from '../utils/apiHelper';
import { API_ENDPOINTS } from '../config/api';
import './TrackProgress.css';

const TrackProgress = ({ instructorId }) => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [progressRecord, setProgressRecord] = useState(null);
  const [form, setForm] = useState({
    notes: '',
    performanceScore: '',
    status: 'On Track',
  });
  const [error, setError] = useState('');

  const fetchInstructorStudents = async () => {
    if (!instructorId) return;
    try {
      const res = await apiRequest(API_ENDPOINTS.INSTRUCTOR_STUDENTS(instructorId));
      setStudents(res.data || []);
    } catch (err) {
      setError('Failed to fetch students: ' + err.message);
    }
  };

  useEffect(() => {
    fetchInstructorStudents();
  }, [instructorId]);

  const handleSelectStudent = async (student) => {
    setSelectedStudent(student);
    setError('');
    try {
      // Fetch the latest progress record for this student
      const res = await apiRequest(`/progress/student/${student._id}`);
      if (res.data && res.data.length > 0) {
        // Assuming we work with the latest progress record
        const latestProgress = res.data[0];
        setProgressRecord(latestProgress);
        setForm({
          notes: latestProgress.notes || '',
          performanceScore: latestProgress.performanceScore || '',
          status: latestProgress.status || 'On Track',
        });
      } else {
        setProgressRecord(null); // No existing progress record
        setForm({ notes: '', performanceScore: '', status: 'On Track' });
      }
    } catch (err) {
      setError(`Failed to fetch progress for ${student.name}: ${err.message}`);
      setProgressRecord(null);
    }
  };

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdateProgress = async (e) => {
    e.preventDefault();
    if (!selectedStudent) {
      setError('Please select a student to update.');
      return;
    }
    setError('');

    const progressData = {
      ...form,
      student: selectedStudent._id,
      instructor: instructorId,
      // Assuming lesson is linked elsewhere or not required for this specific update
    };

    try {
      let updatedRecord;
      if (progressRecord) {
        // Update existing progress record
        const res = await apiRequest(`/progress/${progressRecord._id}`, {
          method: 'PUT',
          data: progressData,
        });
        updatedRecord = res.data;
      } else {
        // Create new progress record
        const res = await apiRequest('/progress', {
          method: 'POST',
          data: progressData,
        });
        updatedRecord = res.data;
      }
      setProgressRecord(updatedRecord);
      alert(`Progress for ${selectedStudent.name} updated successfully!`);
    } catch (err) {
      setError(`Failed to update progress: ${err.message}`);
    }
  };

  const handleReviewHistory = () => {
    if (selectedStudent) {
      // In a real app, this would open a modal or navigate to a new page
      // showing a list of all progress records for the student.
      alert(`Functionality to show detailed history for ${selectedStudent.name} is not yet implemented.`);
    } else {
      alert('Please select a student to review their history.');
    }
  };

  return (
    <div className="track-progress-section">
      <div className="section-header">
        <h1 className="section-title">Track Student Progress</h1>
        <p className="section-subtitle">
          Monitor and update student performance and course completion.
        </p>
      </div>

      <div className="progress-container">
        <div className="student-list-card">
          <h2 className="card-title">Select a Student</h2>
          {error && !selectedStudent && <p className="error-message">{error}</p>}
          <ul className="student-list">
            {students.map(student => (
              <li
                key={student._id}
                className={`student-item ${selectedStudent?._id === student._id ? 'active' : ''}`}
                onClick={() => handleSelectStudent(student)}
              >
                <div className="user-icon"><User size={20} /></div>
                <div className="student-details">
                  <p className="student-name">{student.name}</p>
                  {/* Progress value could be fetched and displayed here if needed */}
                </div>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="progress-details-card">
          <h2 className="card-title">
            {selectedStudent ? `Update Progress for ${selectedStudent.name}` : 'Student Progress Details'}
          </h2>
          {selectedStudent ? (
            <form onSubmit={handleUpdateProgress} className="progress-form">
              <div className="form-group">
                <label>
                  Performance Score:
                  <input
                    type="number"
                    name="performanceScore"
                    value={form.performanceScore}
                    onChange={handleInputChange}
                    placeholder="e.g., 85"
                  />
                </label>
              </div>
              <div className="form-group">
                <label>
                  Status:
                  <select name="status" value={form.status} onChange={handleInputChange}>
                    <option value="On Track">On Track</option>
                    <option value="Behind Schedule">Behind Schedule</option>
                    <option value="Needs Improvement">Needs Improvement</option>
                    <option value="Completed">Completed</option>
                  </select>
                </label>
              </div>
              <div className="form-group">
                <label>
                  Notes / Feedback:
                  <textarea
                    name="notes"
                    value={form.notes}
                    onChange={handleInputChange}
                    placeholder="Add notes about the student's performance..."
                  />
                </label>
              </div>
              <div className="form-actions">
                <button type="submit" className="update-btn"><Clipboard size={18} /> {progressRecord ? 'Update' : 'Create'} Progress</button>
                <button type="button" onClick={handleReviewHistory} className="history-btn"><Eye size={18} /> Review History</button>
              </div>
              {error && <p className="error-message"><AlertCircle size={16} /> {error}</p>}
            </form>
          ) : (
            <p className="instruction-message">
              Please select a student from the list to view and update their progress.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrackProgress;
