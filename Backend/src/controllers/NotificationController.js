/**
 * Notification Controller
 * Handles HTTP requests for notification operations
 */
class NotificationController {
    constructor(notificationService) {
        this.notificationService = notificationService;
    }

    /**
     * Create notification
     * POST /api/notifications
     */
    async create(req, res) {
        try {
            const notification = await this.notificationService.createNotification(req.body);
            res.status(201).json({
                success: true,
                data: notification,
                message: 'Notification created successfully'
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Get all notifications (admin only)
     * GET /api/notifications
     */
    async getAll(req, res) {
        try {
            const notifications = await this.notificationService.getAllNotifications();
            res.status(200).json({
                success: true,
                data: notifications,
                count: notifications.length
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Get user notifications
     * GET /api/notifications/user/:userId
     */
    async getUserNotifications(req, res) {
        try {
            const unreadOnly = req.query.unreadOnly === 'true';
            const notifications = await this.notificationService.getUserNotifications(
                req.params.userId,
                unreadOnly
            );
            res.status(200).json({
                success: true,
                data: notifications,
                count: notifications.length
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Mark notification as read
     * PUT /api/notifications/:id/read
     */
    async markAsRead(req, res) {
        try {
            const notification = await this.notificationService.markAsRead(req.params.id);
            res.status(200).json({
                success: true,
                data: notification,
                message: 'Notification marked as read'
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Mark all notifications as read
     * PUT /api/notifications/user/:userId/read-all
     */
    async markAllAsRead(req, res) {
        try {
            const count = await this.notificationService.markAllAsRead(req.params.userId);
            res.status(200).json({
                success: true,
                count,
                message: `${count} notifications marked as read`
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Get unread count
     * GET /api/notifications/user/:userId/unread-count
     */
    async getUnreadCount(req, res) {
        try {
            const count = await this.notificationService.getUnreadCount(req.params.userId);
            res.status(200).json({
                success: true,
                count
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Delete notification
     * DELETE /api/notifications/:id
     */
    async delete(req, res) {
        try {
            await this.notificationService.deleteNotification(req.params.id);
            res.status(200).json({
                success: true,
                message: 'Notification deleted successfully'
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Delete all user notifications
     * DELETE /api/notifications/user/:userId
     */
    async deleteUserNotifications(req, res) {
        try {
            const count = await this.notificationService.deleteUserNotifications(req.params.userId);
            res.status(200).json({
                success: true,
                count,
                message: `${count} notifications deleted`
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = NotificationController;
