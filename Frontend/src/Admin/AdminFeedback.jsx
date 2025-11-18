import React, { useState, useEffect } from 'react';
import { Star, Trash2, ArrowLeft } from 'lucide-react';
import { apiRequest } from '../utils/apiHelper';
import { API_ENDPOINTS } from '../config/api';
import './AdminFeedback.css';

const AdminFeedback = ({ navigate }) => {
    const [feedback, setFeedback] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchFeedback = async () => {
            setIsLoading(true);
            try {
                const response = await apiRequest(API_ENDPOINTS.FEEDBACK);
                setFeedback(response.data);
            } catch (err) {
                setError('Failed to load feedback.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchFeedback();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this feedback?')) {
            try {
                await apiRequest(API_ENDPOINTS.FEEDBACK_BY_ID(id), { method: 'DELETE' });
                setFeedback(feedback.filter(f => f._id !== id));
            } catch (err) {
                alert('Failed to delete feedback.');
            }
        }
    };

    const renderRatingStars = (rating) => {
        return Array(5).fill(0).map((_, i) => (
            <Star
                key={i}
                size={18}
                fill={i < rating ? '#ffc107' : 'none'}
                stroke={i < rating ? '#ffc107' : '#94a3b8'}
            />
        ));
    };

    return (
        <main className="manage-generic-container">
            <div className="manage-users-controls">
                <button className="btn-back" onClick={() => navigate('dashboard')}>
                    <ArrowLeft size={20} /> Back to Dashboard
                </button>
            </div>
            <div className="feedback-header">
                <h2>User Feedback</h2>
                <p>A centralized view of all feedback submitted by students.</p>
            </div>

            {isLoading && <div className="loading-message">Loading feedback...</div>}
            {error && <div className="error-message">{error}</div>}

            {!isLoading && !error && (
                <div className="feedback-list">
                    {feedback.length > 0 ? feedback.map(item => (
                        <div key={item._id} className="feedback-item-admin">
                            <div className="feedback-item-header">
                                <div className="feedback-author">
                                    <strong>
                                        {item.student?.firstName && item.student?.lastName
                                            ? `${item.student.firstName} ${item.student.lastName}`
                                            : item.student?.name || item.student?.email || 'Anonymous'}
                                    </strong>
                                    <span>on course: {item.course?.name || item.course?.title || 'N/A'}</span>
                                </div>
                                <div className="feedback-rating-admin">
                                    {renderRatingStars(item.rating)}
                                </div>
                            </div>
                            <p className="feedback-comment-admin">"{item.comment}"</p>
                            <div className="feedback-meta-admin">
                                <span>Instructor: {
                                    item.instructor?.firstName && item.instructor?.lastName
                                        ? `${item.instructor.firstName} ${item.instructor.lastName}`
                                        : item.instructor?.name || item.instructor?.email || 'N/A'
                                }</span>
                                <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                                <button onClick={() => handleDelete(item._id)} className="btn-delete-feedback">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    )) : <p className="loading-message">No feedback has been submitted yet.</p>}
                </div>
            )}
        </main>
    );
};

export default AdminFeedback;
