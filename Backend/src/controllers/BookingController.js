/**
 * Booking Controller
 * Handles HTTP requests for booking operations
 */
class BookingController {
    constructor(bookingService) {
        this.bookingService = bookingService;
    }

    /**
     * Create a new booking
     * POST /api/bookings
     */
    async create(req, res) {
        try {
            console.log('Creating booking with data:', req.body);
            const booking = await this.bookingService.createBooking(req.body);
            console.log('Booking created successfully:', booking);
            res.status(201).json({
                success: true,
                data: booking,
                message: 'Booking created successfully'
            });
        } catch (error) {
            console.error('Error creating booking:', error);
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Get all bookings
     * GET /api/bookings
     */
    async getAll(req, res) {
        try {
            const filters = {
                instructorId: req.query.instructorId,
                studentId: req.query.studentId,
                courseId: req.query.courseId,
                status: req.query.status,
                dateFrom: req.query.dateFrom,
                dateTo: req.query.dateTo
            };
            const bookings = await this.bookingService.getAllBookings(filters);
            res.status(200).json({
                success: true,
                data: bookings,
                count: bookings.length
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Get booking by ID
     * GET /api/bookings/:id
     */
    async getById(req, res) {
        try {
            const booking = await this.bookingService.getBookingById(req.params.id);
            res.status(200).json({
                success: true,
                data: booking
            });
        } catch (error) {
            res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Get upcoming bookings for instructor
     * GET /api/bookings/instructor/:instructorId/upcoming
     */
    async getUpcomingForInstructor(req, res) {
        try {
            const bookings = await this.bookingService.getUpcomingBookingsForInstructor(req.params.instructorId);
            res.status(200).json({
                success: true,
                data: bookings,
                count: bookings.length
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Get upcoming bookings for student
     * GET /api/bookings/student/:studentId/upcoming
     */
    async getUpcomingForStudent(req, res) {
        try {
            console.log('Getting upcoming bookings for student:', req.params.studentId);
            const bookings = await this.bookingService.getUpcomingBookingsForStudent(req.params.studentId);
            console.log('Found bookings:', bookings.length, bookings);
            res.status(200).json({
                success: true,
                data: bookings,
                count: bookings.length
            });
        } catch (error) {
            console.error('Error getting upcoming bookings for student:', error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Get all bookings for an instructor
     * GET /api/bookings/instructor/:instructorId
     */
    async getInstructorBookings(req, res) {
        try {
            const bookings = await this.bookingService.getBookingsByInstructor(req.params.instructorId);
            res.status(200).json({
                success: true,
                data: bookings,
                count: bookings.length
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Get monthly teaching hours for instructor
     * GET /api/bookings/instructor/:instructorId/monthly-hours
     */
    async getMonthlyHours(req, res) {
        try {
            const monthlyHours = await this.bookingService.getMonthlyHours(req.params.instructorId);
            res.status(200).json({
                success: true,
                data: monthlyHours
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Update booking
     * PUT /api/bookings/:id
     */
    async update(req, res) {
        try {
            const userRole = req.user.role;
            const userId = req.user.userId;
            
            // If user is a student, verify they own the booking and can only cancel
            if (userRole === 'student') {
                const booking = await this.bookingService.getBookingById(req.params.id);
                
                // Check if student owns this booking
                if (booking.studentId.toString() !== userId) {
                    return res.status(403).json({
                        success: false,
                        message: 'You can only update your own bookings'
                    });
                }
                
                // Students can only change status to cancelled
                if (req.body.status && req.body.status !== 'cancelled') {
                    return res.status(403).json({
                        success: false,
                        message: 'Students can only cancel bookings'
                    });
                }
                
                // Only allow status update for students
                req.body = { status: 'cancelled' };
            }
            
            const updatedBooking = await this.bookingService.updateBooking(req.params.id, req.body);
            res.status(200).json({
                success: true,
                data: updatedBooking,
                message: 'Booking updated successfully'
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Complete booking
     * POST /api/bookings/:id/complete
     */
    async complete(req, res) {
        try {
            const booking = await this.bookingService.completeBooking(req.params.id, req.body);
            res.status(200).json({
                success: true,
                data: booking,
                message: 'Booking marked as completed'
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Delete booking
     * DELETE /api/bookings/:id
     */
    async delete(req, res) {
        try {
            await this.bookingService.deleteBooking(req.params.id);
            res.status(200).json({
                success: true,
                message: 'Booking deleted successfully'
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Get instructor availability for a specific date
     * GET /api/bookings/availability/:instructorId/:date
     */
    async getAvailability(req, res) {
        try {
            const { instructorId, date } = req.params;
            const availability = await this.bookingService.getInstructorAvailability(instructorId, date);
            res.status(200).json({
                success: true,
                data: availability
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Check time slot availability
     * POST /api/bookings/check-availability
     */
    async checkAvailability(req, res) {
        try {
            const { instructorId, date, time, duration } = req.body;
            const available = await this.bookingService.checkTimeSlotAvailability(
                instructorId,
                date,
                time,
                duration
            );
            res.status(200).json({
                success: true,
                data: { available }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Update booking attendance
     * PATCH /api/bookings/:id/attendance
     */
    async updateAttendance(req, res) {
        try {
            const { id } = req.params;
            const { attendance } = req.body;
            
            const booking = await this.bookingService.updateAttendance(id, attendance);
            res.status(200).json({
                success: true,
                data: booking,
                message: 'Attendance updated successfully'
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = BookingController;
