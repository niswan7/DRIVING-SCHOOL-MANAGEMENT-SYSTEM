const express = require('express');
const router = express.Router();
const AuthMiddleware = require('../src/middleware/authMiddleware');
const ValidationMiddleware = require('../src/middleware/validationMiddleware');

/**
 * Booking Routes
 */
function createBookingRoutes(bookingController) {
    // Create booking
    router.post('/',
        AuthMiddleware.authenticate,
        AuthMiddleware.authorize('admin', 'instructor', 'student'),
        ValidationMiddleware.validateBookingCreation,
        (req, res) => bookingController.create(req, res)
    );

    // Check time slot availability
    router.post('/check-availability',
        AuthMiddleware.authenticate,
        (req, res) => bookingController.checkAvailability(req, res)
    );

    // Get instructor availability for a specific date
    router.get('/availability/:instructorId/:date',
        AuthMiddleware.authenticate,
        (req, res) => bookingController.getAvailability(req, res)
    );

    // Get all bookings
    router.get('/',
        AuthMiddleware.authenticate,
        (req, res) => bookingController.getAll(req, res)
    );

    // Get upcoming bookings for instructor
    router.get('/instructor/:instructorId/upcoming',
        AuthMiddleware.authenticate,
        (req, res) => bookingController.getUpcomingForInstructor(req, res)
    );

    // Get upcoming bookings for student
    router.get('/student/:studentId/upcoming',
        AuthMiddleware.authenticate,
        (req, res) => bookingController.getUpcomingForStudent(req, res)
    );

    // Get all bookings for an instructor
    router.get('/instructor/:instructorId',
        AuthMiddleware.authenticate,
        AuthMiddleware.authorize('instructor', 'admin'),
        (req, res) => bookingController.getInstructorBookings(req, res)
    );

    // Get monthly teaching hours for instructor
    router.get('/instructor/:instructorId/monthly-hours',
        AuthMiddleware.authenticate,
        (req, res) => bookingController.getMonthlyHours(req, res)
    );

    // Get booking by ID
    router.get('/:id',
        AuthMiddleware.authenticate,
        (req, res) => bookingController.getById(req, res)
    );

    // Update booking
    router.put('/:id',
        AuthMiddleware.authenticate,
        AuthMiddleware.authorize('admin', 'instructor', 'student'),
        (req, res) => bookingController.update(req, res)
    );

    // Complete booking
    router.post('/:id/complete',
        AuthMiddleware.authenticate,
        AuthMiddleware.authorize('instructor'),
        (req, res) => bookingController.complete(req, res)
    );

    // Update booking attendance
    router.patch('/:id/attendance',
        AuthMiddleware.authenticate,
        AuthMiddleware.authorize('instructor', 'admin'),
        (req, res) => bookingController.updateAttendance(req, res)
    );

    // Delete booking
    router.delete('/:id',
        AuthMiddleware.authenticate,
        AuthMiddleware.authorize('admin', 'instructor'),
        (req, res) => bookingController.delete(req, res)
    );

    return router;
}

module.exports = createBookingRoutes;
