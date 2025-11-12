/**
 * Notification Service
 * Business logic for notification operations
 */
class NotificationService {
    constructor(notificationModel, userModel) {
        this.notificationModel = notificationModel;
        this.userModel = userModel;
    }

    /**
     * Create notification
     * @param {Object} notificationData - Notification data
     * @returns {Promise<Object>} Created notification
     */
    async createNotification(notificationData) {
        const { recipient, title, message, type } = notificationData;
        
        // If recipient is 'all', 'students', or 'instructors', create for multiple users
        if (['all', 'students', 'instructors'].includes(recipient)) {
            let users;
            if (recipient === 'all') {
                users = await this.userModel.findAll({});
            } else if (recipient === 'students') {
                users = await this.userModel.findAll({ role: 'student' });
            } else if (recipient === 'instructors') {
                users = await this.userModel.findAll({ role: 'instructor' });
            }
            
            // Create notifications for all users
            const notifications = await Promise.all(
                users.map(user => 
                    this.notificationModel.create({
                        userId: user._id,
                        title,
                        message,
                        type: type || 'info'
                    })
                )
            );
            
            // Return the first notification as a representative
            return notifications[0] || { title, message, recipient, createdAt: new Date() };
        }
        
        // Single user notification
        return await this.notificationModel.create(notificationData);
    }

    /**
     * Get user notifications
     * @param {String} userId - User ID
     * @param {Boolean} unreadOnly - Get only unread notifications
     * @returns {Promise<Array>} Array of notifications
     */
    async getUserNotifications(userId, unreadOnly = false) {
        return await this.notificationModel.findByUser(userId, unreadOnly);
    }

    /**
     * Get all notifications (admin only)
     * @returns {Promise<Array>} Array of all notifications
     */
    async getAllNotifications() {
        return await this.notificationModel.findAll();
    }

    /**
     * Mark notification as read
     * @param {String} notificationId - Notification ID
     * @returns {Promise<Object>} Updated notification
     */
    async markAsRead(notificationId) {
        const result = await this.notificationModel.markAsRead(notificationId);
        if (!result) {
            throw new Error('Notification not found');
        }
        return result;
    }

    /**
     * Mark all notifications as read for a user
     * @param {String} userId - User ID
     * @returns {Promise<Number>} Number of updated notifications
     */
    async markAllAsRead(userId) {
        return await this.notificationModel.markAllAsRead(userId);
    }

    /**
     * Get unread count
     * @param {String} userId - User ID
     * @returns {Promise<Number>} Unread count
     */
    async getUnreadCount(userId) {
        return await this.notificationModel.getUnreadCount(userId);
    }

    /**
     * Delete notification
     * @param {String} notificationId - Notification ID
     * @returns {Promise<Boolean>} Success status
     */
    async deleteNotification(notificationId) {
        const deleted = await this.notificationModel.delete(notificationId);
        if (!deleted) {
            throw new Error('Notification not found');
        }
        return true;
    }

    /**
     * Delete all user notifications
     * @param {String} userId - User ID
     * @returns {Promise<Number>} Number of deleted notifications
     */
    async deleteUserNotifications(userId) {
        return await this.notificationModel.deleteByUser(userId);
    }
}

module.exports = NotificationService;
