import React, { useState, useEffect } from 'react';
import { Bell, Send, Trash2, ArrowLeft } from 'lucide-react';
import { apiRequest } from '../utils/apiHelper';
import { API_ENDPOINTS } from '../config/api';
import './AdminNotifications.css';

const AdminNotifications = ({ navigate }) => {
    const [notifications, setNotifications] = useState([]);
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [recipient, setRecipient] = useState('all'); // 'all', 'students', 'instructors'
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [formError, setFormError] = useState('');

    const fetchNotifications = async () => {
        setIsLoading(true);
        try {
            // Assuming there's an endpoint to get all notifications for admin
            const response = await apiRequest(API_ENDPOINTS.NOTIFICATIONS);
            setNotifications(response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        } catch (err) {
            setError('Failed to load notifications.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || !message) {
            setFormError('Title and message are required.');
            return;
        }
        setFormError('');
        try {
            const response = await apiRequest(API_ENDPOINTS.NOTIFICATIONS, {
                method: 'POST',
                data: { title, message, recipient }, // Send recipient type
            });
            setNotifications([response.data, ...notifications]);
            setTitle('');
            setMessage('');
            setRecipient('all');
            alert('Notification sent successfully!');
        } catch (err) {
            setFormError('Failed to send notification.');
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this notification?')) {
            try {
                await apiRequest(API_ENDPOINTS.NOTIFICATION_BY_ID(id), { method: 'DELETE' });
                setNotifications(notifications.filter(n => n._id !== id));
            } catch (err) {
                alert('Failed to delete notification.');
            }
        }
    };

    return (
        <main className="manage-generic-container">
            <div className="manage-users-controls">
                <button className="btn-back" onClick={() => navigate('dashboard')}>
                    <ArrowLeft size={20} /> Back to Dashboard
                </button>
            </div>
            <div className="notifications-container-admin">
                <div className="notification-form-section">
                    <h3><Bell size={22} /> Create System-Wide Notification</h3>
                    <form onSubmit={handleSubmit} className="notification-form-admin">
                        <div className="form-group-admin">
                            <input
                                type="text"
                                placeholder="Notification Title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group-admin">
                            <textarea
                                placeholder="Notification Message..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group-admin">
                            <label htmlFor="recipient">Send To:</label>
                            <select
                                id="recipient"
                                value={recipient}
                                onChange={(e) => setRecipient(e.target.value)}
                                style={{ padding: '10px', fontSize: '14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                            >
                                <option value="all">All Users</option>
                                <option value="students">Students Only</option>
                                <option value="instructors">Instructors Only</option>
                            </select>
                        </div>
                        {formError && <p className="error-message form-error">{formError}</p>}
                        <button type="submit" className="btn-send-notification">
                            <Send size={18} /> Send Notification
                        </button>
                    </form>
                </div>

                <div className="sent-notifications-section">
                    <h3>Previously Sent</h3>
                    {isLoading && <div className="loading-message">Loading...</div>}
                    {error && <div className="error-message">{error}</div>}
                    {!isLoading && !error && (
                        <div className="sent-notifications-list">
                            {notifications.length > 0 ? notifications.map(notif => (
                                <div key={notif._id} className="sent-notification-item">
                                    <div className="sent-notification-header">
                                        <strong className="sent-notification-title">{notif.title}</strong>
                                        <span className="sent-notification-date">
                                            {new Date(notif.createdAt).toLocaleString()}
                                        </span>
                                    </div>
                                    <p className="sent-notification-message">{notif.message}</p>
                                    <button onClick={() => handleDelete(notif._id)} className="btn-delete-notification">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            )) : <p className="loading-message">No notifications sent yet.</p>}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
};

export default AdminNotifications;
