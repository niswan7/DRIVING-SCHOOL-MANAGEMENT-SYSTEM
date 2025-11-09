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
            day: scheduleData.day, // Monday, Tuesday, etc.
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
            .sort({ day: 1, startTime: 1 })
            .toArray();
    }

    /**
     * Check for overlapping schedules
     * @param {String} instructorId - Instructor ID
     * @param {String} day - Day of week
     * @param {String} startTime - Start time
     * @param {String} endTime - End time
     * @param {String} excludeId - Schedule ID to exclude from check
     * @returns {Promise<Boolean>} True if overlap exists
     */
    async checkOverlap(instructorId, day, startTime, endTime, excludeId = null) {
        const query = {
            instructorId: new ObjectId(instructorId),
            day: day,
            $or: [
                {
                    startTime: { $lt: endTime },
                    endTime: { $gt: startTime }
                }
            ]
        };

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
