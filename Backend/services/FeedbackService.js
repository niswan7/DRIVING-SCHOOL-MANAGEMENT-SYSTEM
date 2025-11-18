/**
 * Feedback Service
 * Business logic for feedback operations
 */
class FeedbackService {
    constructor(feedbackModel, notificationModel) {
        this.feedbackModel = feedbackModel;
        this.notificationModel = notificationModel;
    }

    /**
     * Create feedback
     * @param {Object} feedbackData - Feedback data
     * @returns {Promise<Object>} Created feedback
     */
    async createFeedback(feedbackData) {
        const feedback = await this.feedbackModel.create(feedbackData);

        // Notify instructor about new feedback
        if (this.notificationModel) {
            await this.notificationModel.create({
                userId: feedbackData.instructorId,
                title: 'New Feedback Received',
                message: `You received a new ${feedbackData.rating}-star rating`,
                type: 'info',
                metadata: { feedbackId: feedback._id }
            });
        }

        return feedback;
    }

    /**
     * Get feedback by ID
     * @param {String} feedbackId - Feedback ID
     * @returns {Promise<Object>} Feedback object
     */
    async getFeedbackById(feedbackId) {
        const feedback = await this.feedbackModel.findById(feedbackId);
        if (!feedback) {
            throw new Error('Feedback not found');
        }
        return feedback;
    }

    /**
     * Get all feedback for an instructor
     * @param {String} instructorId - Instructor ID
     * @returns {Promise<Array>} Array of feedback
     */
    async getInstructorFeedback(instructorId) {
        return await this.feedbackModel.findByInstructor(instructorId);
    }

    /**
     * Get instructor rating summary
     * @param {String} instructorId - Instructor ID
     * @returns {Promise<Object>} Rating summary
     */
    async getInstructorRating(instructorId) {
        return await this.feedbackModel.getInstructorSummary(instructorId);
    }

    /**
     * Get all feedback by a student
     * @param {String} studentId - Student ID
     * @returns {Promise<Array>} Array of feedback
     */
    async getStudentFeedback(studentId) {
        return await this.feedbackModel.findByStudent(studentId);
    }

    /**
     * Get all feedback with filters
     * @param {Object} filters - Query filters
     * @returns {Promise<Array>} Array of feedback
     */
    async getAllFeedback(filters = {}) {
        return await this.feedbackModel.findAll(filters);
    }

    /**
     * Update feedback
     * @param {String} feedbackId - Feedback ID
     * @param {Object} updateData - Data to update
     * @returns {Promise<Object>} Updated feedback
     */
    async updateFeedback(feedbackId, updateData) {
        const result = await this.feedbackModel.update(feedbackId, updateData);
        if (!result) {
            throw new Error('Feedback not found');
        }
        return result;
    }

    /**
     * Delete feedback
     * @param {String} feedbackId - Feedback ID
     * @returns {Promise<Boolean>} Success status
     */
    async deleteFeedback(feedbackId) {
        const deleted = await this.feedbackModel.delete(feedbackId);
        if (!deleted) {
            throw new Error('Feedback not found');
        }
        return true;
    }
}

module.exports = FeedbackService;
