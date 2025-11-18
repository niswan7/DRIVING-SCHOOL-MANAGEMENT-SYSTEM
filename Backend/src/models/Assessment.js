const { ObjectId } = require('mongodb');

/**
 * Assessment Model
 * Handles assessment data operations
 */
class Assessment {
    constructor(db) {
        this.collection = db.collection('assessments');
        this.createIndexes();
    }

    /**
     * Create database indexes
     */
    async createIndexes() {
        try {
            await this.collection.createIndex({ studentId: 1, courseId: 1 });
            await this.collection.createIndex({ instructorId: 1 });
            await this.collection.createIndex({ status: 1 });
            await this.collection.createIndex({ dueDate: 1 });
        } catch (error) {
            console.error('Error creating indexes:', error);
        }
    }

    /**
     * Create a new assessment
     * @param {Object} assessmentData - Assessment data
     * @returns {Promise<Object>} Created assessment
     */
    async create(assessmentData) {
        const assessment = {
            studentId: new ObjectId(assessmentData.studentId),
            instructorId: new ObjectId(assessmentData.instructorId),
            courseId: new ObjectId(assessmentData.courseId),
            title: assessmentData.title,
            description: assessmentData.description || '',
            assessmentUrl: assessmentData.assessmentUrl,
            dueDate: new Date(assessmentData.dueDate),
            completionDate: assessmentData.completionDate ? new Date(assessmentData.completionDate) : null,
            score: assessmentData.score || null,
            maxScore: assessmentData.maxScore || 100,
            status: assessmentData.status || 'pending', // pending, completed, graded, overdue
            feedback: assessmentData.feedback || '',
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await this.collection.insertOne(assessment);
        assessment._id = result.insertedId;
        return assessment;
    }

    /**
     * Find assessment by ID
     * @param {String} id - Assessment ID
     * @returns {Promise<Object>} Assessment object
     */
    async findById(id) {
        return await this.collection.findOne({ _id: new ObjectId(id) });
    }

    /**
     * Get assessments with filters
     * @param {Object} filters - Query filters
     * @returns {Promise<Array>} Array of assessments
     */
    async findAll(filters = {}) {
        const matchStage = {};

        if (filters.studentId) {
            matchStage.studentId = new ObjectId(filters.studentId);
        }

        if (filters.instructorId) {
            matchStage.instructorId = new ObjectId(filters.instructorId);
        }

        if (filters.courseId) {
            matchStage.courseId = new ObjectId(filters.courseId);
        }

        if (filters.status) {
            matchStage.status = filters.status;
        }

        const assessments = await this.collection
            .aggregate([
                { $match: matchStage },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'studentId',
                        foreignField: '_id',
                        as: 'studentInfo'
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'instructorId',
                        foreignField: '_id',
                        as: 'instructorInfo'
                    }
                },
                {
                    $lookup: {
                        from: 'courses',
                        localField: 'courseId',
                        foreignField: '_id',
                        as: 'courseInfo'
                    }
                },
                {
                    $addFields: {
                        studentId: {
                            $cond: {
                                if: { $gt: [{ $size: '$studentInfo' }, 0] },
                                then: {
                                    _id: { $arrayElemAt: ['$studentInfo._id', 0] },
                                    name: { $arrayElemAt: ['$studentInfo.name', 0] },
                                    firstName: { $arrayElemAt: ['$studentInfo.firstName', 0] },
                                    lastName: { $arrayElemAt: ['$studentInfo.lastName', 0] },
                                    email: { $arrayElemAt: ['$studentInfo.email', 0] }
                                },
                                else: '$studentId'
                            }
                        },
                        instructorId: {
                            $cond: {
                                if: { $gt: [{ $size: '$instructorInfo' }, 0] },
                                then: {
                                    _id: { $arrayElemAt: ['$instructorInfo._id', 0] },
                                    name: { $arrayElemAt: ['$instructorInfo.name', 0] },
                                    firstName: { $arrayElemAt: ['$instructorInfo.firstName', 0] },
                                    lastName: { $arrayElemAt: ['$instructorInfo.lastName', 0] },
                                    email: { $arrayElemAt: ['$instructorInfo.email', 0] }
                                },
                                else: '$instructorId'
                            }
                        },
                        courseId: {
                            $cond: {
                                if: { $gt: [{ $size: '$courseInfo' }, 0] },
                                then: {
                                    _id: { $arrayElemAt: ['$courseInfo._id', 0] },
                                    name: { $arrayElemAt: ['$courseInfo.name', 0] },
                                    title: { $arrayElemAt: ['$courseInfo.title', 0] },
                                    duration: { $arrayElemAt: ['$courseInfo.duration', 0] }
                                },
                                else: '$courseId'
                            }
                        }
                    }
                },
                {
                    $project: {
                        studentInfo: 0,
                        instructorInfo: 0,
                        courseInfo: 0
                    }
                },
                { $sort: { dueDate: -1, createdAt: -1 } }
            ])
            .toArray();

        return assessments;
    }

    /**
     * Update assessment
     * @param {String} id - Assessment ID
     * @param {Object} updateData - Data to update
     * @returns {Promise<Object>} Updated assessment
     */
    async update(id, updateData) {
        const updates = { ...updateData };
        
        if (updates.dueDate) {
            updates.dueDate = new Date(updates.dueDate);
        }

        if (updates.completionDate) {
            updates.completionDate = new Date(updates.completionDate);
        }

        if (updates.studentId) {
            updates.studentId = new ObjectId(updates.studentId);
        }

        if (updates.instructorId) {
            updates.instructorId = new ObjectId(updates.instructorId);
        }

        if (updates.courseId) {
            updates.courseId = new ObjectId(updates.courseId);
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
     * Delete assessment
     * @param {String} id - Assessment ID
     * @returns {Promise<Boolean>} Success status
     */
    async delete(id) {
        const result = await this.collection.deleteOne({ _id: new ObjectId(id) });
        return result.deletedCount > 0;
    }

    /**
     * Get upcoming assessments for student
     * @param {String} studentId - Student ID
     * @returns {Promise<Array>} Array of upcoming assessments
     */
    async getUpcomingByStudent(studentId) {
        const now = new Date();
        
        return await this.collection
            .find({
                studentId: new ObjectId(studentId),
                dueDate: { $gte: now },
                status: { $in: ['pending', 'completed'] }
            })
            .sort({ dueDate: 1 })
            .toArray();
    }

    /**
     * Get assessments by student and course
     * @param {String} studentId - Student ID
     * @param {String} courseId - Course ID
     * @returns {Promise<Array>} Array of assessments
     */
    async getByStudentAndCourse(studentId, courseId) {
        return await this.collection
            .find({
                studentId: new ObjectId(studentId),
                courseId: new ObjectId(courseId)
            })
            .sort({ dueDate: -1 })
            .toArray();
    }

    /**
     * Update assessment score
     * @param {String} id - Assessment ID
     * @param {Number} score - Score value
     * @param {String} feedback - Optional feedback
     * @returns {Promise<Object>} Updated assessment
     */
    async updateScore(id, score, feedback = '') {
        const updates = {
            score: score,
            status: 'graded',
            updatedAt: new Date()
        };

        if (feedback) {
            updates.feedback = feedback;
        }

        const result = await this.collection.findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: updates },
            { returnDocument: 'after' }
        );

        return result;
    }

    /**
     * Update overdue assessments
     * @returns {Promise<Object>} Update result
     */
    async updateOverdueAssessments() {
        const now = new Date();
        
        const result = await this.collection.updateMany(
            {
                status: 'pending',
                dueDate: { $lt: now }
            },
            {
                $set: {
                    status: 'overdue',
                    updatedAt: now
                }
            }
        );
        
        console.log('Updated overdue assessments:', result.modifiedCount);
        return result;
    }

    /**
     * Get assessment statistics for a student
     * @param {String} studentId - Student ID
     * @param {String} courseId - Optional course ID
     * @returns {Promise<Object>} Statistics object
     */
    async getStudentStats(studentId, courseId = null) {
        const query = { studentId: new ObjectId(studentId) };
        
        if (courseId) {
            query.courseId = new ObjectId(courseId);
        }

        const assessments = await this.collection.find(query).toArray();
        
        const stats = {
            total: assessments.length,
            pending: assessments.filter(a => a.status === 'pending').length,
            completed: assessments.filter(a => a.status === 'completed').length,
            graded: assessments.filter(a => a.status === 'graded').length,
            overdue: assessments.filter(a => a.status === 'overdue').length,
            averageScore: 0
        };

        const gradedAssessments = assessments.filter(a => a.status === 'graded' && a.score !== null);
        if (gradedAssessments.length > 0) {
            const totalScore = gradedAssessments.reduce((sum, a) => sum + (a.score / a.maxScore * 100), 0);
            stats.averageScore = totalScore / gradedAssessments.length;
        }

        return stats;
    }
}

module.exports = Assessment;
