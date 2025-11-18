/**
 * Progress Service
 * Business logic for student progress tracking
 */
class ProgressService {
    constructor(progressModel, notificationModel) {
        this.progressModel = progressModel;
        this.notificationModel = notificationModel;
    }

    /**
     * Create progress record
     * @param {Object} progressData - Progress data
     * @returns {Promise<Object>} Created progress record
     */
    async createProgress(progressData) {
        const progress = await this.progressModel.create(progressData);

        // Notify student about progress update
        if (this.notificationModel) {
            await this.notificationModel.create({
                userId: progressData.studentId,
                title: 'Progress Updated',
                message: `Your instructor has updated your progress. Rating: ${progressData.rating}/5`,
                type: 'success',
                metadata: { progressId: progress._id }
            });
        }

        return progress;
    }

    /**
     * Get progress by ID
     * @param {String} progressId - Progress ID
     * @returns {Promise<Object>} Progress object
     */
    async getProgressById(progressId) {
        const progress = await this.progressModel.findById(progressId);
        if (!progress) {
            throw new Error('Progress record not found');
        }
        return progress;
    }

    /**
     * Get all progress for a student
     * @param {String} studentId - Student ID
     * @returns {Promise<Array>} Array of progress records
     */
    async getStudentProgress(studentId) {
        return await this.progressModel.findByStudent(studentId);
    }

    /**
     * Get student progress summary
     * @param {String} studentId - Student ID
     * @returns {Promise<Object>} Progress summary
     */
    async getStudentSummary(studentId) {
        return await this.progressModel.getStudentSummary(studentId);
    }

    /**
     * Update progress record
     * @param {String} progressId - Progress ID
     * @param {Object} updateData - Data to update
     * @returns {Promise<Object>} Updated progress
     */
    async updateProgress(progressId, updateData) {
        const result = await this.progressModel.update(progressId, updateData);
        if (!result) {
            throw new Error('Progress record not found');
        }
        return result;
    }

    /**
     * Delete progress record
     * @param {String} progressId - Progress ID
     * @returns {Promise<Boolean>} Success status
     */
    async deleteProgress(progressId) {
        const deleted = await this.progressModel.delete(progressId);
        if (!deleted) {
            throw new Error('Progress record not found');
        }
        return true;
    }
}

module.exports = ProgressService;
