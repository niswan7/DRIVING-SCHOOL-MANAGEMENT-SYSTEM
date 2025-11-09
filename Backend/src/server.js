require('dotenv').config();
const config = require('./config/config');
const initializeApp = require('./app');

const PORT = config.port;

/**
 * Start the server
 */
async function startServer() {
    try {
        // Validate configuration
        config.validate();

        // Initialize app with all dependencies
        const app = await initializeApp();

        // Start listening
        app.listen(PORT, () => {
            console.log('='.repeat(50));
            console.log('🚀 Driving School Management System Backend');
            console.log('='.repeat(50));
            console.log(`📡 Server running on port ${PORT}`);
            console.log(`🌍 Environment: ${config.nodeEnv}`);
            console.log(`🔗 Health check: http://localhost:${PORT}/health`);
            console.log(`📚 API Base URL: http://localhost:${PORT}/api`);
            console.log('='.repeat(50));
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}

// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
    process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
});

// Start the server
startServer();