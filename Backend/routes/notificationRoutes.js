const express = require('express');
const router = express.Router();
const AuthMiddleware = require('../src/middleware/authMiddleware');

/**
 * Notification Routes
 */
function createNotificationRoutes(notificationController) {
    // Create notification
    router.post('/',
        AuthMiddleware.authenticate,
        AuthMiddleware.authorize('admin'),
        (req, res) => notificationController.create(req, res)
    );

    // Get all notifications (admin only)
    router.get('/',
        AuthMiddleware.authenticate,
        AuthMiddleware.authorize('admin'),
        (req, res) => notificationController.getAll(req, res)
    );

    // Get user notifications
    router.get('/user/:userId',
        AuthMiddleware.authenticate,
        (req, res) => notificationController.getUserNotifications(req, res)
    );

    // Get unread count
    router.get('/user/:userId/unread-count',
        AuthMiddleware.authenticate,
        (req, res) => notificationController.getUnreadCount(req, res)
    );

    // Mark notification as read
    router.put('/:id/read',
        AuthMiddleware.authenticate,
        (req, res) => notificationController.markAsRead(req, res)
    );

    // Mark all as read
    router.put('/user/:userId/read-all',
        AuthMiddleware.authenticate,
        (req, res) => notificationController.markAllAsRead(req, res)
    );

    // Delete notification
    router.delete('/:id',
        AuthMiddleware.authenticate,
        (req, res) => notificationController.delete(req, res)
    );

    // Delete all user notifications
    router.delete('/user/:userId',
        AuthMiddleware.authenticate,
        (req, res) => notificationController.deleteUserNotifications(req, res)
    );

    return router;
}

module.exports = createNotificationRoutes;
