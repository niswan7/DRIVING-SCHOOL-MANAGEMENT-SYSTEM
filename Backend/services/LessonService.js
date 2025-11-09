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
}

module.exports = LessonService;
