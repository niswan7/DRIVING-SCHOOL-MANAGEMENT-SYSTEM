const express = require('express');
const router = express.Router();
const AuthMiddleware = require('../src/middleware/authMiddleware');
const ValidationMiddleware = require('../src/middleware/validationMiddleware');

/**
 * Feedback Routes
 */
function createFeedbackRoutes(feedbackController) {
    // Create feedback
    router.post('/',
        AuthMiddleware.authenticate,
        AuthMiddleware.authorize('student'),
        ValidationMiddleware.validateFeedbackCreation,
        (req, res) => feedbackController.create(req, res)
    );

    // Get all feedback
    router.get('/',
        AuthMiddleware.authenticate,
        AuthMiddleware.authorize('admin'),
        (req, res) => feedbackController.getAll(req, res)
    );

    // Get instructor feedback
    router.get('/instructor/:instructorId',
        AuthMiddleware.authenticate,
        (req, res) => feedbackController.getInstructorFeedback(req, res)
    );

    // Get instructor rating
    router.get('/instructor/:instructorId/rating',
        AuthMiddleware.authenticate,
        (req, res) => feedbackController.getInstructorRating(req, res)
    );

    // Get student feedback
    router.get('/student/:studentId',
        AuthMiddleware.authenticate,
        (req, res) => feedbackController.getStudentFeedback(req, res)
    );

    // Get feedback by ID
    router.get('/:id',
        AuthMiddleware.authenticate,
        (req, res) => feedbackController.getById(req, res)
    );

    // Update feedback
    router.put('/:id',
        AuthMiddleware.authenticate,
        (req, res) => feedbackController.update(req, res)
    );

    // Delete feedback
    router.delete('/:id',
        AuthMiddleware.authenticate,
        AuthMiddleware.authorize('admin'),
        (req, res) => feedbackController.delete(req, res)
    );

    return router;
}

module.exports = createFeedbackRoutes;
