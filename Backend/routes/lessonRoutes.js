const express = require('express');
const router = express.Router();
const AuthMiddleware = require('../src/middleware/authMiddleware');
const ValidationMiddleware = require('../src/middleware/validationMiddleware');

/**
 * Lesson Routes
 */
function createLessonRoutes(lessonController) {
    // Create lesson
    router.post('/',
        AuthMiddleware.authenticate,
        AuthMiddleware.authorize('admin', 'instructor', 'student'),
        ValidationMiddleware.validateLessonCreation,
        (req, res) => lessonController.create(req, res)
    );

    // Check time slot availability
    router.post('/check-availability',
        AuthMiddleware.authenticate,
        (req, res) => lessonController.checkAvailability(req, res)
    );

    // Get instructor availability for a specific date
    router.get('/availability/:instructorId/:date',
        AuthMiddleware.authenticate,
        (req, res) => lessonController.getAvailability(req, res)
    );

    // Get all lessons
    router.get('/',
        AuthMiddleware.authenticate,
        (req, res) => lessonController.getAll(req, res)
    );

    // Get upcoming lessons for instructor
    router.get('/instructor/:instructorId/upcoming',
        AuthMiddleware.authenticate,
        (req, res) => lessonController.getUpcomingForInstructor(req, res)
    );

    // Get upcoming lessons for student
    router.get('/student/:studentId/upcoming',
        AuthMiddleware.authenticate,
        (req, res) => lessonController.getUpcomingForStudent(req, res)
    );

    // Get all lessons for an instructor
    router.get('/instructor/:instructorId',
        AuthMiddleware.authenticate,
        AuthMiddleware.authorize('instructor', 'admin'),
        (req, res) => lessonController.getInstructorLessons(req, res)
    );

    // Get lesson by ID
    router.get('/:id',
        AuthMiddleware.authenticate,
        (req, res) => lessonController.getById(req, res)
    );

    // Update lesson
    router.put('/:id',
        AuthMiddleware.authenticate,
        AuthMiddleware.authorize('admin', 'instructor'),
        (req, res) => lessonController.update(req, res)
    );

    // Complete lesson
    router.post('/:id/complete',
        AuthMiddleware.authenticate,
        AuthMiddleware.authorize('instructor'),
        (req, res) => lessonController.complete(req, res)
    );

    // Delete lesson
    router.delete('/:id',
        AuthMiddleware.authenticate,
        AuthMiddleware.authorize('admin', 'instructor'),
        (req, res) => lessonController.delete(req, res)
    );

    return router;
}

module.exports = createLessonRoutes;
