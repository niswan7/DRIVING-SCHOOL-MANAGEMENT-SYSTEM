/**
 * Booking Service
 * Business logic for booking operations
 */
class BookingService {
    constructor(bookingModel, scheduleModel, notificationModel) {
        this.bookingModel = bookingModel;
        this.scheduleModel = scheduleModel;
        this.notificationModel = notificationModel;
    }

    /**
     * Create a new booking
     * @param {Object} bookingData - Booking data
     * @returns {Promise<Object>} Created booking
     */
    async createBooking(bookingData) {
        console.log('BookingService.createBooking called with:', bookingData);
        const booking = await this.bookingModel.create(bookingData);
        console.log('Booking created in service:', booking);

        // Send notifications to student and instructor
        if (this.notificationModel && bookingData.studentId) {
            await this.notificationModel.create({
                userId: bookingData.studentId,
                title: 'New Booking Scheduled',
                message: `A new booking has been scheduled for ${bookingData.date} at ${bookingData.time}`,
                type: 'info',
                metadata: { bookingId: booking._id }
            });

            await this.notificationModel.create({
                userId: bookingData.instructorId,
                title: 'New Booking Assigned',
                message: `You have a new booking scheduled for ${bookingData.date} at ${bookingData.time}`,
                type: 'info',
                metadata: { bookingId: booking._id }
            });
        }

        return booking;
    }

    /**
     * Get booking by ID
     * @param {String} bookingId - Booking ID
     * @returns {Promise<Object>} Booking object
     */
    async getBookingById(bookingId) {
        const booking = await this.bookingModel.findById(bookingId);
        if (!booking) {
            throw new Error('Booking not found');
        }
        return booking;
    }

    /**
     * Get all bookings
     * @param {Object} filters - Query filters
     * @returns {Promise<Array>} Array of bookings
     */
    async getAllBookings(filters = {}) {
        return await this.bookingModel.findAll(filters);
    }

    /**
     * Get upcoming bookings for instructor
     * @param {String} instructorId - Instructor ID
     * @returns {Promise<Array>} Array of upcoming bookings
     */
    async getUpcomingBookingsForInstructor(instructorId) {
        return await this.bookingModel.getUpcomingByInstructor(instructorId);
    }

    /**
     * Get upcoming bookings for student
     * @param {String} studentId - Student ID
     * @returns {Promise<Array>} Array of upcoming bookings
     */
    async getUpcomingBookingsForStudent(studentId) {
        return await this.bookingModel.getUpcomingByStudent(studentId);
    }

    /**
     * Get all bookings for an instructor
     * @param {String} instructorId - Instructor ID
     * @returns {Promise<Array>} Array of bookings
     */
    async getBookingsByInstructor(instructorId) {
        return await this.bookingModel.findAll({ instructorId });
    }

    /**
     * Update booking
     * @param {String} bookingId - Booking ID
     * @param {Object} updateData - Data to update
     * @returns {Promise<Object>} Updated booking
     */
    async updateBooking(bookingId, updateData) {
        const result = await this.bookingModel.update(bookingId, updateData);
        if (!result) {
            throw new Error('Booking not found');
        }

        // Notify about changes
        if (this.notificationModel && updateData.status === 'cancelled') {
            const booking = await this.bookingModel.findById(bookingId);
            if (booking.studentId) {
                await this.notificationModel.create({
                    userId: booking.studentId,
                    title: 'Booking Cancelled',
                    message: `Your booking scheduled for ${booking.date} has been cancelled`,
                    type: 'warning',
                    metadata: { bookingId }
                });
            }
        }

        return result;
    }

    /**
     * Delete booking
     * @param {String} bookingId - Booking ID
     * @returns {Promise<Boolean>} Success status
     */
    async deleteBooking(bookingId) {
        const deleted = await this.bookingModel.delete(bookingId);
        if (!deleted) {
            throw new Error('Booking not found');
        }
        return true;
    }

    /**
     * Complete booking
     * @param {String} bookingId - Booking ID
     * @param {Object} completionData - Completion data
     * @returns {Promise<Object>} Updated booking
     */
    async completeBooking(bookingId, completionData) {
        const updateData = {
            status: 'completed',
            ...completionData
        };
        return await this.updateBooking(bookingId, updateData);
    }

    /**
     * Get instructor availability for a specific date
     * @param {String} instructorId - Instructor ID
     * @param {Date} date - Date to check
     * @returns {Promise<Object>} Available time slots
     */
    async getInstructorAvailability(instructorId, date) {
        console.log('Checking availability for:', {
            instructorId,
            date
        });
        
        // First, try to get date-specific schedules
        let schedules = await this.scheduleModel.findByInstructorAndDate(instructorId, date);
        console.log('Date-specific schedules:', schedules);
        
        // If no date-specific schedules, fall back to day-of-week schedules (backward compatibility)
        if (!schedules || schedules.length === 0) {
            const dayOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date(date).getDay()];
            const allSchedules = await this.scheduleModel.findByInstructor(instructorId);
            schedules = allSchedules.filter(s => s.day === dayOfWeek && !s.date);
            console.log('Day-of-week schedules for', dayOfWeek, ':', schedules);
        }

        if (schedules.length === 0) {
            console.log('No schedule found for this date');
            return { available: false, slots: [], fullyBooked: false };
        }

        // Get booked bookings for this date
        const bookedBookings = await this.bookingModel.getInstructorBookingsForDate(instructorId, date);
        console.log('Booked bookings for this date:', bookedBookings);

        // Generate available slots
        const availableSlots = [];
        let totalSlots = 0;
        
        for (const schedule of schedules) {
            const slots = this.generateTimeSlots(schedule.startTime, schedule.endTime, bookedBookings);
            console.log('Generated slots for', schedule.startTime, '-', schedule.endTime, ':', slots);
            
            // Calculate total possible slots
            const [startHour, startMin] = schedule.startTime.split(':').map(Number);
            const [endHour, endMin] = schedule.endTime.split(':').map(Number);
            const startMinutes = startHour * 60 + startMin;
            const endMinutes = endHour * 60 + endMin;
            totalSlots += Math.floor((endMinutes - startMinutes) / 60);
            
            availableSlots.push(...slots);
        }

        console.log('Final available slots:', availableSlots);
        console.log('Total possible slots:', totalSlots);

        return {
            available: availableSlots.length > 0,
            slots: availableSlots.sort(),
            fullyBooked: totalSlots > 0 && availableSlots.length === 0
        };
    }

    /**
     * Generate time slots from start to end, excluding booked times
     * @param {String} startTime - Start time (HH:mm)
     * @param {String} endTime - End time (HH:mm)
     * @param {Array} bookedBookings - Array of booked bookings
     * @returns {Array} Available time slots
     */
    generateTimeSlots(startTime, endTime, bookedBookings) {
        const slots = [];
        const [startHour, startMin] = startTime.split(':').map(Number);
        const [endHour, endMin] = endTime.split(':').map(Number);
        
        const startMinutes = startHour * 60 + startMin;
        const endMinutes = endHour * 60 + endMin;
        const slotDuration = 60; // 1 hour slots

        for (let time = startMinutes; time + slotDuration <= endMinutes; time += slotDuration) {
            const hours = Math.floor(time / 60);
            const minutes = time % 60;
            const timeSlot = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

            // Check if this slot conflicts with any booked booking
            const hasConflict = bookedBookings.some(booking => {
                const [bookingHour, bookingMin] = booking.time.split(':').map(Number);
                const bookingStart = bookingHour * 60 + bookingMin;
                const bookingEnd = bookingStart + (booking.duration || 60);

                return time < bookingEnd && (time + slotDuration) > bookingStart;
            });

            if (!hasConflict) {
                slots.push(timeSlot);
            }
        }

        return slots;
    }

    /**
     * Check if a time slot is available
     * @param {String} instructorId - Instructor ID
     * @param {Date} date - Date
     * @param {String} time - Time (HH:mm)
     * @param {Number} duration - Duration in minutes
     * @returns {Promise<Boolean>} True if available
     */
    async checkTimeSlotAvailability(instructorId, date, time, duration = 60) {
        return await this.bookingModel.isTimeSlotAvailable(instructorId, date, time, duration);
    }

    /**
     * Update booking attendance
     * @param {String} bookingId - Booking ID
     * @param {String} attendance - Attendance status ('attended', 'not-attended')
     * @returns {Promise<Object>} Updated booking
     */
    async updateAttendance(bookingId, attendance) {
        if (!['attended', 'not-attended'].includes(attendance)) {
            throw new Error('Invalid attendance status. Must be "attended" or "not-attended"');
        }

        const result = await this.bookingModel.updateAttendance(bookingId, attendance);
        if (!result) {
            throw new Error('Booking not found');
        }

        return result;
    }

    /**
     * Get monthly teaching hours for instructor
     * @param {String} instructorId - Instructor ID
     * @returns {Promise<Object>} Monthly hours data
     */
    async getMonthlyHours(instructorId) {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

        const bookings = await this.bookingModel.findAll({
            instructorId,
            dateFrom: startOfMonth.toISOString(),
            dateTo: endOfMonth.toISOString(),
            status: 'completed'
        });

        // Calculate total hours from completed bookings
        const totalMinutes = bookings.reduce((sum, booking) => {
            return sum + (booking.duration || 0);
        }, 0);

        const totalHours = Math.round(totalMinutes / 60);

        return {
            totalHours,
            totalBookings: bookings.length,
            month: now.toLocaleString('default', { month: 'long', year: 'numeric' })
        };
    }
}

module.exports = BookingService;
