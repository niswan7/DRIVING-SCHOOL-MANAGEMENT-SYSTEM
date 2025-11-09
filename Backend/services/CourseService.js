/**
 * Course Service
 * Business logic for course operations
 */
class CourseService {
    constructor(courseModel) {
        this.courseModel = courseModel;
    }

    /**
     * Create a new course
     * @param {Object} courseData - Course data
     * @returns {Promise<Object>} Created course
     */
    async createCourse(courseData) {
        return await this.courseModel.create(courseData);
    }

    /**
     * Get course by ID
     * @param {String} courseId - Course ID
     * @returns {Promise<Object>} Course object
     */
    async getCourseById(courseId) {
        const course = await this.courseModel.findById(courseId);
        if (!course) {
            throw new Error('Course not found');
        }
        return course;
    }

    /**
     * Get all courses
     * @param {Object} filters - Query filters
     * @returns {Promise<Array>} Array of courses
     */
    async getAllCourses(filters = {}) {
        return await this.courseModel.findAll(filters);
    }

    /**
     * Update course
     * @param {String} courseId - Course ID
     * @param {Object} updateData - Data to update
     * @returns {Promise<Object>} Updated course
     */
    async updateCourse(courseId, updateData) {
        const result = await this.courseModel.update(courseId, updateData);
        if (!result) {
            throw new Error('Course not found');
        }
        return result;
    }

    /**
     * Delete course
     * @param {String} courseId - Course ID
     * @returns {Promise<Boolean>} Success status
     */
    async deleteCourse(courseId) {
        const deleted = await this.courseModel.delete(courseId);
        if (!deleted) {
            throw new Error('Course not found');
        }
        return true;
    }
}

module.exports = CourseService;
