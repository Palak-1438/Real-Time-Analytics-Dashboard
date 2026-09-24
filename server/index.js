const { app, server, PORT } = require('./server');
const { initializeRedis, closeRedisConnections } = require('./config/redis');
const { initializeSocket, getIo } = require('./socket');
const mongoose = require('mongoose');
const logger = require('./utils/logger');

const startServer = async () => {
    try {
        // Initialize Redis before Socket.io
        await initializeRedis();

        // Initialize Socket.io
        initializeSocket(server);

        // Start listening
        server.listen(PORT, () => {
            logger.info(`Server running on port ${PORT}`);
        });
    } catch (error) {
        logger.error(`Failed to start server: ${error.message}`);
        process.exit(1);
    }
};

startServer();

// Graceful Shutdown
const gracefulShutdown = async (signal) => {
    logger.info(`Received ${signal}. Starting graceful shutdown...`);

    try {
        // 1. Close HTTP server (stops accepting new requests)
        await new Promise((resolve) => {
            server.close((err) => {
                if (err) {
                    logger.error(`Error during HTTP server shutdown: ${err.message}`);
                } else {
                    logger.info('HTTP server closed.');
                }
                resolve();
            });
        });

        // 2. Disconnect Socket.IO clients
        try {
            const io = getIo();
            if (io) {
                io.close(() => {
                    logger.info('Socket.IO server closed.');
                });
            }
        } catch (err) {
            logger.warn(`Socket.IO shutdown warning: ${err.message}`);
        }

        // 3. Close MongoDB connection
        if (mongoose.connection.readyState === 1) { // 1 = connected
            await mongoose.connection.close();
            logger.info('MongoDB connection closed.');
        }

        // 4. Close Redis connection
        await closeRedisConnections();

        logger.info('Graceful shutdown completed successfully.');
        process.exit(0);
    } catch (error) {
        logger.error(`Error during graceful shutdown: ${error.message}`);
        process.exit(1);
    }
};

// Listen for termination signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
