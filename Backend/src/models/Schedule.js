const { ObjectId } = require('mongodb');

/**
 * Schedule Model
 * Handles instructor availability/schedule operations
 */
class Schedule {
    constructor(db) {
        this.collection = db.collection('schedules');
        this.createIndexes();
    }

    /**
     * Create database indexes
     */
    async createIndexes() {
        try {
            await this.collection.createIndex({ instructorId: 1, day: 1 });
            await this.collection.createIndex({ instructorId: 1, date: 1 });
            await this.collection.createIndex({ date: 1 });
        } catch (error) {
            console.error('Error creating indexes:', error);
        }
    }

    /**
     * Create a new schedule slot
     * @param {Object} scheduleData - Schedule data
     * @returns {Promise<Object>} Created schedule
     */
    async create(scheduleData) {
        const schedule = {
            instructorId: new ObjectId(scheduleData.instructorId),
            date: scheduleData.date ? new Date(scheduleData.date) : null, // Specific date
            day: scheduleData.day || null, // Day of week (for backward compatibility)
            startTime: scheduleData.startTime,
            endTime: scheduleData.endTime,
            isRecurring: scheduleData.isRecurring !== false, // Default true
            effectiveFrom: scheduleData.effectiveFrom ? new Date(scheduleData.effectiveFrom) : new Date(),
            effectiveTo: scheduleData.effectiveTo ? new Date(scheduleData.effectiveTo) : null,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await this.collection.insertOne(schedule);
        schedule._id = result.insertedId;
        return schedule;
    }

    /**
     * Find schedule by ID
     * @param {String} id - Schedule ID
     * @returns {Promise<Object>} Schedule object
     */
    async findById(id) {
        return await this.collection.findOne({ _id: new ObjectId(id) });
    }

    /**
     * Get all schedules for an instructor
     * @param {String} instructorId - Instructor ID
     * @returns {Promise<Array>} Array of schedule slots
     */
    async findByInstructor(instructorId) {
        return await this.collection
            .find({ instructorId: new ObjectId(instructorId) })
            .sort({ date: -1, day: 1, startTime: 1 })
            .toArray();
    }

    /**
     * Get schedules for an instructor by date range
     * @param {String} instructorId - Instructor ID
     * @param {Date} startDate - Start date
     * @param {Date} endDate - End date
     * @returns {Promise<Array>} Array of schedule slots
     */
    async findByInstructorAndDateRange(instructorId, startDate, endDate) {
        return await this.collection
            .find({
                instructorId: new ObjectId(instructorId),
                date: {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                }
            })
            .sort({ date: 1, startTime: 1 })
            .toArray();
    }

    /**
     * Get schedule for a specific instructor and date
     * @param {String} instructorId - Instructor ID
     * @param {Date} date - Specific date
     * @returns {Promise<Array>} Array of schedule slots for that date
     */
    async findByInstructorAndDate(instructorId, date) {
        const searchDate = new Date(date);
        searchDate.setHours(0, 0, 0, 0);
        
        const nextDate = new Date(searchDate);
        nextDate.setDate(nextDate.getDate() + 1);
        
        return await this.collection
            .find({
                instructorId: new ObjectId(instructorId),
                date: {
                    $gte: searchDate,
                    $lt: nextDate
                }
            })
            .sort({ startTime: 1 })
            .toArray();
    }

    /**
     * Check for overlapping schedules
     * @param {String} instructorId - Instructor ID
     * @param {String|Date} dateOrDay - Specific date or day of week
     * @param {String} startTime - Start time
     * @param {String} endTime - End time
     * @param {String} excludeId - Schedule ID to exclude from check
     * @returns {Promise<Boolean>} True if overlap exists
     */
    async checkOverlap(instructorId, dateOrDay, startTime, endTime, excludeId = null) {
        const query = {
            instructorId: new ObjectId(instructorId),
            $or: [
                {
                    startTime: { $lt: endTime },
                    endTime: { $gt: startTime }
                }
            ]
        };

        // Check if it's a date or day
        if (dateOrDay instanceof Date || /^\d{4}-\d{2}-\d{2}/.test(dateOrDay)) {
            // It's a date
            const searchDate = new Date(dateOrDay);
            searchDate.setHours(0, 0, 0, 0);
            const nextDate = new Date(searchDate);
            nextDate.setDate(nextDate.getDate() + 1);
            
            query.date = {
                $gte: searchDate,
                $lt: nextDate
            };
        } else {
            // It's a day of week
            query.day = dateOrDay;
        }

        if (excludeId) {
            query._id = { $ne: new ObjectId(excludeId) };
        }

        const overlap = await this.collection.findOne(query);
        return overlap !== null;
    }

    /**
     * Update schedule
     * @param {String} id - Schedule ID
     * @param {Object} updateData - Data to update
     * @returns {Promise<Object>} Updated schedule
     */
    async update(id, updateData) {
        const updates = { ...updateData };
        
        if (updates.instructorId) {
            updates.instructorId = new ObjectId(updates.instructorId);
        }

        if (updates.effectiveFrom) {
            updates.effectiveFrom = new Date(updates.effectiveFrom);
        }

        if (updates.effectiveTo) {
            updates.effectiveTo = new Date(updates.effectiveTo);
        }

        updates.updatedAt = new Date();

        const result = await this.collection.findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: updates },
            { returnDocument: 'after' }
        );

        return result;
    }

    /**
     * Delete schedule
     * @param {String} id - Schedule ID
     * @returns {Promise<Boolean>} Success status
     */
    async delete(id) {
        const result = await this.collection.deleteOne({ _id: new ObjectId(id) });
        return result.deletedCount > 0;
    }

    /**
     * Delete all schedules for an instructor
     * @param {String} instructorId - Instructor ID
     * @returns {Promise<Number>} Number of deleted schedules
     */
    async deleteByInstructor(instructorId) {
        const result = await this.collection.deleteMany({
            instructorId: new ObjectId(instructorId)
        });
        return result.deletedCount;
    }
}

module.exports = Schedule;
