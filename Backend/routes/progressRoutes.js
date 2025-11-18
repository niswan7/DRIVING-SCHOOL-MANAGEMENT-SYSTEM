const express = require('express');
const router = express.Router();
const AuthMiddleware = require('../src/middleware/authMiddleware');

/**
 * Progress Routes
 */
function createProgressRoutes(progressController) {
    // Create progress record
    router.post('/',
        AuthMiddleware.authenticate,
        AuthMiddleware.authorize('instructor', 'admin'),
        (req, res) => progressController.create(req, res)
    );

    // Get student progress
    router.get('/student/:studentId',
        AuthMiddleware.authenticate,
        (req, res) => progressController.getStudentProgress(req, res)
    );

    // Get student progress summary
    router.get('/student/:studentId/summary',
        AuthMiddleware.authenticate,
        (req, res) => progressController.getStudentSummary(req, res)
    );

    // Get progress by ID
    router.get('/:id',
        AuthMiddleware.authenticate,
        (req, res) => progressController.getById(req, res)
    );

    // Update progress
    router.put('/:id',
        AuthMiddleware.authenticate,
        AuthMiddleware.authorize('instructor', 'admin'),
        (req, res) => progressController.update(req, res)
    );

    // Delete progress
    router.delete('/:id',
        AuthMiddleware.authenticate,
        AuthMiddleware.authorize('admin'),
        (req, res) => progressController.delete(req, res)
    );

    return router;
}

module.exports = createProgressRoutes;
