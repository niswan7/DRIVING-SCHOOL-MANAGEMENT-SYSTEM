const { ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

/**
 * User Model
 * Handles user data operations and authentication
 */
class User {
    constructor(db) {
        this.db = db;
        this.collection = db.collection('users');
        this.createIndexes();
    }

    /**
     * Create database indexes
     */
    async createIndexes() {
        try {
            await this.collection.createIndex({ email: 1 }, { unique: true });
            await this.collection.createIndex({ username: 1 }, { unique: true });
        } catch (error) {
            console.error('Error creating indexes:', error);
        }
    }

    /**
     * Create a new user
     * @param {Object} userData - User data
     * @returns {Promise<Object>} Created user
     */
    async create(userData) {
        try {
            // Hash password
            const hashedPassword = await bcrypt.hash(userData.password, 10);

            const user = {
                firstName: userData.firstName,
                lastName: userData.lastName,
                email: userData.email.toLowerCase(),
                username: userData.username.toLowerCase(),
                password: hashedPassword,
                phone: userData.phone,
                dateOfBirth: userData.dateOfBirth ? new Date(userData.dateOfBirth) : null,
                address: {
                    street: userData.address || '',
                    city: userData.city || '',
                    state: userData.state || '',
                    zipCode: userData.zipCode || ''
                },
                role: userData.role || 'student', // student, instructor, admin
                status: 'active', // active, inactive, suspended
                createdAt: new Date(),
                updatedAt: new Date()
            };

            const result = await this.collection.insertOne(user);
            user._id = result.insertedId;
            
            // Remove password from returned object
            delete user.password;
            return user;
        } catch (error) {
            if (error.code === 11000) {
                const field = Object.keys(error.keyPattern)[0];
                throw new Error(`${field} already exists`);
            }
            throw error;
        }
    }

    /**
     * Find user by email
     * @param {String} email - User email
     * @returns {Promise<Object>} User object
     */
    async findByEmail(email) {
        return await this.collection.findOne({ email: email.toLowerCase() });
    }

    /**
     * Find user by username
     * @param {String} username - Username
     * @returns {Promise<Object>} User object
     */
    async findByUsername(username) {
        return await this.collection.findOne({ username: username.toLowerCase() });
    }

    /**
     * Find user by ID
     * @param {String} id - User ID
     * @returns {Promise<Object>} User object
     */
    async findById(id) {
        return await this.collection.findOne({ _id: new ObjectId(id) });
    }

    /**
     * Authenticate user
     * @param {String} identifier - Email or username
     * @param {String} password - Password
     * @returns {Promise<Object>} User object and token
     */
    async authenticate(identifier, password) {
        // Find user by email or username
        const user = await this.collection.findOne({
            $or: [
                { email: identifier.toLowerCase() },
                { username: identifier.toLowerCase() }
            ]
        });

        if (!user) {
            throw new Error('Invalid credentials');
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error('Invalid credentials');
        }

        // Check if user is active
        if (user.status !== 'active') {
            throw new Error('Account is not active');
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            config.jwtSecret,
            { expiresIn: config.jwtExpire }
        );

        // Remove password from returned object
        delete user.password;

        return { user, token };
    }

    /**
     * Get all users with optional filters
     * @param {Object} filters - Query filters
     * @returns {Promise<Array>} Array of users
     */
    async findAll(filters = {}) {
        const query = {};
        
        if (filters.role) {
            query.role = filters.role;
        }
        
        if (filters.status) {
            query.status = filters.status;
        }

        if (filters.search) {
            query.$or = [
                { firstName: { $regex: filters.search, $options: 'i' } },
                { lastName: { $regex: filters.search, $options: 'i' } },
                { email: { $regex: filters.search, $options: 'i' } }
            ];
        }

        const users = await this.collection
            .find(query)
            .project({ password: 0 }) // Exclude password
            .toArray();

        return users;
    }

    /**
     * Update user
     * @param {String} id - User ID
     * @param {Object} updateData - Data to update
     * @returns {Promise<Object>} Updated user
     */
    async update(id, updateData) {
        const updates = { ...updateData };
        delete updates.password; // Don't allow direct password update
        delete updates.email; // Email should not be updated directly
        delete updates.username; // Username should not be updated directly
        
        updates.updatedAt = new Date();

        const result = await this.collection.findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: updates },
            { returnDocument: 'after', projection: { password: 0 } }
        );

        return result;
    }

    /**
     * Update user password
     * @param {String} id - User ID
     * @param {String} oldPassword - Current password
     * @param {String} newPassword - New password
     */
    async updatePassword(id, oldPassword, newPassword) {
        const user = await this.collection.findOne({ _id: new ObjectId(id) });
        
        if (!user) {
            throw new Error('User not found');
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            throw new Error('Current password is incorrect');
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        await this.collection.updateOne(
            { _id: new ObjectId(id) },
            { 
                $set: { 
                    password: hashedPassword,
                    updatedAt: new Date()
                }
            }
        );
    }

    /**
     * Delete user
     * @param {String} id - User ID
     * @returns {Promise<Boolean>} Success status
     */
    async delete(id) {
        const result = await this.collection.deleteOne({ _id: new ObjectId(id) });
        return result.deletedCount > 0;
    }

    /**
     * Find students who have had lessons with a specific instructor.
     * @param {String} instructorId - The instructor's ID.
     * @returns {Promise<Array>} An array of unique student objects.
     */
    async findStudentsByInstructor(instructorId) {
        const lessons = await this.db.collection('lessons').find({
            instructorId: new ObjectId(instructorId)
        }).toArray();

        if (lessons.length === 0) {
            return [];
        }

        const studentIds = [...new Set(lessons.map(lesson => lesson.studentId))];

        const students = await this.collection.find({
            _id: { $in: studentIds }
        }).project({ password: 0 }).toArray();

        return students;
    }
}

module.exports = User;