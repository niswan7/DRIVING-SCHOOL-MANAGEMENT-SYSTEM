const express = require('express');
const router = express.Router();
const AuthMiddleware = require('../src/middleware/authMiddleware');
const ValidationMiddleware = require('../src/middleware/validationMiddleware');

/**
 * Schedule Routes
 */
function createScheduleRoutes(scheduleController) {
    // Create schedule
    router.post('/',
        AuthMiddleware.authenticate,
        AuthMiddleware.authorize('instructor', 'admin'),
        ValidationMiddleware.validateScheduleCreation,
        (req, res) => scheduleController.create(req, res)
    );

    // Get instructor schedule
    router.get('/instructor/:instructorId',
        AuthMiddleware.authenticate,
        (req, res) => scheduleController.getInstructorSchedule(req, res)
    );

    // Get instructor schedule for a specific date
    router.get('/instructor/:instructorId/date/:date',
        AuthMiddleware.authenticate,
        (req, res) => scheduleController.getInstructorScheduleByDate(req, res)
    );

    // Copy previous week schedule
    router.post('/instructor/:instructorId/copy-week',
        AuthMiddleware.authenticate,
        AuthMiddleware.authorize('instructor', 'admin'),
        (req, res) => scheduleController.copyPreviousWeek(req, res)
    );

    // Get schedule by ID
    router.get('/:id',
        AuthMiddleware.authenticate,
        (req, res) => scheduleController.getById(req, res)
    );

    // Update schedule
    router.put('/:id',
        AuthMiddleware.authenticate,
        AuthMiddleware.authorize('instructor', 'admin'),
        (req, res) => scheduleController.update(req, res)
    );

    // Delete schedule
    router.delete('/:id',
        AuthMiddleware.authenticate,
        AuthMiddleware.authorize('instructor', 'admin'),
        (req, res) => scheduleController.delete(req, res)
    );

    return router;
}

module.exports = createScheduleRoutes;
