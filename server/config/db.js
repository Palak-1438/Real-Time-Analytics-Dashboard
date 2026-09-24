const mongoose = require('mongoose');
const config = require('./env');
const logger = require('../utils/logger');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(config.mongo.uri, {
            maxPoolSize: config.mongo.maxPoolSize,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        logger.info(`MongoDB Connected: ${conn.connection.host} with maxPoolSize: ${config.mongo.maxPoolSize}`);
    } catch (error) {
        logger.error(`MongoDB Connection Error: ${error.message}`);
        process.exit(1);
    }
};

const checkDBStatus = () => {
    return mongoose.connection.readyState === 1;
};

module.exports = { connectDB, checkDBStatus };
