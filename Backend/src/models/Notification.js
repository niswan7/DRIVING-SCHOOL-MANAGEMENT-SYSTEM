const { ObjectId } = require('mongodb');

/**
 * Notification Model
 * Handles user notifications
 */
class Notification {
    constructor(db) {
        this.collection = db.collection('notifications');
        this.createIndexes();
    }

    /**
     * Create database indexes
     */
    async createIndexes() {
        try {
            await this.collection.createIndex({ userId: 1, createdAt: -1 });
            await this.collection.createIndex({ isRead: 1 });
        } catch (error) {
            console.error('Error creating indexes:', error);
        }
    }

    /**
     * Create notification
     * @param {Object} notificationData - Notification data
     * @returns {Promise<Object>} Created notification
     */
    async create(notificationData) {
        const notification = {
            userId: new ObjectId(notificationData.userId),
            title: notificationData.title,
            message: notificationData.message,
            type: notificationData.type || 'info', // info, success, warning, error
            isRead: false,
            metadata: notificationData.metadata || {},
            createdAt: new Date()
        };

        const result = await this.collection.insertOne(notification);
        notification._id = result.insertedId;
        return notification;
    }

    /**
     * Get all notifications for a user
     * @param {String} userId - User ID
     * @param {Boolean} unreadOnly - Get only unread notifications
     * @returns {Promise<Array>} Array of notifications
     */
    async findByUser(userId, unreadOnly = false) {
        const query = { userId: new ObjectId(userId) };
        
        if (unreadOnly) {
            query.isRead = false;
        }

        return await this.collection
            .find(query)
            .sort({ createdAt: -1 })
            .limit(50)
            .toArray();
    }

    /**
     * Get all notifications (admin only)
     * @returns {Promise<Array>} Array of all notifications
     */
    async findAll() {
        return await this.collection
            .find({})
            .sort({ createdAt: -1 })
            .limit(100)
            .toArray();
    }

    /**
     * Mark notification as read
     * @param {String} id - Notification ID
     * @returns {Promise<Object>} Updated notification
     */
    async markAsRead(id) {
        const result = await this.collection.findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: { isRead: true } },
            { returnDocument: 'after' }
        );

        return result;
    }

    /**
     * Mark all notifications as read for a user
     * @param {String} userId - User ID
     * @returns {Promise<Number>} Number of updated notifications
     */
    async markAllAsRead(userId) {
        const result = await this.collection.updateMany(
            { userId: new ObjectId(userId), isRead: false },
            { $set: { isRead: true } }
        );

        return result.modifiedCount;
    }

    /**
     * Delete notification
     * @param {String} id - Notification ID
     * @returns {Promise<Boolean>} Success status
     */
    async delete(id) {
        const result = await this.collection.deleteOne({ _id: new ObjectId(id) });
        return result.deletedCount > 0;
    }

    /**
     * Delete all notifications for a user
     * @param {String} userId - User ID
     * @returns {Promise<Number>} Number of deleted notifications
     */
    async deleteByUser(userId) {
        const result = await this.collection.deleteMany({
            userId: new ObjectId(userId)
        });
        return result.deletedCount;
    }

    /**
     * Get unread count for a user
     * @param {String} userId - User ID
     * @returns {Promise<Number>} Unread count
     */
    async getUnreadCount(userId) {
        return await this.collection.countDocuments({
            userId: new ObjectId(userId),
            isRead: false
        });
    }
}

module.exports = Notification;
