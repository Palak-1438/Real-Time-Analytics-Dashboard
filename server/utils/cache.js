const { getRedisClients } = require('../config/redis');
const logger = require('./logger');

const getCache = async (key) => {
    try {
        const { redisClient } = getRedisClients();
        const data = await redisClient.get(key);
        if (data) {
            return JSON.parse(data);
        }
        return null;
    } catch (error) {
        logger.error(`Redis Get Cache Error for key ${key}: ${error.message}`);
        return null;
    }
};

const setCache = async (key, value, expiryInSeconds = 300) => {
    try {
        const { redisClient } = getRedisClients();
        await redisClient.setEx(key, expiryInSeconds, JSON.stringify(value));
    } catch (error) {
        logger.error(`Redis Set Cache Error for key ${key}: ${error.message}`);
    }
};

const invalidateCache = async (key) => {
    try {
        const { redisClient } = getRedisClients();
        await redisClient.del(key);
    } catch (error) {
        logger.error(`Redis Invalidate Cache Error for key ${key}: ${error.message}`);
    }
};

module.exports = {
    getCache,
    setCache,
    invalidateCache
};
