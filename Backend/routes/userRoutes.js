const express = require('express');
const router = express.Router();
const AuthMiddleware = require('../src/middleware/authMiddleware');
const ValidationMiddleware = require('../src/middleware/validationMiddleware');

/**
 * User Routes
 * Note: These routes will be initialized with dependencies in app.js
 */
function createUserRoutes(userController) {
    // Public routes
    router.post('/register', 
        ValidationMiddleware.validateUserRegistration,
        (req, res) => userController.register(req, res)
    );
    
    router.post('/login',
        ValidationMiddleware.validateUserLogin,
        (req, res) => userController.login(req, res)
    );

    // Protected routes - require authentication
    router.get('/',
        AuthMiddleware.authenticate,
        AuthMiddleware.authorize('admin'),
        (req, res) => userController.getAll(req, res)
    );

    router.get('/role/:role',
        AuthMiddleware.authenticate,
        (req, res) => userController.getByRole(req, res)
    );

    router.get('/instructor/:instructorId/students',
        AuthMiddleware.authenticate,
        AuthMiddleware.authorize('instructor', 'admin'),
        (req, res) => userController.getInstructorStudents(req, res)
    );

    router.get('/:id/enrolled-courses',
        AuthMiddleware.authenticate,
        AuthMiddleware.authorizeOwnerOrAdmin,
        (req, res) => userController.getEnrolledCourses(req, res)
    );

    router.get('/:id',
        AuthMiddleware.authenticate,
        (req, res) => userController.getById(req, res)
    );

    router.put('/:id',
        AuthMiddleware.authenticate,
        AuthMiddleware.authorizeOwnerOrAdmin,
        (req, res) => userController.update(req, res)
    );

    router.post('/:id/change-password',
        AuthMiddleware.authenticate,
        AuthMiddleware.authorizeOwnerOrAdmin,
        (req, res) => userController.changePassword(req, res)
    );

    router.post('/:id/enroll',
        AuthMiddleware.authenticate,
        AuthMiddleware.authorizeOwnerOrAdmin,
        (req, res) => userController.enrollInCourse(req, res)
    );

    router.post('/:id/unenroll',
        AuthMiddleware.authenticate,
        AuthMiddleware.authorizeOwnerOrAdmin,
        (req, res) => userController.unenrollFromCourse(req, res)
    );

    router.delete('/:id',
        AuthMiddleware.authenticate,
        AuthMiddleware.authorize('admin'),
        (req, res) => userController.delete(req, res)
    );

    return router;
}

module.exports = createUserRoutes;