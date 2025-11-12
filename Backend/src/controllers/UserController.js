/**
 * User Controller
 * Handles HTTP requests for user operations
 */
class UserController {
    constructor(userService) {
        this.userService = userService;
    }

    /**
     * Register a new user
     * POST /api/users/register
     */
    async register(req, res) {
        try {
            const user = await this.userService.register(req.body);
            res.status(201).json({
                success: true,
                data: user,
                message: 'User registered successfully'
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Login user
     * POST /api/users/login
     */
    async login(req, res) {
        try {
            const { username, password } = req.body;
            const result = await this.userService.login(username, password);
            res.status(200).json({
                success: true,
                data: result,
                message: 'Login successful'
            });
        } catch (error) {
            res.status(401).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Get all users
     * GET /api/users
     */
    async getAll(req, res) {
        try {
            const filters = {
                role: req.query.role,
                status: req.query.status,
                search: req.query.search
            };
            const users = await this.userService.getAllUsers(filters);
            res.status(200).json({
                success: true,
                data: users,
                count: users.length
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Get user by ID
     * GET /api/users/:id
     */
    async getById(req, res) {
        try {
            const user = await this.userService.getUserById(req.params.id);
            res.status(200).json({
                success: true,
                data: user
            });
        } catch (error) {
            res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Update user
     * PUT /api/users/:id
     */
    async update(req, res) {
        try {
            const user = await this.userService.updateUser(req.params.id, req.body);
            res.status(200).json({
                success: true,
                data: user,
                message: 'User updated successfully'
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Change password
     * POST /api/users/:id/change-password
     */
    async changePassword(req, res) {
        try {
            const { oldPassword, newPassword } = req.body;
            await this.userService.changePassword(req.params.id, oldPassword, newPassword);
            res.status(200).json({
                success: true,
                message: 'Password changed successfully'
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Delete user
     * DELETE /api/users/:id
     */
    async delete(req, res) {
        try {
            await this.userService.deleteUser(req.params.id);
            res.status(200).json({
                success: true,
                message: 'User deleted successfully'
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Get users by role
     * GET /api/users/role/:role
     */
    async getByRole(req, res) {
        try {
            const users = await this.userService.getUsersByRole(req.params.role);
            res.status(200).json({
                success: true,
                data: users,
                count: users.length
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Get students assigned to an instructor
     * GET /api/users/instructor/:instructorId/students
     */
    async getInstructorStudents(req, res) {
        try {
            const students = await this.userService.getStudentsByInstructor(req.params.instructorId);
            res.status(200).json({
                success: true,
                data: students,
                count: students.length
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Enroll a student in a course
     * POST /api/users/:id/enroll
     */
    async enrollInCourse(req, res) {
        try {
            const { courseId } = req.body;
            const user = await this.userService.enrollInCourse(req.params.id, courseId);
            res.status(200).json({
                success: true,
                data: user,
                message: 'Successfully enrolled in course'
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Unenroll a student from a course
     * POST /api/users/:id/unenroll
     */
    async unenrollFromCourse(req, res) {
        try {
            const { courseId } = req.body;
            const user = await this.userService.unenrollFromCourse(req.params.id, courseId);
            res.status(200).json({
                success: true,
                data: user,
                message: 'Successfully unenrolled from course'
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Get user's enrolled courses with details
     * GET /api/users/:id/enrolled-courses
     */
    async getEnrolledCourses(req, res) {
        try {
            const courses = await this.userService.getEnrolledCourses(req.params.id);
            res.status(200).json({
                success: true,
                data: courses,
                count: courses.length
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = UserController;