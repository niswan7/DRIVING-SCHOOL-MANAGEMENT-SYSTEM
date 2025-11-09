/**
 * Payment Service
 * Business logic for payment operations
 */
class PaymentService {
    constructor(paymentModel, notificationModel) {
        this.paymentModel = paymentModel;
        this.notificationModel = notificationModel;
    }

    /**
     * Create a payment record
     * @param {Object} paymentData - Payment data
     * @returns {Promise<Object>} Created payment
     */
    async createPayment(paymentData) {
        const payment = await this.paymentModel.create(paymentData);

        // Notify student about new payment
        if (this.notificationModel) {
            await this.notificationModel.create({
                userId: paymentData.studentId,
                title: 'Payment Created',
                message: `A payment of ${paymentData.currency} ${paymentData.amount} has been created`,
                type: 'info',
                metadata: { paymentId: payment._id }
            });
        }

        return payment;
    }

    /**
     * Get payment by ID
     * @param {String} paymentId - Payment ID
     * @returns {Promise<Object>} Payment object
     */
    async getPaymentById(paymentId) {
        const payment = await this.paymentModel.findById(paymentId);
        if (!payment) {
            throw new Error('Payment not found');
        }
        return payment;
    }

    /**
     * Get all payments for a student
     * @param {String} studentId - Student ID
     * @returns {Promise<Array>} Array of payments
     */
    async getStudentPayments(studentId) {
        return await this.paymentModel.findByStudent(studentId);
    }

    /**
     * Get all payments
     * @param {Object} filters - Query filters
     * @returns {Promise<Array>} Array of payments
     */
    async getAllPayments(filters = {}) {
        return await this.paymentModel.findAll(filters);
    }

    /**
     * Get payment summary for a student
     * @param {String} studentId - Student ID
     * @returns {Promise<Object>} Payment summary
     */
    async getStudentPaymentSummary(studentId) {
        return await this.paymentModel.getStudentSummary(studentId);
    }

    /**
     * Update payment
     * @param {String} paymentId - Payment ID
     * @param {Object} updateData - Data to update
     * @returns {Promise<Object>} Updated payment
     */
    async updatePayment(paymentId, updateData) {
        const result = await this.paymentModel.update(paymentId, updateData);
        if (!result) {
            throw new Error('Payment not found');
        }

        // Notify if payment completed
        if (this.notificationModel && updateData.status === 'completed') {
            const payment = await this.paymentModel.findById(paymentId);
            await this.notificationModel.create({
                userId: payment.studentId,
                title: 'Payment Successful',
                message: `Your payment of ${payment.currency} ${payment.amount} has been processed successfully`,
                type: 'success',
                metadata: { paymentId }
            });
        }

        return result;
    }

    /**
     * Process payment
     * @param {String} paymentId - Payment ID
     * @param {Object} paymentDetails - Payment processing details
     * @returns {Promise<Object>} Updated payment
     */
    async processPayment(paymentId, paymentDetails) {
        const updateData = {
            status: 'completed',
            paidAt: new Date(),
            transactionId: paymentDetails.transactionId,
            paymentMethod: paymentDetails.paymentMethod
        };
        return await this.updatePayment(paymentId, updateData);
    }

    /**
     * Delete payment
     * @param {String} paymentId - Payment ID
     * @returns {Promise<Boolean>} Success status
     */
    async deletePayment(paymentId) {
        const deleted = await this.paymentModel.delete(paymentId);
        if (!deleted) {
            throw new Error('Payment not found');
        }
        return true;
    }
}

module.exports = PaymentService;
