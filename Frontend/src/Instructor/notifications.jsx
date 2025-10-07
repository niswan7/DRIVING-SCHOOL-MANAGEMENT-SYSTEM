
import React, { useState } from 'react';
import { Bell, AlertCircle, Mail, Calendar, CreditCard } from 'lucide-react';
import './Notifications.css';

const Notifications = () => {
  // Dummy data to simulate notifications from the backend
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'lesson',
      title: 'Lesson Reminder',
      message: 'Your lesson with Jane Smith is tomorrow at 10:00 AM.',
      date: '2025-10-19',
      read: false,
    },
    {
      id: 2,
      type: 'payment',
      title: 'Payment Alert',
      message: 'Your monthly payout is ready for processing.',
      date: '2025-10-18',
      read: false,
    },
    {
      id: 3,
      type: 'feedback',
      title: 'New Feedback',
      message: 'You have new feedback from a student on your recent lesson.',
      date: '2025-10-18',
      read: true,
    },
    {
      id: 4,
      type: 'cancellation',
      title: 'Lesson Cancelled',
      message: 'Mike Johnson cancelled his lesson scheduled for today at 2:30 PM.',
      date: '2025-10-17',
      read: true,
    },
  ]);

  const handleMarkAsRead = (id) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const getIconForType = (type) => {
    switch (type) {
      case 'lesson':
        return <Calendar size={24} />;
      case 'payment':
        return <CreditCard size={24} />;
      case 'feedback':
        return <Mail size={24} />;
      case 'cancellation':
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
        {notifications.length > 0 ? (
          <ul className="notification-list">
            {notifications.map(notification => (
              <li
                key={notification.id}
                className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                onClick={() => handleMarkAsRead(notification.id)}
              >
                <div className="notification-icon-container">
                  {getIconForType(notification.type)}
                </div>
                <div className="notification-content">
                  <h3 className="notification-title">{notification.title}</h3>
                  <p className="notification-message">{notification.message}</p>
                  <span className="notification-date">{notification.date}</span>
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