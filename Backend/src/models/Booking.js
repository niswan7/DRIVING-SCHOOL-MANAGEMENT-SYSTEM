const { ObjectId } = require('mongodb');

/**
 * Booking Model
 * Handles booking data operations
 */
class Booking {
    constructor(db) {
        this.collection = db.collection('bookings');
        this.createIndexes();
    }

    /**
     * Create database indexes
     */
    async createIndexes() {
        try {
            await this.collection.createIndex({ instructorId: 1, date: 1 });
            await this.collection.createIndex({ studentId: 1, date: 1 });
            await this.collection.createIndex({ status: 1 });
        } catch (error) {
            console.error('Error creating indexes:', error);
        }
    }

    /**
     * Create a new booking
     * @param {Object} bookingData - Booking data
     * @returns {Promise<Object>} Created booking
     */
    async create(bookingData) {
        console.log('Booking.create called with:', bookingData);
        const booking = {
            instructorId: new ObjectId(bookingData.instructorId),
            studentId: bookingData.studentId ? new ObjectId(bookingData.studentId) : null,
            courseId: bookingData.courseId ? new ObjectId(bookingData.courseId) : null,
            date: new Date(bookingData.date),
            time: bookingData.time,
            duration: bookingData.duration || 60, // Default 60 minutes
            type: bookingData.type || 'practical', // practical, theory
            status: bookingData.status || 'scheduled', // scheduled, completed, cancelled, in-progress
            attendance: bookingData.attendance || null, // null, 'attended', 'not-attended'
            notes: bookingData.notes || '',
            location: bookingData.location || '',
            createdAt: new Date(),
            updatedAt: new Date()
        };

        console.log('Attempting to insert booking into database:', booking);
        const result = await this.collection.insertOne(booking);
        console.log('Insert result:', result);
        booking._id = result.insertedId;
        console.log('Returning booking with ID:', booking);
        return booking;
    }

    /**
     * Find booking by ID
     * @param {String} id - Booking ID
     * @returns {Promise<Object>} Booking object
     */
    async findById(id) {
        return await this.collection.findOne({ _id: new ObjectId(id) });
    }

    /**
     * Get bookings with filters
     * @param {Object} filters - Query filters
     * @returns {Promise<Array>} Array of bookings
     */
    async findAll(filters = {}) {
        const matchStage = {};

        if (filters.instructorId) {
            matchStage.instructorId = new ObjectId(filters.instructorId);
        }

        if (filters.studentId) {
            matchStage.studentId = new ObjectId(filters.studentId);
        }

        if (filters.courseId) {
            matchStage.courseId = new ObjectId(filters.courseId);
        }

        if (filters.status) {
            matchStage.status = filters.status;
        }

        if (filters.dateFrom) {
            matchStage.date = { $gte: new Date(filters.dateFrom) };
        }

        if (filters.dateTo) {
            matchStage.date = { ...matchStage.date, $lte: new Date(filters.dateTo) };
        }

        const bookings = await this.collection
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
                        }
                    }
                },
                {
                    $project: {
                        studentInfo: 0,
                        instructorInfo: 0
                    }
                },
                { $sort: { date: -1, time: 1 } }
            ])
            .toArray();

        return bookings;
    }

    /**
     * Update booking
     * @param {String} id - Booking ID
     * @param {Object} updateData - Data to update
     * @returns {Promise<Object>} Updated booking
     */
    async update(id, updateData) {
        const updates = { ...updateData };
        
        if (updates.date) {
            updates.date = new Date(updates.date);
        }

        if (updates.instructorId) {
            updates.instructorId = new ObjectId(updates.instructorId);
        }

        if (updates.studentId) {
            updates.studentId = new ObjectId(updates.studentId);
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
     * Delete booking
     * @param {String} id - Booking ID
     * @returns {Promise<Boolean>} Success status
     */
    async delete(id) {
        const result = await this.collection.deleteOne({ _id: new ObjectId(id) });
        return result.deletedCount > 0;
    }

    /**
     * Update booking attendance
     * @param {String} id - Booking ID
     * @param {String} attendance - Attendance status ('attended', 'not-attended')
     * @returns {Promise<Object>} Updated booking
     */
    async updateAttendance(id, attendance) {
        const result = await this.collection.findOneAndUpdate(
            { _id: new ObjectId(id) },
            { 
                $set: { 
                    attendance: attendance,
                    updatedAt: new Date()
                } 
            },
            { returnDocument: 'after' }
        );

        return result;
    }

    /**
     * Get upcoming bookings for instructor
     * @param {String} instructorId - Instructor ID
     * @returns {Promise<Array>} Array of upcoming bookings
     */
    async getUpcomingByInstructor(instructorId) {
        // First, update any expired bookings
        await this.updateExpiredBookings();
        
        const now = new Date();
        
        return await this.collection
            .aggregate([
                {
                    $match: {
                        instructorId: new ObjectId(instructorId),
                        date: { $gte: now },
                        status: { $in: ['scheduled', 'in-progress'] }
                    }
                },
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
                        }
                    }
                },
                {
                    $project: {
                        studentInfo: 0,
                        instructorInfo: 0
                    }
                },
                { $sort: { date: 1, time: 1 } }
            ])
            .toArray();
    }

    /**
     * Update expired bookings to missed status
     * @returns {Promise<Object>} Update result
     */
    async updateExpiredBookings() {
        const now = new Date();
        
        // Find all bookings that are past their date/time and still scheduled or in-progress
        const result = await this.collection.updateMany(
            {
                status: { $in: ['scheduled', 'in-progress'] },
                $expr: {
                    $lt: [
                        {
                            $dateFromString: {
                                dateString: {
                                    $concat: [
                                        { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
                                        'T',
                                        '$time',
                                        ':00'
                                    ]
                                }
                            }
                        },
                        now
                    ]
                }
            },
            {
                $set: {
                    status: 'missed',
                    updatedAt: now
                }
            }
        );
        
        console.log('Updated expired bookings:', result.modifiedCount);
        return result;
    }

    /**
     * Get upcoming bookings for student
     * @param {String} studentId - Student ID
     * @returns {Promise<Array>} Array of upcoming bookings
     */
    async getUpcomingByStudent(studentId) {
        // First, update any expired bookings
        await this.updateExpiredBookings();
        
        const now = new Date();
        now.setHours(0, 0, 0, 0); // Set to start of today
        
        console.log('Querying upcoming bookings for student:', studentId);
        console.log('Current date for comparison:', now);
        
        const bookings = await this.collection
            .aggregate([
                {
                    $match: {
                        studentId: new ObjectId(studentId),
                        date: { $gte: now },
                        status: { $in: ['scheduled', 'in-progress'] }
                    }
                },
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
                        }
                    }
                },
                {
                    $project: {
                        studentInfo: 0,
                        instructorInfo: 0
                    }
                },
                { $sort: { date: 1, time: 1 } }
            ])
            .toArray();
        
        console.log('Found bookings in database:', bookings);
        return bookings;
    }

    /**
     * Get instructor bookings for a specific date
     * @param {String} instructorId - Instructor ID
     * @param {Date} date - Date to check
     * @returns {Promise<Array>} Array of bookings on that date
     */
    async getInstructorBookingsForDate(instructorId, date) {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        return await this.collection
            .find({
                instructorId: new ObjectId(instructorId),
                date: { $gte: startOfDay, $lte: endOfDay },
                status: { $in: ['scheduled', 'in-progress'] }
            })
            .sort({ time: 1 })
            .toArray();
    }

    /**
     * Check if time slot is available
     * @param {String} instructorId - Instructor ID
     * @param {Date} date - Date
     * @param {String} time - Time (HH:mm format)
     * @param {Number} duration - Duration in minutes
     * @returns {Promise<Boolean>} True if available
     */
    async isTimeSlotAvailable(instructorId, date, time, duration = 60) {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const [hours, minutes] = time.split(':').map(Number);
        const slotStart = hours * 60 + minutes;
        const slotEnd = slotStart + duration;

        const bookings = await this.collection
            .find({
                instructorId: new ObjectId(instructorId),
                date: { $gte: startOfDay, $lte: endOfDay },
                status: { $in: ['scheduled', 'in-progress'] }
            })
            .toArray();

        for (const booking of bookings) {
            const [bookingHours, bookingMinutes] = booking.time.split(':').map(Number);
            const bookingStart = bookingHours * 60 + bookingMinutes;
            const bookingEnd = bookingStart + (booking.duration || 60);

            // Check for overlap
            if (slotStart < bookingEnd && slotEnd > bookingStart) {
                return false;
            }
        }

        return true;
    }
}

module.exports = Booking;
