/**
 * Assessment Controller
 * Handles HTTP requests for assessment operations
 */
class AssessmentController {
    constructor(assessmentService) {
        this.assessmentService = assessmentService;
    }

    /**
     * Create a new assessment
     * POST /api/assessments
     */
    async create(req, res) {
        try {
            console.log('Creating assessment with data:', req.body);
            const assessment = await this.assessmentService.createAssessment(req.body);
            console.log('Assessment created successfully:', assessment);
            res.status(201).json({
                success: true,
                data: assessment,
                message: 'Assessment created successfully'
            });
        } catch (error) {
            console.error('Error creating assessment:', error);
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Get all assessments
     * GET /api/assessments
     */
    async getAll(req, res) {
        try {
            const filters = {
                studentId: req.query.studentId,
                instructorId: req.query.instructorId,
                courseId: req.query.courseId,
                status: req.query.status
            };
            const assessments = await this.assessmentService.getAllAssessments(filters);
            res.status(200).json({
                success: true,
                data: assessments,
                count: assessments.length
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Get assessment by ID
     * GET /api/assessments/:id
     */
    async getById(req, res) {
        try {
            const assessment = await this.assessmentService.getAssessmentById(req.params.id);
            res.status(200).json({
                success: true,
                data: assessment
            });
        } catch (error) {
            res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Get upcoming assessments for student
     * GET /api/assessments/student/:studentId/upcoming
     */
    async getUpcomingForStudent(req, res) {
        try {
            const assessments = await this.assessmentService.getUpcomingAssessmentsForStudent(req.params.studentId);
            res.status(200).json({
                success: true,
                data: assessments,
                count: assessments.length
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Get assessments by student and course
     * GET /api/assessments/student/:studentId/course/:courseId
     */
    async getByStudentAndCourse(req, res) {
        try {
            const { studentId, courseId } = req.params;
            const assessments = await this.assessmentService.getAssessmentsByStudentAndCourse(studentId, courseId);
            res.status(200).json({
                success: true,
                data: assessments,
                count: assessments.length
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Update assessment
     * PUT /api/assessments/:id
     */
    async update(req, res) {
        try {
            const assessment = await this.assessmentService.updateAssessment(req.params.id, req.body);
            res.status(200).json({
                success: true,
                data: assessment,
                message: 'Assessment updated successfully'
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Update assessment score
     * PATCH /api/assessments/:id/score
     */
    async updateScore(req, res) {
        try {
            const { score, feedback } = req.body;
            const assessment = await this.assessmentService.updateAssessmentScore(req.params.id, score, feedback);
            res.status(200).json({
                success: true,
                data: assessment,
                message: 'Assessment score updated successfully'
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Mark assessment as submitted (student submits for review)
     * POST /api/assessments/:id/complete
     */
    async complete(req, res) {
        try {
            const assessment = await this.assessmentService.completeAssessment(req.params.id);
            res.status(200).json({
                success: true,
                data: assessment,
                message: 'Assessment submitted for review'
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Delete assessment
     * DELETE /api/assessments/:id
     */
    async delete(req, res) {
        try {
            await this.assessmentService.deleteAssessment(req.params.id);
            res.status(200).json({
                success: true,
                message: 'Assessment deleted successfully'
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Get student assessment statistics
     * GET /api/assessments/student/:studentId/stats
     */
    async getStudentStats(req, res) {
        try {
            const { studentId } = req.params;
            const { courseId } = req.query;
            const stats = await this.assessmentService.getStudentStats(studentId, courseId);
            res.status(200).json({
                success: true,
                data: stats
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = AssessmentController;
