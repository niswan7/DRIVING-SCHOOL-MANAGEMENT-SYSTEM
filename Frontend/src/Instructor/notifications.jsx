import React, { useState, useEffect } from 'react';
import { Bell, AlertCircle, Mail, Calendar, CreditCard } from 'lucide-react';
import { apiRequest, getCurrentUser } from '../utils/apiHelper';
import './Notifications.css';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState('');

  const fetchNotifications = async () => {
    const user = getCurrentUser();
    if (!user?._id) {
      setError("You must be logged in to see notifications.");
      return;
    }
    try {
      const response = await apiRequest(`/notifications/user/${user._id}`);
      setNotifications(response.notifications || []);
    } catch (err) {
      setError('Failed to fetch notifications: ' + err.message);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    // Optimistically update the UI
    setNotifications(notifications.map(notification =>
      notification._id === id ? { ...notification, read: true } : notification
    ));
    try {
      await apiRequest(`/notifications/${id}/read`, { method: 'PUT' });
      // No need to refetch, UI is already updated.
    } catch (err) {
      setError('Failed to mark as read: ' + err.message);
      // Optionally, revert the optimistic update on failure
      fetchNotifications();
    }
  };

  const getIconForType = (type) => {
    switch (type) {
      case 'lesson_booking':
      case 'lesson_reminder':
        return <Calendar size={24} />;
      case 'payment_received':
      case 'payout_processed':
        return <CreditCard size={24} />;
      case 'new_feedback':
        return <Mail size={24} />;
      case 'lesson_cancellation':
        return <AlertCircle size={24} />;
      default:
        return <Bell size={24} />;
    }
  };

  return (
    <div className="notifications-section">
      <div className="section-header">
        <h1 className="section-title">Notifications</h1>
        <p className="section-subtitle">
          View all your lesson reminders, alerts, and system messages.
        </p>
      </div>

      <div className="notifications-container">
        {error && <p className="error-message" style={{ textAlign: 'center' }}>{error}</p>}
        {notifications.length > 0 ? (
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
                  <span className="notification-date">{new Date(notification.createdAt).toLocaleDateString()}</span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="no-notifications-msg">
            <Bell size={40} />
            <p>You have no new notifications.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;