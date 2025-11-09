/**
 * Payment Controller
 * Handles HTTP requests for payment operations
 */
class PaymentController {
    constructor(paymentService) {
        this.paymentService = paymentService;
    }

    /**
     * Create payment
     * POST /api/payments
     */
    async create(req, res) {
        try {
            const payment = await this.paymentService.createPayment(req.body);
            res.status(201).json({
                success: true,
                data: payment,
                message: 'Payment created successfully'
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Get payment by ID
     * GET /api/payments/:id
     */
    async getById(req, res) {
        try {
            const payment = await this.paymentService.getPaymentById(req.params.id);
            res.status(200).json({
                success: true,
                data: payment
            });
        } catch (error) {
            res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Get all payments
     * GET /api/payments
     */
    async getAll(req, res) {
        try {
            const filters = {
                studentId: req.query.studentId,
                status: req.query.status,
                type: req.query.type,
                dateFrom: req.query.dateFrom,
                dateTo: req.query.dateTo
            };
            const payments = await this.paymentService.getAllPayments(filters);
            res.status(200).json({
                success: true,
                data: payments,
                count: payments.length
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Get student payments
     * GET /api/payments/student/:studentId
     */
    async getStudentPayments(req, res) {
        try {
            const payments = await this.paymentService.getStudentPayments(req.params.studentId);
            res.status(200).json({
                success: true,
                data: payments,
                count: payments.length
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Get student payment summary
     * GET /api/payments/student/:studentId/summary
     */
    async getStudentSummary(req, res) {
        try {
            const summary = await this.paymentService.getStudentPaymentSummary(req.params.studentId);
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
     * Update payment
     * PUT /api/payments/:id
     */
    async update(req, res) {
        try {
            const payment = await this.paymentService.updatePayment(req.params.id, req.body);
            res.status(200).json({
                success: true,
                data: payment,
                message: 'Payment updated successfully'
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Process payment
     * POST /api/payments/:id/process
     */
    async process(req, res) {
        try {
            const payment = await this.paymentService.processPayment(req.params.id, req.body);
            res.status(200).json({
                success: true,
                data: payment,
                message: 'Payment processed successfully'
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Delete payment
     * DELETE /api/payments/:id
     */
    async delete(req, res) {
        try {
            await this.paymentService.deletePayment(req.params.id);
            res.status(200).json({
                success: true,
                message: 'Payment deleted successfully'
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = PaymentController;
