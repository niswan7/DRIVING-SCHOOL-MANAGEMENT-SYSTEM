const { ObjectId } = require('mongodb');

/**
 * Payment Model
 * Handles payment operations
 */
class Payment {
    constructor(db) {
        this.db = db;
        this.collection = db.collection('payments');
        this.usersCollection = db.collection('users');
        this.createIndexes();
    }

    /**
     * Create database indexes
     */
    async createIndexes() {
        try {
            await this.collection.createIndex({ studentId: 1, createdAt: -1 });
            await this.collection.createIndex({ status: 1 });
        } catch (error) {
            console.error('Error creating indexes:', error);
        }
    }

    /**
     * Create a new payment record
     * @param {Object} paymentData - Payment data
     * @returns {Promise<Object>} Created payment
     */
    async create(paymentData) {
        const payment = {
            studentId: new ObjectId(paymentData.studentId),
            amount: paymentData.amount,
            currency: paymentData.currency || 'INR',
            type: paymentData.type || 'course', // course, lesson, fine, other
            description: paymentData.description || '',
            status: paymentData.status || 'pending', // pending, completed, failed, refunded
            paymentMethod: paymentData.paymentMethod || '', // card, cash, upi, etc.
            transactionId: paymentData.transactionId || null,
            paidAt: paymentData.paidAt ? new Date(paymentData.paidAt) : null,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await this.collection.insertOne(payment);
        payment._id = result.insertedId;
        return payment;
    }

    /**
     * Find payment by ID
     * @param {String} id - Payment ID
     * @returns {Promise<Object>} Payment object
     */
    async findById(id) {
        return await this.collection.findOne({ _id: new ObjectId(id) });
    }

    /**
     * Get all payments for a student
     * @param {String} studentId - Student ID
     * @returns {Promise<Array>} Array of payments
     */
    async findByStudent(studentId) {
        return await this.collection
            .find({ studentId: new ObjectId(studentId) })
            .sort({ createdAt: -1 })
            .toArray();
    }

    /**
     * Get all payments with filters
     * @param {Object} filters - Query filters
     * @returns {Promise<Array>} Array of payments
     */
    async findAll(filters = {}) {
        const query = {};

        if (filters.studentId) {
            query.studentId = new ObjectId(filters.studentId);
        }

        if (filters.status) {
            query.status = filters.status;
        }

        if (filters.type) {
            query.type = filters.type;
        }

        if (filters.dateFrom) {
            query.createdAt = { $gte: new Date(filters.dateFrom) };
        }

        if (filters.dateTo) {
            query.createdAt = { ...query.createdAt, $lte: new Date(filters.dateTo) };
        }

        // Use aggregation to populate student details
        return await this.collection.aggregate([
            { $match: query },
            {
                $lookup: {
                    from: 'users',
                    localField: 'studentId',
                    foreignField: '_id',
                    as: 'studentDetails'
                }
            },
            {
                $unwind: {
                    path: '$studentDetails',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $addFields: {
                    studentId: '$studentDetails'
                }
            },
            {
                $project: {
                    studentDetails: 0,
                    'studentId.password': 0 // Exclude password from student data
                }
            },
            { $sort: { createdAt: -1 } }
        ]).toArray();
    }

    /**
     * Update payment
     * @param {String} id - Payment ID
     * @param {Object} updateData - Data to update
     * @returns {Promise<Object>} Updated payment
     */
    async update(id, updateData) {
        const updates = { ...updateData };
        
        if (updates.paidAt) {
            updates.paidAt = new Date(updates.paidAt);
        }

        updates.updatedAt = new Date();

        const result = await this.collection.findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: updates },
            { returnDocument: 'after' }
        );

        return result;
    }

    /**
     * Get payment summary for a student
     * @param {String} studentId - Student ID
     * @returns {Promise<Object>} Payment summary
     */
    async getStudentSummary(studentId) {
        const payments = await this.findByStudent(studentId);
        
        const total = payments
            .filter(p => p.status === 'completed')
            .reduce((sum, p) => sum + p.amount, 0);

        const pending = payments
            .filter(p => p.status === 'pending')
            .reduce((sum, p) => sum + p.amount, 0);

        return {
            totalPaid: total,
            pendingAmount: pending,
            lastPayment: payments[0] || null,
            paymentHistory: payments
        };
    }

    /**
     * Delete payment
     * @param {String} id - Payment ID
     * @returns {Promise<Boolean>} Success status
     */
    async delete(id) {
        const result = await this.collection.deleteOne({ _id: new ObjectId(id) });
        return result.deletedCount > 0;
    }
}

module.exports = Payment;
