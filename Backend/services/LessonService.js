/**
 * Lesson Service
 * Business logic for lesson operations
 */
class LessonService {
    constructor(lessonModel, scheduleModel, notificationModel) {
        this.lessonModel = lessonModel;
        this.scheduleModel = scheduleModel;
        this.notificationModel = notificationModel;
    }

    /**
     * Create a new lesson
     * @param {Object} lessonData - Lesson data
     * @returns {Promise<Object>} Created lesson
     */
    async createLesson(lessonData) {
        const lesson = await this.lessonModel.create(lessonData);

        // Send notifications to student and instructor
        if (this.notificationModel && lessonData.studentId) {
            await this.notificationModel.create({
                userId: lessonData.studentId,
                title: 'New Lesson Scheduled',
                message: `A new lesson has been scheduled for ${lessonData.date} at ${lessonData.time}`,
                type: 'info',
                metadata: { lessonId: lesson._id }
            });

            await this.notificationModel.create({
                userId: lessonData.instructorId,
                title: 'New Lesson Assigned',
                message: `You have a new lesson scheduled for ${lessonData.date} at ${lessonData.time}`,
                type: 'info',
                metadata: { lessonId: lesson._id }
            });
        }

        return lesson;
    }

    /**
     * Get lesson by ID
     * @param {String} lessonId - Lesson ID
     * @returns {Promise<Object>} Lesson object
     */
    async getLessonById(lessonId) {
        const lesson = await this.lessonModel.findById(lessonId);
        if (!lesson) {
            throw new Error('Lesson not found');
        }
        return lesson;
    }

    /**
     * Get all lessons
     * @param {Object} filters - Query filters
     * @returns {Promise<Array>} Array of lessons
     */
    async getAllLessons(filters = {}) {
        return await this.lessonModel.findAll(filters);
    }

    /**
     * Get upcoming lessons for instructor
     * @param {String} instructorId - Instructor ID
     * @returns {Promise<Array>} Array of upcoming lessons
     */
    async getUpcomingLessonsForInstructor(instructorId) {
        return await this.lessonModel.getUpcomingByInstructor(instructorId);
    }

    /**
     * Get upcoming lessons for student
     * @param {String} studentId - Student ID
     * @returns {Promise<Array>} Array of upcoming lessons
     */
    async getUpcomingLessonsForStudent(studentId) {
        return await this.lessonModel.getUpcomingByStudent(studentId);
    }

    /**
     * Get all lessons for an instructor
     * @param {String} instructorId - Instructor ID
     * @returns {Promise<Array>} Array of lessons
     */
    async getLessonsByInstructor(instructorId) {
        return await this.lessonModel.findAll({ instructorId });
    }

    /**
     * Update lesson
     * @param {String} lessonId - Lesson ID
     * @param {Object} updateData - Data to update
     * @returns {Promise<Object>} Updated lesson
     */
    async updateLesson(lessonId, updateData) {
        const result = await this.lessonModel.update(lessonId, updateData);
        if (!result) {
            throw new Error('Lesson not found');
        }

        // Notify about changes
        if (this.notificationModel && updateData.status === 'cancelled') {
            const lesson = await this.lessonModel.findById(lessonId);
            if (lesson.studentId) {
                await this.notificationModel.create({
                    userId: lesson.studentId,
                    title: 'Lesson Cancelled',
                    message: `Your lesson scheduled for ${lesson.date} has been cancelled`,
                    type: 'warning',
                    metadata: { lessonId }
                });
            }
        }

        return result;
    }

    /**
     * Delete lesson
     * @param {String} lessonId - Lesson ID
     * @returns {Promise<Boolean>} Success status
     */
    async deleteLesson(lessonId) {
        const deleted = await this.lessonModel.delete(lessonId);
        if (!deleted) {
            throw new Error('Lesson not found');
        }
        return true;
    }

    /**
     * Complete lesson
     * @param {String} lessonId - Lesson ID
     * @param {Object} completionData - Completion data
     * @returns {Promise<Object>} Updated lesson
     */
    async completeLesson(lessonId, completionData) {
        const updateData = {
            status: 'completed',
            ...completionData
        };
        return await this.updateLesson(lessonId, updateData);
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

        // Get booked lessons for this date
        const bookedLessons = await this.lessonModel.getInstructorLessonsForDate(instructorId, date);
        console.log('Booked lessons for this date:', bookedLessons);

        // Generate available slots
        const availableSlots = [];
        let totalSlots = 0;
        
        for (const schedule of schedules) {
            const slots = this.generateTimeSlots(schedule.startTime, schedule.endTime, bookedLessons);
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
     * @param {Array} bookedLessons - Array of booked lessons
     * @returns {Array} Available time slots
     */
    generateTimeSlots(startTime, endTime, bookedLessons) {
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

            // Check if this slot conflicts with any booked lesson
            const hasConflict = bookedLessons.some(lesson => {
                const [lessonHour, lessonMin] = lesson.time.split(':').map(Number);
                const lessonStart = lessonHour * 60 + lessonMin;
                const lessonEnd = lessonStart + (lesson.duration || 60);

                return time < lessonEnd && (time + slotDuration) > lessonStart;
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
        return await this.lessonModel.isTimeSlotAvailable(instructorId, date, time, duration);
    }

    /**
     * Update lesson attendance
     * @param {String} lessonId - Lesson ID
     * @param {String} attendance - Attendance status ('attended', 'not-attended')
     * @returns {Promise<Object>} Updated lesson
     */
    async updateAttendance(lessonId, attendance) {
        if (!['attended', 'not-attended'].includes(attendance)) {
            throw new Error('Invalid attendance status. Must be "attended" or "not-attended"');
        }

        const result = await this.lessonModel.updateAttendance(lessonId, attendance);
        if (!result) {
            throw new Error('Lesson not found');
        }

        return result;
    }
}

module.exports = LessonService;
