import React, { useState } from 'react';
import { User, Clipboard, TrendingUp, AlertCircle, Eye } from 'lucide-react';
import './TrackProgress.css';

const TrackProgress = () => {
  // Dummy data for students - in a real app, this would be fetched from the backend.
  const [students, setStudents] = useState([
    { id: 1, name: 'Jane Smith', progress: 75, lastLesson: '2025-10-17', assessments: [{ type: 'Theory Test', score: 85 }], history: '...historical data...' },
    { id: 2, name: 'Mike Johnson', progress: 50, lastLesson: '2025-10-16', assessments: [{ type: 'Driving Skills', score: 60 }], history: '...historical data...' },
    { id: 3, name: 'Sarah Lee', progress: 90, lastLesson: '2025-10-15', assessments: [{ type: 'Final Exam', score: 95 }], history: '...historical data...' },
  ]);

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [updatedProgress, setUpdatedProgress] = useState({
    progress: '',
    performanceScore: '',
    completionPercentage: '',
  });
  const [error, setError] = useState('');

  const handleSelectStudent = (student) => {
    setSelectedStudent(student);
    setUpdatedProgress({
      progress: student.progress,
      performanceScore: '', // Assuming performance score is a new input
      completionPercentage: student.progress, // Using progress as completion % for this example
    });
    setError('');
  };

  const handleInputChange = (e) => {
    setUpdatedProgress({ ...updatedProgress, [e.target.name]: e.target.value });
  };

  const handleUpdateProgress = (e) => {
    e.preventDefault();
    if (!selectedStudent) {
      setError('Please select a student to update.');
      return;
    }
    
    // In a real application, this would be an API call to update the student's progress.
    // Exceptional Path: Handle a potential service/data unavailability error.
    try {
      // Simulate API call and update the student's data
      const updatedStudents = students.map(student =>
        student.id === selectedStudent.id ? { ...student, progress: updatedProgress.completionPercentage } : student
      );
      setStudents(updatedStudents);
      alert(`Progress for ${selectedStudent.name} updated successfully!`);
      setSelectedStudent(null);
      setUpdatedProgress({ progress: '', performanceScore: '', completionPercentage: '' });
    } catch (e) {
      setError('Progress service unavailable. Update queued or error shown.');
    }
  };

  const handleReviewHistory = () => {
    // Alternative Path: Review historical progress records.
    if (selectedStudent) {
      alert(`Reviewing historical progress for ${selectedStudent.name}:\n\n${selectedStudent.history}`);
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
          <ul className="student-list">
            {students.map(student => (
              <li 
                key={student.id} 
                className={`student-item ${selectedStudent?.id === student.id ? 'active' : ''}`}
                onClick={() => handleSelectStudent(student)}
              >
                <div className="user-icon"><User size={20} /></div>
                <div className="student-details">
                  <p className="student-name">{student.name}</p>
                  <p className="progress-value">{student.progress}% Completed</p>
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
                    value={updatedProgress.performanceScore}
                    onChange={handleInputChange}
                    placeholder="e.g., 85"
                  />
                </label>
              </div>
              <div className="form-group">
                <label>
                  Completion Percentage:
                  <input
                    type="number"
                    name="completionPercentage"
                    value={updatedProgress.completionPercentage}
                    onChange={handleInputChange}
                    min="0"
                    max="100"
                    required
                  />
                </label>
              </div>
              <div className="progress-chart-placeholder">
                  <p>Lesson Outcome Chart Placeholder</p>
                  <div className="chart-bar" style={{ width: `${selectedStudent.progress}%` }}></div>
              </div>
              <div className="form-actions">
                <button type="submit" className="update-btn"><Clipboard size={18} /> Update Progress</button>
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
