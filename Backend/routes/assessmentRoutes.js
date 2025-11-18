const express = require('express');
const router = express.Router();
const AuthMiddleware = require('../src/middleware/authMiddleware');

/**
 * Assessment Routes
 */
function createAssessmentRoutes(assessmentController) {
    // Create assessment
    router.post('/',
        AuthMiddleware.authenticate,
        AuthMiddleware.authorize('admin', 'instructor'),
        (req, res) => assessmentController.create(req, res)
    );

    // Get all assessments
    router.get('/',
        AuthMiddleware.authenticate,
        (req, res) => assessmentController.getAll(req, res)
    );

    // Get upcoming assessments for student
    router.get('/student/:studentId/upcoming',
        AuthMiddleware.authenticate,
        (req, res) => assessmentController.getUpcomingForStudent(req, res)
    );

    // Get student assessment statistics
    router.get('/student/:studentId/stats',
        AuthMiddleware.authenticate,
        (req, res) => assessmentController.getStudentStats(req, res)
    );

    // Get assessments by student and course
    router.get('/student/:studentId/course/:courseId',
        AuthMiddleware.authenticate,
        (req, res) => assessmentController.getByStudentAndCourse(req, res)
    );

    // Get assessment by ID
    router.get('/:id',
        AuthMiddleware.authenticate,
        (req, res) => assessmentController.getById(req, res)
    );

    // Update assessment
    router.put('/:id',
        AuthMiddleware.authenticate,
        AuthMiddleware.authorize('admin', 'instructor'),
        (req, res) => assessmentController.update(req, res)
    );

    // Update assessment score
    router.patch('/:id/score',
        AuthMiddleware.authenticate,
        AuthMiddleware.authorize('admin', 'instructor'),
        (req, res) => assessmentController.updateScore(req, res)
    );

    // Mark assessment as completed
    router.post('/:id/complete',
        AuthMiddleware.authenticate,
        AuthMiddleware.authorize('student'),
        (req, res) => assessmentController.complete(req, res)
    );

    // Delete assessment
    router.delete('/:id',
        AuthMiddleware.authenticate,
        AuthMiddleware.authorize('admin', 'instructor'),
        (req, res) => assessmentController.delete(req, res)
    );

    return router;
}

module.exports = createAssessmentRoutes;
