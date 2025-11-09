const { ObjectId } = require('mongodb');

/**
 * Feedback Model
 * Handles feedback and reviews
 */
class Feedback {
    constructor(db) {
        this.collection = db.collection('feedback');
        this.createIndexes();
    }

    /**
     * Create database indexes
     */
    async createIndexes() {
        try {
            await this.collection.createIndex({ instructorId: 1, createdAt: -1 });
            await this.collection.createIndex({ studentId: 1 });
        } catch (error) {
            console.error('Error creating indexes:', error);
        }
    }

    /**
     * Create feedback
     * @param {Object} feedbackData - Feedback data
     * @returns {Promise<Object>} Created feedback
     */
    async create(feedbackData) {
        const feedback = {
            studentId: new ObjectId(feedbackData.studentId),
            instructorId: new ObjectId(feedbackData.instructorId),
            lessonId: feedbackData.lessonId ? new ObjectId(feedbackData.lessonId) : null,
            rating: feedbackData.rating, // 1-5
            comment: feedbackData.comment || '',
            isAnonymous: feedbackData.isAnonymous || false,
            status: 'active', // active, archived
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await this.collection.insertOne(feedback);
        feedback._id = result.insertedId;
        return feedback;
    }

    /**
     * Find feedback by ID
     * @param {String} id - Feedback ID
     * @returns {Promise<Object>} Feedback object
     */
    async findById(id) {
        return await this.collection.findOne({ _id: new ObjectId(id) });
    }

    /**
     * Get all feedback for an instructor
     * @param {String} instructorId - Instructor ID
     * @returns {Promise<Array>} Array of feedback
     */
    async findByInstructor(instructorId) {
        return await this.collection
            .find({ instructorId: new ObjectId(instructorId) })
            .sort({ createdAt: -1 })
            .toArray();
    }

    /**
     * Get all feedback by a student
     * @param {String} studentId - Student ID
     * @returns {Promise<Array>} Array of feedback
     */
    async findByStudent(studentId) {
        return await this.collection
            .find({ studentId: new ObjectId(studentId) })
            .sort({ createdAt: -1 })
            .toArray();
    }

    /**
     * Get instructor rating summary
     * @param {String} instructorId - Instructor ID
     * @returns {Promise<Object>} Rating summary
     */
    async getInstructorSummary(instructorId) {
        const feedbacks = await this.findByInstructor(instructorId);
        
        if (feedbacks.length === 0) {
            return {
                averageRating: 0,
                totalReviews: 0,
                ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
            };
        }

        const totalRating = feedbacks.reduce((sum, f) => sum + f.rating, 0);
        const avgRating = totalRating / feedbacks.length;

        const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        feedbacks.forEach(f => {
            distribution[f.rating]++;
        });

        return {
            averageRating: Math.round(avgRating * 10) / 10,
            totalReviews: feedbacks.length,
            ratingDistribution: distribution,
            recentFeedback: feedbacks.slice(0, 5)
        };
    }

    /**
     * Get all feedback with filters
     * @param {Object} filters - Query filters
     * @returns {Promise<Array>} Array of feedback
     */
    async findAll(filters = {}) {
        const query = {};

        if (filters.instructorId) {
            query.instructorId = new ObjectId(filters.instructorId);
        }

        if (filters.studentId) {
            query.studentId = new ObjectId(filters.studentId);
        }

        if (filters.rating) {
            query.rating = parseInt(filters.rating);
        }

        return await this.collection
            .find(query)
            .sort({ createdAt: -1 })
            .toArray();
    }

    /**
     * Update feedback
     * @param {String} id - Feedback ID
     * @param {Object} updateData - Data to update
     * @returns {Promise<Object>} Updated feedback
     */
    async update(id, updateData) {
        const updates = { ...updateData };
        updates.updatedAt = new Date();

        const result = await this.collection.findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: updates },
            { returnDocument: 'after' }
        );

        return result;
    }

    /**
     * Delete feedback
     * @param {String} id - Feedback ID
     * @returns {Promise<Boolean>} Success status
     */
    async delete(id) {
        const result = await this.collection.deleteOne({ _id: new ObjectId(id) });
        return result.deletedCount > 0;
    }
}

module.exports = Feedback;
