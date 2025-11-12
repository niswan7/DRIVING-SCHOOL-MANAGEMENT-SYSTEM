require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Database connection
const mongoConnection = require('../db/mongoConnect');

// Models
const User = require('./models/User');
const Lesson = require('./models/Lesson');
const Schedule = require('./models/Schedule');
const Progress = require('./models/Progress');
const Payment = require('./models/Payment');
const Feedback = require('./models/Feedback');
const Notification = require('./models/Notification');
const Course = require('./models/Course');

// Services
const UserService = require('../services/UserService');
const LessonService = require('../services/LessonService');
const ScheduleService = require('../services/ScheduleService');
const ProgressService = require('../services/ProgressService');
const PaymentService = require('../services/PaymentService');
const FeedbackService = require('../services/FeedbackService');
const NotificationService = require('../services/NotificationService');
const CourseService = require('../services/CourseService');

// Controllers
const UserController = require('./controllers/UserController');
const LessonController = require('./controllers/LessonController');
const ScheduleController = require('./controllers/ScheduleController');
const ProgressController = require('./controllers/ProgressController');
const PaymentController = require('./controllers/PaymentController');
const FeedbackController = require('./controllers/FeedbackController');
const NotificationController = require('./controllers/NotificationController');
const CourseController = require('./controllers/CourseController');

// Routes
const createUserRoutes = require('../routes/userRoutes');
const createLessonRoutes = require('../routes/lessonRoutes');
const createScheduleRoutes = require('../routes/scheduleRoutes');
const createProgressRoutes = require('../routes/progressRoutes');
const createPaymentRoutes = require('../routes/paymentRoutes');
const createFeedbackRoutes = require('../routes/feedbackRoutes');
const createNotificationRoutes = require('../routes/notificationRoutes');
const createCourseRoutes = require('../routes/courseRoutes');

/**
 * Initialize Application
 * Sets up all dependencies and returns Express app
 */
async function initializeApp() {
    const app = express();

app.use(cors({ origin: '*' }));

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Connect to database
    const db = await mongoConnection.connect();

    // Initialize Models
    const userModel = new User(db);
    const lessonModel = new Lesson(db);
    const scheduleModel = new Schedule(db);
    const progressModel = new Progress(db);
    const paymentModel = new Payment(db);
    const feedbackModel = new Feedback(db);
    const notificationModel = new Notification(db);
    const courseModel = new Course(db);

    // Initialize Services
    const notificationService = new NotificationService(notificationModel, userModel);
    const userService = new UserService(userModel, notificationModel);
    const lessonService = new LessonService(lessonModel, scheduleModel, notificationModel);
    const scheduleService = new ScheduleService(scheduleModel);
    const progressService = new ProgressService(progressModel, notificationModel);
    const paymentService = new PaymentService(paymentModel, notificationModel);
    const feedbackService = new FeedbackService(feedbackModel, notificationModel);
    const courseService = new CourseService(courseModel);

    // Initialize Controllers
    const userController = new UserController(userService);
    const lessonController = new LessonController(lessonService);
    const scheduleController = new ScheduleController(scheduleService);
    const progressController = new ProgressController(progressService);
    const paymentController = new PaymentController(paymentService);
    const feedbackController = new FeedbackController(feedbackService);
    const notificationController = new NotificationController(notificationService);
    const courseController = new CourseController(courseService);

    // Health check route
    app.get('/health', (req, res) => {
        res.status(200).json({
            success: true,
            message: 'Server is running',
            timestamp: new Date()
        });
    });

    // API Routes
    app.use('/api/users', createUserRoutes(userController));
    app.use('/api/lessons', createLessonRoutes(lessonController));
    app.use('/api/schedules', createScheduleRoutes(scheduleController));
    app.use('/api/progress', createProgressRoutes(progressController));
    app.use('/api/payments', createPaymentRoutes(paymentController));
    app.use('/api/feedback', createFeedbackRoutes(feedbackController));
    app.use('/api/notifications', createNotificationRoutes(notificationController));
    app.use('/api/courses', createCourseRoutes(courseController));

    // 404 handler
    app.use((req, res) => {
        res.status(404).json({
            success: false,
            message: 'Route not found'
        });
    });

    // Global error handler
    app.use((err, req, res, next) => {
        console.error('Error:', err);
        res.status(err.status || 500).json({
            success: false,
            message: err.message || 'Internal server error'
        });
    });

    return app;
}

module.exports = initializeApp;