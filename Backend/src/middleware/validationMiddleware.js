const { body, validationResult } = require('express-validator');

/**
 * Validation Middleware
 * Request validation rules
 */
class ValidationMiddleware {
    /**
     * Handle validation errors
     */
    static handleValidationErrors(req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }
        next();
    }

    /**
     * User registration validation
     */
    static validateUserRegistration = [
        body('firstName').trim().notEmpty().withMessage('First name is required'),
        body('lastName').trim().notEmpty().withMessage('Last name is required'),
        body('email').isEmail().withMessage('Valid email is required'),
        body('username').trim().isLength({ min: 4 }).withMessage('Username must be at least 4 characters'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
        body('phone').trim().notEmpty().withMessage('Phone number is required'),
        body('role').optional().isIn(['student', 'instructor', 'admin']).withMessage('Invalid role'),
        this.handleValidationErrors
    ];

    /**
     * User login validation
     */
    static validateUserLogin = [
        body('username').trim().notEmpty().withMessage('Username or email is required'),
        body('password').notEmpty().withMessage('Password is required'),
        this.handleValidationErrors
    ];

    /**
     * Booking creation validation
     */
    static validateBookingCreation = [
        body('instructorId').trim().notEmpty().withMessage('Instructor ID is required'),
        body('date').isISO8601().withMessage('Valid date is required'),
        body('time').trim().notEmpty().withMessage('Time is required'),
        body('duration').optional().isInt({ min: 1 }).withMessage('Duration must be a positive number'),
        this.handleValidationErrors
    ];

    /**
     * Schedule creation validation
     */
    static validateScheduleCreation = [
        body('instructorId').trim().notEmpty().withMessage('Instructor ID is required'),
        body('day').optional().isIn(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'])
            .withMessage('Valid day is required'),
        body('date').optional().isISO8601().withMessage('Valid date is required'),
        body('startTime').trim().notEmpty().withMessage('Start time is required'),
        body('endTime').trim().notEmpty().withMessage('End time is required'),
        // Custom validation: either day or date must be provided
        body().custom((value, { req }) => {
            if (!req.body.day && !req.body.date) {
                throw new Error('Either day or date must be provided');
            }
            return true;
        }),
        this.handleValidationErrors
    ];

    /**
     * Feedback creation validation
     */
    static validateFeedbackCreation = [
        body('studentId').trim().notEmpty().withMessage('Student ID is required'),
        body('instructorId').trim().notEmpty().withMessage('Instructor ID is required'),
        body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
        body('comment').optional().trim(),
        this.handleValidationErrors
    ];

    /**
     * Payment creation validation
     */
    static validatePaymentCreation = [
        body('studentId').trim().notEmpty().withMessage('Student ID is required'),
        body('amount').isFloat({ min: 0 }).withMessage('Amount must be a positive number'),
        body('type').optional().isIn(['course', 'lesson', 'fine', 'other']).withMessage('Invalid payment type'),
        this.handleValidationErrors
    ];
}

module.exports = ValidationMiddleware;
