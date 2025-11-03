const express = require('express');
const router = express.Router();

// Import the classes
const UserService = require('../services/UserService');
// Controller lives under src/controllers
const UserController = require('../src/controllers/UserController');

// Instantiate them
const userService = new UserService();
const userController = new UserController(userService);

// Define the routes and map them to controller methods
router.get('/users', (req, res) => userController.getAll(req, res));
router.get('/users/:id', (req, res) => userController.getById(req, res));
router.post('/users', (req, res) => userController.create(req, res));

module.exports = router;