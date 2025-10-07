import React, { useState } from 'react';
import { PlusCircle, Edit, Trash2, Save, XCircle } from 'lucide-react';
import './ManageLessons.css';

const ManageLessons = () => {
  // Dummy data for lessons - in a real app, this would come from the backend
  const [lessons, setLessons] = useState([
    { id: 1, date: '2025-10-15', time: '10:00 AM', student: 'Jane Smith', status: 'Scheduled' },
    { id: 2, date: '2025-10-16', time: '02:30 PM', student: 'Mike Johnson', status: 'Scheduled' },
    { id: 3, date: '2025-10-17', time: '09:00 AM', student: 'Sarah Lee', status: 'Completed' },
  ]);

  const [form, setForm] = useState({
    date: '',
    time: '',
    student: '',
  });

  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(''); // Clear error on input change
  };

  const handleCreateLesson = (e) => {
    e.preventDefault();
    // Simple validation based on the use case's exceptional path
    if (!form.date || !form.time || !form.student) {
      setError('Invalid inputs: All fields are required.');
      return;
    }

    const newLesson = {
      id: lessons.length + 1,
      date: form.date,
      time: form.time,
      student: form.student,
      status: 'Scheduled',
    };

    setLessons([...lessons, newLesson]);
    setForm({ date: '', time: '', student: '' });
  };

  const handleEdit = (id) => {
    setEditingId(id);
    const lessonToEdit = lessons.find(lesson => lesson.id === id);
    if (lessonToEdit) {
      setForm({
        date: lessonToEdit.date,
        time: lessonToEdit.time,
        student: lessonToEdit.student,
      });
    }
  };

  const handleUpdateLesson = (e) => {
    e.preventDefault();
    if (!form.date || !form.time || !form.student) {
      setError('Invalid inputs: All fields are required.');
      return;
    }

    setLessons(lessons.map(lesson =>
      lesson.id === editingId
        ? { ...lesson, date: form.date, time: form.time, student: form.student }
        : lesson
    ));
    setEditingId(null);
    setForm({ date: '', time: '', student: '' });
  };

  const handleDeleteLesson = (id) => {
    if (window.confirm("Are you sure you want to delete this lesson?")) {
      setLessons(lessons.filter(lesson => lesson.id !== id));
    }
  };
  
  const handleCancelEdit = () => {
    setEditingId(null);
    setForm({ date: '', time: '', student: '' });
    setError('');
  };

  return (
    <div className="manage-lessons-section">
      <div className="section-header">
        <h1 className="section-title">Manage Lessons</h1>
        <p className="section-subtitle">
          Create, edit, and delete your scheduled lessons.
        </p>
      </div>

      <div className="card-container">
        <div className="manage-form-card">
          <h2 className="card-title">{editingId ? 'Edit Lesson' : 'Create New Lesson'}</h2>
          <form className="lesson-form" onSubmit={editingId ? handleUpdateLesson : handleCreateLesson}>
            <div className="form-row">
              <label>
                Date:
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Time:
                <input
                  type="time"
                  name="time"
                  value={form.time}
                  onChange={handleInputChange}
                  required
                />
              </label>
            </div>
            <label>
              Student Name:
              <input
                type="text"
                name="student"
                value={form.student}
                onChange={handleInputChange}
                placeholder="e.g., Jane Smith"
                required
              />
            </label>
            {error && <p className="error-message">{error}</p>}
            <div className="form-actions">
              {editingId ? (
                <>
                  <button type="submit" className="save-btn"><Save size={18} /> Update</button>
                  <button type="button" className="cancel-btn" onClick={handleCancelEdit}><XCircle size={18} /> Cancel</button>
                </>
              ) : (
                <button type="submit" className="create-btn"><PlusCircle size={18} /> Create Lesson</button>
              )}
            </div>
          </form>
        </div>

        <div className="manage-list-card">
          <h2 className="card-title">Scheduled Lessons</h2>
          <ul className="lesson-list">
            {lessons.length > 0 ? (
              lessons.map(lesson => (
                <li key={lesson.id} className={`lesson-item ${lesson.status.toLowerCase()}`}>
                  <div className="lesson-details">
                    <p className="lesson-info">
                      <strong>Student:</strong> {lesson.student}
                    </p>
                    <p className="lesson-info">
                      <strong>Date:</strong> {lesson.date}
                    </p>
                    <p className="lesson-info">
                      <strong>Time:</strong> {lesson.time}
                    </p>
                    <span className="lesson-status">{lesson.status}</span>
                  </div>
                  <div className="lesson-actions">
                    <button onClick={() => handleEdit(lesson.id)} className="edit-btn">
                      <Edit size={16} />
                    </button>
                    <button onClick={() => handleDeleteLesson(lesson.id)} className="delete-btn">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </li>
              ))
            ) : (
              <p className="no-lessons-msg">No lessons scheduled yet.</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ManageLessons;
