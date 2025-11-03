const express = require('express');
const cors = require('cors');
// routes folder is at project root (../routes from src)
const userRoutes = require('../routes/userRoutes');
// You would also add your error handling middleware here

const app = express();

// Standard middleware
app.use(cors());
app.use(express.json()); // To parse JSON bodies
app.use(express.urlencoded({ extended: true }));

// --- Routes ---

app.use('/api/v1', userRoutes);
// Add other routers like /api/v1/productRoutes here

// --- Global Error Handler ---
// (Example)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

module.exports = app;