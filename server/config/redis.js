const { createClient } = require('redis');
const config = require('./env');
const logger = require('../utils/logger');

let redisClient;
let pubClient;
let subClient;

const initializeRedis = async () => {
    try {
        redisClient = createClient({ url: config.redis.uri });

        redisClient.on('error', (err) => logger.error(`Redis Client Error: ${err.message}`));
        redisClient.on('connect', () => logger.info('Redis Client Connected'));
        redisClient.on('reconnecting', () => logger.warn('Redis Client Reconnecting...'));
        redisClient.on('ready', () => logger.info('Redis Client Ready'));

        await redisClient.connect();

        // Create duplicate clients for Socket.IO pub/sub adapter
        pubClient = redisClient.duplicate();
        subClient = redisClient.duplicate();

        await Promise.all([pubClient.connect(), subClient.connect()]);

        return { redisClient, pubClient, subClient };
    } catch (error) {
        logger.error(`Redis Initialization Error: ${error.message}`);
        // Do not exit process in test environment
        if (config.env !== 'test') {
            process.exit(1);
        }
    }
};

const getRedisClients = () => {
    if (!redisClient || !pubClient || !subClient) {
        throw new Error('Redis clients not initialized');
    }
    return { redisClient, pubClient, subClient };
};

const checkRedisStatus = () => {
    return redisClient && redisClient.isOpen;
};

const closeRedisConnections = async () => {
    try {
        if (redisClient) await redisClient.quit();
        if (pubClient) await pubClient.quit();
        if (subClient) await subClient.quit();
        logger.info('Redis connections closed successfully.');
    } catch (error) {
        logger.error(`Error closing Redis connections: ${error.message}`);
    }
};

module.exports = {
    initializeRedis,
    getRedisClients,
    checkRedisStatus,
    closeRedisConnections
};
