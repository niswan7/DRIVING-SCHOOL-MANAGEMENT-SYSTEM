const express = require('express');
const router = express.Router();
const AuthMiddleware = require('../src/middleware/authMiddleware');

/**
 * Course Routes
 */
function createCourseRoutes(courseController) {
    // Create course
    router.post('/',
        AuthMiddleware.authenticate,
        AuthMiddleware.authorize('admin'),
        (req, res) => courseController.create(req, res)
    );

    // Get all courses (public)
    router.get('/',
        (req, res) => courseController.getAll(req, res)
    );

    // Get course by ID (public)
    router.get('/:id',
        (req, res) => courseController.getById(req, res)
    );

    // Update course
    router.put('/:id',
        AuthMiddleware.authenticate,
        AuthMiddleware.authorize('admin'),
        (req, res) => courseController.update(req, res)
    );

    // Delete course
    router.delete('/:id',
        AuthMiddleware.authenticate,
        AuthMiddleware.authorize('admin'),
        (req, res) => courseController.delete(req, res)
    );

    return router;
}

module.exports = createCourseRoutes;
