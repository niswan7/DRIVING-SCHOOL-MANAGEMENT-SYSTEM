/**
 * Course Controller
 * Handles HTTP requests for course operations
 */
class CourseController {
    constructor(courseService) {
        this.courseService = courseService;
    }

    /**
     * Create course
     * POST /api/courses
     */
    async create(req, res) {
        try {
            const course = await this.courseService.createCourse(req.body);
            res.status(201).json({
                success: true,
                data: course,
                message: 'Course created successfully'
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Get all courses
     * GET /api/courses
     */
    async getAll(req, res) {
        try {
            const filters = {
                status: req.query.status,
                type: req.query.type
            };
            const courses = await this.courseService.getAllCourses(filters);
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

    /**
     * Get course by ID
     * GET /api/courses/:id
     */
    async getById(req, res) {
        try {
            const course = await this.courseService.getCourseById(req.params.id);
            res.status(200).json({
                success: true,
                data: course
            });
        } catch (error) {
            res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Update course
     * PUT /api/courses/:id
     */
    async update(req, res) {
        try {
            const course = await this.courseService.updateCourse(req.params.id, req.body);
            res.status(200).json({
                success: true,
                data: course,
                message: 'Course updated successfully'
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Delete course
     * DELETE /api/courses/:id
     */
    async delete(req, res) {
        try {
            await this.courseService.deleteCourse(req.params.id);
            res.status(200).json({
                success: true,
                message: 'Course deleted successfully'
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = CourseController;
