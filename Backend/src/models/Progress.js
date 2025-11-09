const { ObjectId } = require('mongodb');

/**
 * Progress Model
 * Handles student progress tracking
 */
class Progress {
    constructor(db) {
        this.collection = db.collection('progress');
        this.createIndexes();
    }

    /**
     * Create database indexes
     */
    async createIndexes() {
        try {
            await this.collection.createIndex({ studentId: 1 });
            await this.collection.createIndex({ lessonId: 1 }, { unique: true });
        } catch (error) {
            console.error('Error creating indexes:', error);
        }
    }

    /**
     * Create progress record
     * @param {Object} progressData - Progress data
     * @returns {Promise<Object>} Created progress record
     */
    async create(progressData) {
        const progress = {
            studentId: new ObjectId(progressData.studentId),
            lessonId: new ObjectId(progressData.lessonId),
            instructorId: new ObjectId(progressData.instructorId),
            rating: progressData.rating || 0, // 0-5
            skills: {
                steering: progressData.skills?.steering || 0,
                braking: progressData.skills?.braking || 0,
                parking: progressData.skills?.parking || 0,
                signaling: progressData.skills?.signaling || 0,
                awareness: progressData.skills?.awareness || 0
            },
            hoursCompleted: progressData.hoursCompleted || 1,
            notes: progressData.notes || '',
            strengths: progressData.strengths || [],
            areasForImprovement: progressData.areasForImprovement || [],
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await this.collection.insertOne(progress);
        progress._id = result.insertedId;
        return progress;
    }

    /**
     * Find progress by ID
     * @param {String} id - Progress ID
     * @returns {Promise<Object>} Progress object
     */
    async findById(id) {
        return await this.collection.findOne({ _id: new ObjectId(id) });
    }

    /**
     * Get all progress records for a student
     * @param {String} studentId - Student ID
     * @returns {Promise<Array>} Array of progress records
     */
    async findByStudent(studentId) {
        return await this.collection
            .find({ studentId: new ObjectId(studentId) })
            .sort({ createdAt: -1 })
            .toArray();
    }

    /**
     * Get progress summary for a student
     * @param {String} studentId - Student ID
     * @returns {Promise<Object>} Progress summary
     */
    async getStudentSummary(studentId) {
        const records = await this.findByStudent(studentId);
        
        if (records.length === 0) {
            return {
                totalHours: 0,
                averageRating: 0,
                skillAverages: {},
                totalLessons: 0
            };
        }

        const totalHours = records.reduce((sum, r) => sum + (r.hoursCompleted || 0), 0);
        const avgRating = records.reduce((sum, r) => sum + (r.rating || 0), 0) / records.length;

        const skillAverages = {
            steering: 0,
            braking: 0,
            parking: 0,
            signaling: 0,
            awareness: 0
        };

        Object.keys(skillAverages).forEach(skill => {
            const sum = records.reduce((acc, r) => acc + (r.skills?.[skill] || 0), 0);
            skillAverages[skill] = sum / records.length;
        });

        return {
            totalHours,
            averageRating: Math.round(avgRating * 10) / 10,
            skillAverages,
            totalLessons: records.length,
            recentProgress: records.slice(0, 5)
        };
    }

    /**
     * Update progress record
     * @param {String} id - Progress ID
     * @param {Object} updateData - Data to update
     * @returns {Promise<Object>} Updated progress
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
     * Delete progress record
     * @param {String} id - Progress ID
     * @returns {Promise<Boolean>} Success status
     */
    async delete(id) {
        const result = await this.collection.deleteOne({ _id: new ObjectId(id) });
        return result.deletedCount > 0;
    }
}

module.exports = Progress;
