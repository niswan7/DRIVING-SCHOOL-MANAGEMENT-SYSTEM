import React, { useState, useEffect } from 'react';
import { PlusCircle, Edit, Trash2, Save, XCircle } from 'lucide-react';
import { apiRequest } from '../utils/apiHelper';
import { API_ENDPOINTS } from '../config/api';
import './ManageLessons.css';

const ManageLessons = ({ instructorId }) => {
  const [lessons, setLessons] = useState([]);
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({
    date: '',
    time: '',
    student: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  const fetchLessons = async () => {
    if (!instructorId) return;
    try {
      const res = await apiRequest(API_ENDPOINTS.INSTRUCTOR_LESSONS(instructorId));
      setLessons(res.data || []);
    } catch (err) {
      setError('Failed to fetch lessons: ' + err.message);
    }
  };

  const fetchStudents = async () => {
    if (!instructorId) return;
    try {
      const response = await apiRequest(API_ENDPOINTS.INSTRUCTOR_STUDENTS(instructorId));
      setStudents(response.data || []);
    } catch (err) {
      setError('Failed to fetch students: ' + err.message);
    }
  };

  useEffect(() => {
    if (instructorId) {
      fetchLessons();
      fetchStudents();
    }
  }, [instructorId]);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleCreateLesson = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.date || !form.time || !form.student) {
      setError('All fields are required.');
      return;
    }

    try {
      const newLessonData = {
        ...form,
        instructor: instructorId,
        status: 'Scheduled',
      };
      const result = await apiRequest('/lessons', {
        method: 'POST',
        data: newLessonData,
      });
      setLessons([...lessons, result.data]);
      setForm({ date: '', time: '', student: '' });
    } catch (err) {
      setError('Failed to create lesson: ' + err.message);
    }
  };

  const handleEdit = (lesson) => {
    setEditingId(lesson._id);
    setForm({
      date: new Date(lesson.date).toISOString().split('T')[0],
      time: lesson.time,
      student: lesson.student._id, // Assuming student is populated with at least _id
    });
  };

  const handleUpdateLesson = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.date || !form.time || !form.student) {
      setError('All fields are required.');
      return;
    }

    try {
      const updatedData = { ...form, instructor: instructorId };
      const result = await apiRequest(`/lessons/${editingId}`, {
        method: 'PUT',
        data: updatedData,
      });
      setLessons(lessons.map(lesson => (lesson._id === editingId ? result.data : lesson)));
      handleCancelEdit();
    } catch (err) {
      setError('Failed to update lesson: ' + err.message);
    }
  };

  const handleDeleteLesson = async (id) => {
    if (window.confirm("Are you sure you want to delete this lesson?")) {
      try {
        await apiRequest(`/lessons/${id}`, { method: 'DELETE' });
        setLessons(lessons.filter(lesson => lesson._id !== id));
      } catch (err) {
        setError('Failed to delete lesson: ' + err.message);
      }
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
              <select
                name="student"
                value={form.student}
                onChange={handleInputChange}
                required
              >
                <option value="">Select a Student</option>
                {students.map(student => (
                  <option key={student._id} value={student._id}>
                    {student.name}
                  </option>
                ))}
              </select>
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
                <li key={lesson._id} className={`lesson-item ${lesson.status.toLowerCase()}`}>
                  <div className="lesson-details">
                    <p className="lesson-info">
                      <strong>Student:</strong> {lesson.student?.name || 'N/A'}
                    </p>
                    <p className="lesson-info">
                      <strong>Date:</strong> {new Date(lesson.date).toLocaleDateString()}
                    </p>
                    <p className="lesson-info">
                      <strong>Time:</strong> {lesson.time}
                    </p>
                    <span className="lesson-status">{lesson.status}</span>
                  </div>
                  <div className="lesson-actions">
                    <button onClick={() => handleEdit(lesson)} className="edit-btn">
                      <Edit size={16} />
                    </button>
                    <button onClick={() => handleDeleteLesson(lesson._id)} className="delete-btn">
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
