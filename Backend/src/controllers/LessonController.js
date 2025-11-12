/**
 * Lesson Controller
 * Handles HTTP requests for lesson operations
 */
class LessonController {
    constructor(lessonService) {
        this.lessonService = lessonService;
    }

    /**
     * Create a new lesson
     * POST /api/lessons
     */
    async create(req, res) {
        try {
            const lesson = await this.lessonService.createLesson(req.body);
            res.status(201).json({
                success: true,
                data: lesson,
                message: 'Lesson created successfully'
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Get all lessons
     * GET /api/lessons
     */
    async getAll(req, res) {
        try {
            const filters = {
                instructorId: req.query.instructorId,
                studentId: req.query.studentId,
                status: req.query.status,
                dateFrom: req.query.dateFrom,
                dateTo: req.query.dateTo
            };
            const lessons = await this.lessonService.getAllLessons(filters);
            res.status(200).json({
                success: true,
                data: lessons,
                count: lessons.length
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Get lesson by ID
     * GET /api/lessons/:id
     */
    async getById(req, res) {
        try {
            const lesson = await this.lessonService.getLessonById(req.params.id);
            res.status(200).json({
                success: true,
                data: lesson
            });
        } catch (error) {
            res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Get upcoming lessons for instructor
     * GET /api/lessons/instructor/:instructorId/upcoming
     */
    async getUpcomingForInstructor(req, res) {
        try {
            const lessons = await this.lessonService.getUpcomingLessonsForInstructor(req.params.instructorId);
            res.status(200).json({
                success: true,
                data: lessons,
                count: lessons.length
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Get upcoming lessons for student
     * GET /api/lessons/student/:studentId/upcoming
     */
    async getUpcomingForStudent(req, res) {
        try {
            const lessons = await this.lessonService.getUpcomingLessonsForStudent(req.params.studentId);
            res.status(200).json({
                success: true,
                data: lessons,
                count: lessons.length
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Get all lessons for an instructor
     * GET /api/lessons/instructor/:instructorId
     */
    async getInstructorLessons(req, res) {
        try {
            const lessons = await this.lessonService.getLessonsByInstructor(req.params.instructorId);
            res.status(200).json({
                success: true,
                data: lessons,
                count: lessons.length
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Update lesson
     * PUT /api/lessons/:id
     */
    async update(req, res) {
        try {
            const lesson = await this.lessonService.updateLesson(req.params.id, req.body);
            res.status(200).json({
                success: true,
                data: lesson,
                message: 'Lesson updated successfully'
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Complete lesson
     * POST /api/lessons/:id/complete
     */
    async complete(req, res) {
        try {
            const lesson = await this.lessonService.completeLesson(req.params.id, req.body);
            res.status(200).json({
                success: true,
                data: lesson,
                message: 'Lesson marked as completed'
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Delete lesson
     * DELETE /api/lessons/:id
     */
    async delete(req, res) {
        try {
            await this.lessonService.deleteLesson(req.params.id);
            res.status(200).json({
                success: true,
                message: 'Lesson deleted successfully'
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Get instructor availability for a specific date
     * GET /api/lessons/availability/:instructorId/:date
     */
    async getAvailability(req, res) {
        try {
            const { instructorId, date } = req.params;
            const availability = await this.lessonService.getInstructorAvailability(instructorId, date);
            res.status(200).json({
                success: true,
                data: availability
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Check time slot availability
     * POST /api/lessons/check-availability
     */
    async checkAvailability(req, res) {
        try {
            const { instructorId, date, time, duration } = req.body;
            const available = await this.lessonService.checkTimeSlotAvailability(
                instructorId,
                date,
                time,
                duration
            );
            res.status(200).json({
                success: true,
                data: { available }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = LessonController;
