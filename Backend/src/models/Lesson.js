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
        const booking = {{
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

        const result = await this.collection.insertOne(booking);
        booking._id = result.insertedId;
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
        const query = {};

        if (filters.instructorId) {
            query.instructorId = new ObjectId(filters.instructorId);
        }

        if (filters.studentId) {
            query.studentId = new ObjectId(filters.studentId);
        }

        if (filters.status) {
            query.status = filters.status;
        }

        if (filters.dateFrom) {
            query.date = { $gte: new Date(filters.dateFrom) };
        }

        if (filters.dateTo) {
            query.date = { ...query.date, $lte: new Date(filters.dateTo) };
        }

        const bookings = await this.collection
            .find(query)
            .sort({ date: -1, time: 1 })
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
        const now = new Date();
        
        return await this.collection
            .find({
                instructorId: new ObjectId(instructorId),
                date: { $gte: now },
                status: { $in: ['scheduled', 'in-progress'] }
            })
            .sort({ date: 1, time: 1 })
            .toArray();
    }

    /**
     * Get upcoming bookings for student
     * @param {String} studentId - Student ID
     * @returns {Promise<Array>} Array of upcoming bookings
     */
    async getUpcomingByStudent(studentId) {
        const now = new Date();
        
        return await this.collection
            .find({
                studentId: new ObjectId(studentId),
                date: { $gte: now },
                status: { $in: ['scheduled', 'in-progress'] }
            })
            .sort({ date: 1, time: 1 })
            .toArray();
    }

    /**
     * Get instructor's bookings for a specific date
     * @param {String} instructorId - Instructor ID
     * @param {Date} date - Date to check
     * @returns {Promise<Array>} Array of bookings on that date
     */
    async getInstructorLessonsForDate(instructorId, date) {
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
            if (slotStart < lessonEnd && slotEnd > lessonStart) {
                return false;
            }
        }

        return true;
    }
}

module.exports = Booking;
