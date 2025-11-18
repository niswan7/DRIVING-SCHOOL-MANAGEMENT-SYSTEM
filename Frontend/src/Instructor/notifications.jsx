import React, { useState, useEffect } from 'react';
import { Bell, AlertCircle, Mail, Calendar, CreditCard, Award } from 'lucide-react';
import { apiRequest } from '../utils/apiHelper';
import { API_ENDPOINTS } from '../config/api';
import './Notifications.css';

const Notifications = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    if (!userId) {
      setError("User ID not provided.");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const response = await apiRequest(API_ENDPOINTS.USER_NOTIFICATIONS(userId));
      setNotifications(response.data || []);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch notifications: ' + err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [userId]);

  const handleMarkAsRead = async (id) => {
    // Optimistically update the UI
    setNotifications(notifications.map(notification =>
      notification._id === id ? { ...notification, read: true } : notification
    ));
    try {
      await apiRequest(API_ENDPOINTS.MARK_AS_READ(id), { method: 'PUT' });
    } catch (err) {
      setError('Failed to mark as read: ' + err.message);
      // Revert the optimistic update on failure
      fetchNotifications();
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await apiRequest(API_ENDPOINTS.MARK_ALL_READ(userId), { method: 'PUT' });
      setNotifications([]);
    } catch (err) {
      setError('Failed to mark all as read: ' + err.message);
    }
  };

  const getIconForType = (type) => {
    switch (type) {
      case 'lesson_booking':
      case 'lesson_reminder':
      case 'booking':
        return <Calendar size={24} />;
      case 'payment_received':
      case 'payout_processed':
      case 'payment':
        return <CreditCard size={24} />;
      case 'new_feedback':
      case 'feedback':
        return <Mail size={24} />;
      case 'lesson_cancellation':
      case 'cancellation':
        return <AlertCircle size={24} />;
      case 'achievement':
      case 'completion':
        return <Award size={24} />;
      default:
        return <Bell size={24} />;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="notifications-section">
      <div className="section-header">
        <h1 className="section-title">Notifications</h1>
        <p className="section-subtitle">
          View all your lesson reminders, alerts, and system messages.
        </p>
        {unreadCount > 0 && (
          <button className="mark-all-read-btn" onClick={handleMarkAllAsRead}>
            Mark all as read
          </button>
        )}
      </div>

      <div className="notifications-container">
        {error && <p className="error-message" style={{ textAlign: 'center' }}>{error}</p>}
        {loading ? (
          <div className="no-notifications-msg">
            <p>Loading notifications...</p>
          </div>
        ) : notifications.length > 0 ? (
          <ul className="notification-list">
            {notifications.map(notification => (
              <li
                key={notification._id}
                className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                onClick={() => !notification.read && handleMarkAsRead(notification._id)}
              >
                <div className="notification-icon-container">
                  {getIconForType(notification.type)}
                </div>
                <div className="notification-content">
                  <h3 className="notification-title">{notification.title}</h3>
                  <p className="notification-message">{notification.message}</p>
                  <span className="notification-date">
                    {new Date(notification.createdAt).toLocaleString()}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="no-notifications-msg">
            <Bell size={40} />
            <p>You have no notifications.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;