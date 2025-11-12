const { ObjectId } = require('mongodb');

/**
 * Lesson Model
 * Handles lesson data operations
 */
class Lesson {
    constructor(db) {
        this.collection = db.collection('lessons');
        this.createIndexes();
    }

    /**
     * Create database indexes
     */
    async createIndexes() {
        try {
            await this.collection.createIndex({ instructorId: 1, date: 1 });
            await this.collection.createIndex({ studentId: 1, date: 1 });
            await this.collection.createIndex({ status: 1 });
        } catch (error) {
            console.error('Error creating indexes:', error);
        }
    }

    /**
     * Create a new lesson
     * @param {Object} lessonData - Lesson data
     * @returns {Promise<Object>} Created lesson
     */
    async create(lessonData) {
        const lesson = {
            instructorId: new ObjectId(lessonData.instructorId),
            studentId: lessonData.studentId ? new ObjectId(lessonData.studentId) : null,
            date: new Date(lessonData.date),
            time: lessonData.time,
            duration: lessonData.duration || 60, // Default 60 minutes
            type: lessonData.type || 'practical', // practical, theory
            status: lessonData.status || 'scheduled', // scheduled, completed, cancelled, in-progress
            notes: lessonData.notes || '',
            location: lessonData.location || '',
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await this.collection.insertOne(lesson);
        lesson._id = result.insertedId;
        return lesson;
    }

    /**
     * Find lesson by ID
     * @param {String} id - Lesson ID
     * @returns {Promise<Object>} Lesson object
     */
    async findById(id) {
        return await this.collection.findOne({ _id: new ObjectId(id) });
    }

    /**
     * Get lessons with filters
     * @param {Object} filters - Query filters
     * @returns {Promise<Array>} Array of lessons
     */
    async findAll(filters = {}) {
        const query = {};

        if (filters.instructorId) {
            query.instructorId = new ObjectId(filters.instructorId);
        }

        if (filters.studentId) {
            query.studentId = new ObjectId(filters.studentId);
        }

        if (filters.status) {
            query.status = filters.status;
        }

        if (filters.dateFrom) {
            query.date = { $gte: new Date(filters.dateFrom) };
        }

        if (filters.dateTo) {
            query.date = { ...query.date, $lte: new Date(filters.dateTo) };
        }

        const lessons = await this.collection
            .find(query)
            .sort({ date: -1, time: 1 })
            .toArray();

        return lessons;
    }

    /**
     * Update lesson
     * @param {String} id - Lesson ID
     * @param {Object} updateData - Data to update
     * @returns {Promise<Object>} Updated lesson
     */
    async update(id, updateData) {
        const updates = { ...updateData };
        
        if (updates.date) {
            updates.date = new Date(updates.date);
        }

        if (updates.instructorId) {
            updates.instructorId = new ObjectId(updates.instructorId);
        }

        if (updates.studentId) {
            updates.studentId = new ObjectId(updates.studentId);
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
     * Delete lesson
     * @param {String} id - Lesson ID
     * @returns {Promise<Boolean>} Success status
     */
    async delete(id) {
        const result = await this.collection.deleteOne({ _id: new ObjectId(id) });
        return result.deletedCount > 0;
    }

    /**
     * Get upcoming lessons for instructor
     * @param {String} instructorId - Instructor ID
     * @returns {Promise<Array>} Array of upcoming lessons
     */
    async getUpcomingByInstructor(instructorId) {
        const now = new Date();
        
        return await this.collection
            .find({
                instructorId: new ObjectId(instructorId),
                date: { $gte: now },
                status: { $in: ['scheduled', 'in-progress'] }
            })
            .sort({ date: 1, time: 1 })
            .toArray();
    }

    /**
     * Get upcoming lessons for student
     * @param {String} studentId - Student ID
     * @returns {Promise<Array>} Array of upcoming lessons
     */
    async getUpcomingByStudent(studentId) {
        const now = new Date();
        
        return await this.collection
            .find({
                studentId: new ObjectId(studentId),
                date: { $gte: now },
                status: { $in: ['scheduled', 'in-progress'] }
            })
            .sort({ date: 1, time: 1 })
            .toArray();
    }
}

module.exports = Lesson;
