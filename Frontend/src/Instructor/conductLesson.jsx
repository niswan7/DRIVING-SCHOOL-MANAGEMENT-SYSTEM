import React, { useState } from 'react';
import { CheckCircle, XCircle, Slash, Calendar, User, Clock } from 'lucide-react';
import './ConductLessons.css';

const ConductLessons = () => {
  // Dummy data for scheduled lessons
  const [lessons, setLessons] = useState([
    { id: 1, date: '2025-10-15', time: '10:00 AM', student: 'Jane Smith', status: 'Scheduled' },
    { id: 2, date: '2025-10-16', time: '02:30 PM', student: 'Mike Johnson', status: 'Scheduled' },
    { id: 3, date: '2025-10-17', time: '09:00 AM', student: 'Sarah Lee', status: 'Scheduled' },
  ]);

  const handleCompleteLesson = (id) => {
    // Basic Path: Lesson marked as completed, attendance recorded
    setLessons(lessons.map(lesson =>
      lesson.id === id ? { ...lesson, status: 'Completed' } : lesson
    ));
    alert('Lesson marked as completed for ' + lessons.find(l => l.id === id).student);
    // In a real app, this would send an API request to the backend.
  };

  const handleMarkAsMissed = (id) => {
    // Exceptional Path: Student absent -> Lesson marked "Missed"
    setLessons(lessons.map(lesson =>
      lesson.id === id ? { ...lesson, status: 'Missed' } : lesson
    ));
    alert('Lesson marked as missed for ' + lessons.find(l => l.id === id).student);
  };
  
  const handleMarkAsCancelled = (id) => {
      // Exceptional Path: Instructor unavailable -> Lesson marked "Cancelled"
      setLessons(lessons.map(lesson =>
          lesson.id === id ? { ...lesson, status: 'Cancelled' } : lesson
      ));
      alert('Lesson marked as cancelled for ' + lessons.find(l => l.id === id).student);
  };

  return (
    <div className="conduct-lessons-section">
      <div className="section-header">
        <h1 className="section-title">Conduct Lessons</h1>
        <p className="section-subtitle">
          Select a scheduled lesson to mark its status and record attendance.
        </p>
      </div>

      <div className="lessons-list-card">
        <h2 className="card-title">Scheduled Lessons</h2>
        <ul className="lessons-list">
          {lessons.length > 0 ? (
            lessons.map(lesson => (
              <li key={lesson.id} className={`lesson-item lesson-status-${lesson.status.toLowerCase()}`}>
                <div className="lesson-details">
                  <p className="lesson-info">
                    <User size={16} /> <strong>Student:</strong> {lesson.student}
                  </p>
                  <p className="lesson-info">
                    <Calendar size={16} /> <strong>Date:</strong> {lesson.date}
                  </p>
                  <p className="lesson-info">
                    <Clock size={16} /> <strong>Time:</strong> {lesson.time}
                  </p>
                </div>
                <div className="lesson-actions">
                  {lesson.status === 'Scheduled' && (
                    <>
                      <button 
                        onClick={() => handleCompleteLesson(lesson.id)} 
                        className="action-btn complete-btn"
                        title="Mark as Completed"
                      >
                        <CheckCircle size={20} />
                      </button>
                      <button 
                        onClick={() => handleMarkAsMissed(lesson.id)} 
                        className="action-btn missed-btn"
                        title="Mark as Missed (Student Absent)"
                      >
                        <XCircle size={20} />
                      </button>
                      <button
                        onClick={() => handleMarkAsCancelled(lesson.id)}
                        className="action-btn cancel-btn"
                        title="Mark as Cancelled (Instructor Unavailable)"
                      >
                        <Slash size={20} />
                      </button>
                    </>
                  )}
                  {lesson.status !== 'Scheduled' && (
                      <span className={`status-badge ${lesson.status.toLowerCase()}`}>{lesson.status}</span>
                  )}
                </div>
              </li>
            ))
          ) : (
            <p className="no-lessons-msg">No lessons scheduled to conduct.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ConductLessons;
