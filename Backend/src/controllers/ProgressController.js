/**
 * Progress Controller
 * Handles HTTP requests for progress tracking
 */
class ProgressController {
    constructor(progressService) {
        this.progressService = progressService;
    }

    /**
     * Create progress record
     * POST /api/progress
     */
    async create(req, res) {
        try {
            const progress = await this.progressService.createProgress(req.body);
            res.status(201).json({
                success: true,
                data: progress,
                message: 'Progress recorded successfully'
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Get progress by ID
     * GET /api/progress/:id
     */
    async getById(req, res) {
        try {
            const progress = await this.progressService.getProgressById(req.params.id);
            res.status(200).json({
                success: true,
                data: progress
            });
        } catch (error) {
            res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Get student progress
     * GET /api/progress/student/:studentId
     */
    async getStudentProgress(req, res) {
        try {
            const progress = await this.progressService.getStudentProgress(req.params.studentId);
            res.status(200).json({
                success: true,
                data: progress,
                count: progress.length
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Get student progress summary
     * GET /api/progress/student/:studentId/summary
     */
    async getStudentSummary(req, res) {
        try {
            const summary = await this.progressService.getStudentSummary(req.params.studentId);
            res.status(200).json({
                success: true,
                data: summary
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Update progress
     * PUT /api/progress/:id
     */
    async update(req, res) {
        try {
            const progress = await this.progressService.updateProgress(req.params.id, req.body);
            res.status(200).json({
                success: true,
                data: progress,
                message: 'Progress updated successfully'
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Delete progress
     * DELETE /api/progress/:id
     */
    async delete(req, res) {
        try {
            await this.progressService.deleteProgress(req.params.id);
            res.status(200).json({
                success: true,
                message: 'Progress deleted successfully'
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = ProgressController;
