/**
 * Assessment Service
 * Business logic for assessment operations
 */
class AssessmentService {
    constructor(assessmentModel, notificationModel) {
        this.assessmentModel = assessmentModel;
        this.notificationModel = notificationModel;
    }

    /**
     * Create a new assessment
     * @param {Object} assessmentData - Assessment data
     * @returns {Promise<Object>} Created assessment
     */
    async createAssessment(assessmentData) {
        console.log('AssessmentService.createAssessment called with:', assessmentData);
        const assessment = await this.assessmentModel.create(assessmentData);
        console.log('Assessment created in service:', assessment);

        // Send notification to student
        if (this.notificationModel && assessmentData.studentId) {
            await this.notificationModel.create({
                userId: assessmentData.studentId,
                title: 'New Assessment Assigned',
                message: `A new assessment "${assessmentData.title}" has been assigned. Due date: ${new Date(assessmentData.dueDate).toLocaleDateString()}`,
                type: 'info',
                metadata: { assessmentId: assessment._id }
            });
        }

        return assessment;
    }

    /**
     * Get assessment by ID
     * @param {String} assessmentId - Assessment ID
     * @returns {Promise<Object>} Assessment object
     */
    async getAssessmentById(assessmentId) {
        const assessment = await this.assessmentModel.findById(assessmentId);
        if (!assessment) {
            throw new Error('Assessment not found');
        }
        return assessment;
    }

    /**
     * Get all assessments
     * @param {Object} filters - Query filters
     * @returns {Promise<Array>} Array of assessments
     */
    async getAllAssessments(filters = {}) {
        return await this.assessmentModel.findAll(filters);
    }

    /**
     * Get upcoming assessments for student
     * @param {String} studentId - Student ID
     * @returns {Promise<Array>} Array of upcoming assessments
     */
    async getUpcomingAssessmentsForStudent(studentId) {
        // Update overdue assessments first
        await this.assessmentModel.updateOverdueAssessments();
        return await this.assessmentModel.getUpcomingByStudent(studentId);
    }

    /**
     * Get assessments by student and course
     * @param {String} studentId - Student ID
     * @param {String} courseId - Course ID
     * @returns {Promise<Array>} Array of assessments
     */
    async getAssessmentsByStudentAndCourse(studentId, courseId) {
        return await this.assessmentModel.getByStudentAndCourse(studentId, courseId);
    }

    /**
     * Update assessment
     * @param {String} assessmentId - Assessment ID
     * @param {Object} updateData - Data to update
     * @returns {Promise<Object>} Updated assessment
     */
    async updateAssessment(assessmentId, updateData) {
        const result = await this.assessmentModel.update(assessmentId, updateData);
        if (!result) {
            throw new Error('Assessment not found');
        }
        return result;
    }

    /**
     * Update assessment score
     * @param {String} assessmentId - Assessment ID
     * @param {Number} score - Score value
     * @param {String} feedback - Optional feedback
     * @returns {Promise<Object>} Updated assessment
     */
    async updateAssessmentScore(assessmentId, score, feedback = '') {
        const assessment = await this.assessmentModel.findById(assessmentId);
        if (!assessment) {
            throw new Error('Assessment not found');
        }

        const result = await this.assessmentModel.updateScore(assessmentId, score, feedback);

        // Notify student about grading
        if (this.notificationModel && assessment.studentId) {
            await this.notificationModel.create({
                userId: assessment.studentId,
                title: 'Assessment Graded',
                message: `Your assessment "${assessment.title}" has been graded. Score: ${score}/${assessment.maxScore}`,
                type: 'success',
                metadata: { assessmentId: assessment._id }
            });
        }

        return result;
    }

    /**
     * Mark assessment as completed (submitted by student for review)
     * @param {String} assessmentId - Assessment ID
     * @returns {Promise<Object>} Updated assessment
     */
    async completeAssessment(assessmentId) {
        const updateData = {
            status: 'in-progress',
            completionDate: new Date()
        };
        return await this.assessmentModel.update(assessmentId, updateData);
    }

    /**
     * Delete assessment
     * @param {String} assessmentId - Assessment ID
     * @returns {Promise<Boolean>} Success status
     */
    async deleteAssessment(assessmentId) {
        const deleted = await this.assessmentModel.delete(assessmentId);
        if (!deleted) {
            throw new Error('Assessment not found');
        }
        return true;
    }

    /**
     * Get assessment statistics for a student
     * @param {String} studentId - Student ID
     * @param {String} courseId - Optional course ID
     * @returns {Promise<Object>} Statistics object
     */
    async getStudentStats(studentId, courseId = null) {
        return await this.assessmentModel.getStudentStats(studentId, courseId);
    }
}

module.exports = AssessmentService;
