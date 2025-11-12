/**
 * Schedule Service
 * Business logic for instructor schedule operations
 */
class ScheduleService {
    constructor(scheduleModel) {
        this.scheduleModel = scheduleModel;
    }

    /**
     * Create a new schedule slot
     * @param {Object} scheduleData - Schedule data
     * @returns {Promise<Object>} Created schedule
     */
    async createSchedule(scheduleData) {
        // Check for overlapping schedules
        const hasOverlap = await this.scheduleModel.checkOverlap(
            scheduleData.instructorId,
            scheduleData.day,
            scheduleData.startTime,
            scheduleData.endTime
        );

        if (hasOverlap) {
            throw new Error('Schedule slot overlaps with existing availability');
        }

        return await this.scheduleModel.create(scheduleData);
    }

    /**
     * Get schedule by ID
     * @param {String} scheduleId - Schedule ID
     * @returns {Promise<Object>} Schedule object
     */
    async getScheduleById(scheduleId) {
        const schedule = await this.scheduleModel.findById(scheduleId);
        if (!schedule) {
            throw new Error('Schedule not found');
        }
        return schedule;
    }

    /**
     * Get all schedules for an instructor
     * @param {String} instructorId - Instructor ID
     * @returns {Promise<Array>} Array of schedule slots
     */
    async getInstructorSchedule(instructorId) {
        return await this.scheduleModel.findByInstructor(instructorId);
    }

    /**
     * Update schedule
     * @param {String} scheduleId - Schedule ID
     * @param {Object} updateData - Data to update
     * @returns {Promise<Object>} Updated schedule
     */
    async updateSchedule(scheduleId, updateData) {
        // If updating time slots, check for overlap
        if (updateData.day || updateData.startTime || updateData.endTime) {
            const existing = await this.scheduleModel.findById(scheduleId);
            if (!existing) {
                throw new Error('Schedule not found');
            }

            const hasOverlap = await this.scheduleModel.checkOverlap(
                existing.instructorId,
                updateData.day || existing.day,
                updateData.startTime || existing.startTime,
                updateData.endTime || existing.endTime,
                scheduleId
            );

            if (hasOverlap) {
                throw new Error('Updated schedule overlaps with existing availability');
            }
        }

        const result = await this.scheduleModel.update(scheduleId, updateData);
        if (!result) {
            throw new Error('Schedule not found');
        }
        return result;
    }

    /**
     * Delete schedule
     * @param {String} scheduleId - Schedule ID
     * @returns {Promise<Boolean>} Success status
     */
    async deleteSchedule(scheduleId) {
        const deleted = await this.scheduleModel.delete(scheduleId);
        if (!deleted) {
            throw new Error('Schedule not found');
        }
        return true;
    }

    /**
     * Copy schedule from previous week
     * @param {String} instructorId - Instructor ID
     * @returns {Promise<Array>} Array of created schedules
     */
    async copyPreviousWeek(instructorId) {
        const existingSchedules = await this.scheduleModel.findByInstructor(instructorId);
        
        const newSchedules = [];
        for (const schedule of existingSchedules) {
            const newSchedule = {
                instructorId: schedule.instructorId,
                day: schedule.day,
                startTime: schedule.startTime,
                endTime: schedule.endTime,
                isRecurring: schedule.isRecurring
            };
            const created = await this.scheduleModel.create(newSchedule);
            newSchedules.push(created);
        }

        return newSchedules;
    }
}

module.exports = ScheduleService;
