/**
 * Feedback Controller
 * Handles HTTP requests for feedback operations
 */
class FeedbackController {
    constructor(feedbackService) {
        this.feedbackService = feedbackService;
    }

    /**
     * Create feedback
     * POST /api/feedback
     */
    async create(req, res) {
        try {
            const feedback = await this.feedbackService.createFeedback(req.body);
            res.status(201).json({
                success: true,
                data: feedback,
                message: 'Feedback submitted successfully'
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Get feedback by ID
     * GET /api/feedback/:id
     */
    async getById(req, res) {
        try {
            const feedback = await this.feedbackService.getFeedbackById(req.params.id);
            res.status(200).json({
                success: true,
                data: feedback
            });
        } catch (error) {
            res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Get instructor feedback
     * GET /api/feedback/instructor/:instructorId
     */
    async getInstructorFeedback(req, res) {
        try {
            const feedback = await this.feedbackService.getInstructorFeedback(req.params.instructorId);
            res.status(200).json({
                success: true,
                data: feedback,
                count: feedback.length
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Get instructor rating
     * GET /api/feedback/instructor/:instructorId/rating
     */
    async getInstructorRating(req, res) {
        try {
            const rating = await this.feedbackService.getInstructorRating(req.params.instructorId);
            res.status(200).json({
                success: true,
                data: rating
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Get student feedback
     * GET /api/feedback/student/:studentId
     */
    async getStudentFeedback(req, res) {
        try {
            const feedback = await this.feedbackService.getStudentFeedback(req.params.studentId);
            res.status(200).json({
                success: true,
                data: feedback,
                count: feedback.length
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Get all feedback
     * GET /api/feedback
     */
    async getAll(req, res) {
        try {
            const filters = {
                instructorId: req.query.instructorId,
                studentId: req.query.studentId,
                rating: req.query.rating
            };
            const feedback = await this.feedbackService.getAllFeedback(filters);
            res.status(200).json({
                success: true,
                data: feedback,
                count: feedback.length
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Update feedback
     * PUT /api/feedback/:id
     */
    async update(req, res) {
        try {
            const feedback = await this.feedbackService.updateFeedback(req.params.id, req.body);
            res.status(200).json({
                success: true,
                data: feedback,
                message: 'Feedback updated successfully'
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Delete feedback
     * DELETE /api/feedback/:id
     */
    async delete(req, res) {
        try {
            await this.feedbackService.deleteFeedback(req.params.id);
            res.status(200).json({
                success: true,
                message: 'Feedback deleted successfully'
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = FeedbackController;
