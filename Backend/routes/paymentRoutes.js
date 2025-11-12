const express = require('express');
const router = express.Router();
const AuthMiddleware = require('../src/middleware/authMiddleware');
const ValidationMiddleware = require('../src/middleware/validationMiddleware');

/**
 * Payment Routes
 */
function createPaymentRoutes(paymentController) {
    // Create payment
    router.post('/',
        AuthMiddleware.authenticate,
        AuthMiddleware.authorize('admin'),
        ValidationMiddleware.validatePaymentCreation,
        (req, res) => paymentController.create(req, res)
    );

    // Get all payments
    router.get('/',
        AuthMiddleware.authenticate,
        AuthMiddleware.authorize('admin'),
        (req, res) => paymentController.getAll(req, res)
    );

    // Get student payments
    router.get('/student/:studentId',
        AuthMiddleware.authenticate,
        (req, res) => paymentController.getStudentPayments(req, res)
    );

    // Get student payment summary
    router.get('/student/:studentId/summary',
        AuthMiddleware.authenticate,
        (req, res) => paymentController.getStudentSummary(req, res)
    );

    // Get payment by ID
    router.get('/:id',
        AuthMiddleware.authenticate,
        (req, res) => paymentController.getById(req, res)
    );

    // Update payment
    router.put('/:id',
        AuthMiddleware.authenticate,
        AuthMiddleware.authorize('admin'),
        (req, res) => paymentController.update(req, res)
    );

    // Process payment
    router.post('/:id/process',
        AuthMiddleware.authenticate,
        AuthMiddleware.authorize('admin'),
        (req, res) => paymentController.process(req, res)
    );

    // Delete payment
    router.delete('/:id',
        AuthMiddleware.authenticate,
        AuthMiddleware.authorize('admin'),
        (req, res) => paymentController.delete(req, res)
    );

    return router;
}

module.exports = createPaymentRoutes;
