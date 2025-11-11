const { ObjectId } = require('mongodb');

/**
 * Course Model
 * Handles course/program operations
 */
class Course {
    constructor(db) {
        this.collection = db.collection('courses');
        this.createIndexes();
    }

    /**
     * Create database indexes
     */
    async createIndexes() {
        try {
            await this.collection.createIndex({ title: 1 });
            await this.collection.createIndex({ status: 1 });
        } catch (error) {
            console.error('Error creating indexes:', error);
        }
    }

    /**
     * Create a new course
     * @param {Object} courseData - Course data
     * @returns {Promise<Object>} Created course
     */
    async create(courseData) {
        try{
            const course = {
                title: courseData.title,
                description: courseData.description || '',
                duration: courseData.duration || 0, // in hours
                price: courseData.price || 0,
                type: courseData.type || 'beginner', // beginner, intermediate, advanced
                status: courseData.status || 'active', // active, inactive
                requirements: courseData.requirements || [],
                syllabus: courseData.syllabus || [],
                createdAt: new Date(),
                updatedAt: new Date()
            };

            const result = await this.collection.insertOne(course);
            course._id = result.insertedId;
            return course;
        }
        catch(error){
            if (error.code === 11000) {
                const field = Object.keys(error.keyPattern)[0];
                throw new Error(`${field} already exists`);
            }
            throw error;
        }
    }

    /**
     * Find course by ID
     * @param {String} id - Course ID
     * @returns {Promise<Object>} Course object
     */
    async findById(id) {
        return await this.collection.findOne({ _id: new ObjectId(id) });
    }

    /**
     * Get all courses
     * @param {Object} filters - Query filters
     * @returns {Promise<Array>} Array of courses
     */
    async findAll(filters = {}) {
        const query = {};

        if (filters.status) {
            query.status = filters.status;
        }

        if (filters.type) {
            query.type = filters.type;
        }

        return await this.collection
            .find(query)
            .sort({ createdAt: -1 })
            .toArray();
    }

    /**
     * Update course
     * @param {String} id - Course ID
     * @param {Object} updateData - Data to update
     * @returns {Promise<Object>} Updated course
     */
    async update(id, updateData) {
        const updates = { ...updateData };
        updates.updatedAt = new Date();

        const result = await this.collection.findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: updates },
            { returnDocument: 'after' }
        );

        return result;
    }

    /**
     * Delete course
     * @param {String} id - Course ID
     * @returns {Promise<Boolean>} Success status
     */
    async delete(id) {
        const result = await this.collection.deleteOne({ _id: new ObjectId(id) });
        return result.deletedCount > 0;
    }
}

module.exports = Course;
