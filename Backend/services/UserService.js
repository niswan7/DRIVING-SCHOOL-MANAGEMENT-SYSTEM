/**
 * User Service
 * Business logic for user operations
 */
class UserService {
    constructor(userModel, notificationModel) {
        this.userModel = userModel;
        this.notificationModel = notificationModel;
    }

    /**
     * Register a new user
     * @param {Object} userData - User data
     * @returns {Promise<Object>} Created user
     */
    async register(userData) {
        try {
            const user = await this.userModel.create(userData);
            
            // Create welcome notification
            if (this.notificationModel) {
                await this.notificationModel.create({
                    userId: user._id,
                    title: 'Welcome to Driving School!',
                    message: `Welcome ${user.firstName}! Your account has been created successfully.`,
                    type: 'success'
                });
            }

            return user;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Login user
     * @param {String} identifier - Email or username
     * @param {String} password - Password
     * @returns {Promise<Object>} User and token
     */
    async login(identifier, password) {
        return await this.userModel.authenticate(identifier, password);
    }

    /**
     * Get user by ID
     * @param {String} userId - User ID
     * @returns {Promise<Object>} User object
     */
    async getUserById(userId) {
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        delete user.password;
        return user;
    }

    /**
     * Get all users
     * @param {Object} filters - Query filters
     * @returns {Promise<Array>} Array of users
     */
    async getAllUsers(filters = {}) {
        return await this.userModel.findAll(filters);
    }

    /**
     * Update user profile
     * @param {String} userId - User ID
     * @param {Object} updateData - Data to update
     * @returns {Promise<Object>} Updated user
     */
    async updateUser(userId, updateData) {
        const result = await this.userModel.update(userId, updateData);
        if (!result) {
            throw new Error('User not found');
        }
        return result;
    }

    /**
     * Change user password
     * @param {String} userId - User ID
     * @param {String} oldPassword - Current password
     * @param {String} newPassword - New password
     */
    async changePassword(userId, oldPassword, newPassword) {
        await this.userModel.updatePassword(userId, oldPassword, newPassword);
    }

    /**
     * Delete user
     * @param {String} userId - User ID
     * @returns {Promise<Boolean>} Success status
     */
    async deleteUser(userId) {
        const deleted = await this.userModel.delete(userId);
        if (!deleted) {
            throw new Error('User not found');
        }
        return true;
    }

    /**
     * Get users by role
     * @param {String} role - User role
     * @returns {Promise<Array>} Array of users
     */
    async getUsersByRole(role) {
        return await this.userModel.findAll({ role });
    }

    /**
     * Get students assigned to an instructor
     * @param {String} instructorId - Instructor's ID
     * @returns {Promise<Array>} Array of student users
     */
    async getStudentsByInstructor(instructorId) {
        // This logic assumes that a student is "assigned" to an instructor
        // if they have a shared lesson. A more direct relationship could be
        // modeled if required.
        return await this.userModel.findStudentsByInstructor(instructorId);
    }

    /**
     * Enroll a student in a course
     * @param {String} userId - User ID
     * @param {String} courseId - Course ID
     * @returns {Promise<Object>} Updated user
     */
    async enrollInCourse(userId, courseId) {
        const result = await this.userModel.enrollInCourse(userId, courseId);
        
        // Create notification for enrollment
        if (this.notificationModel && result) {
            await this.notificationModel.create({
                userId: result._id,
                title: 'Course Enrollment Successful',
                message: 'You have been successfully enrolled in a new course.',
                type: 'success'
            });
        }

        return result;
    }

    /**
     * Unenroll a student from a course
     * @param {String} userId - User ID
     * @param {String} courseId - Course ID
     * @returns {Promise<Object>} Updated user
     */
    async unenrollFromCourse(userId, courseId) {
        return await this.userModel.unenrollFromCourse(userId, courseId);
    }

    /**
     * Get user's enrolled courses with details
     * @param {String} userId - User ID
     * @returns {Promise<Array>} Array of courses
     */
    async getEnrolledCourses(userId) {
        return await this.userModel.getEnrolledCoursesWithDetails(userId);
    }
}

module.exports = UserService;