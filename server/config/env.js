const joi = require('joi');
const dotenv = require('dotenv');

// Load environment variables early
dotenv.config();

const envSchema = joi.object({
    NODE_ENV: joi.string().valid('development', 'production', 'test').default('development'),
    PORT: joi.number().default(5000),
    MONGO_URI: joi.string().required().description('MongoDB connection string'),
    JWT_SECRET: joi.string().required().description('JWT secret key'),
    CLIENT_URL: joi.string().uri().default('http://localhost:5173'),
    MONGO_MAX_POOL_SIZE: joi.number().default(10),
    HTTP_TIMEOUT_MS: joi.number().default(30000), // 30 seconds
}).unknown(true);

const { error, value: envVars } = envSchema.validate(process.env);

if (error) {
    if (process.env.NODE_ENV !== 'test') {
        throw new Error(`Config validation error: ${error.message}`);
    } else {
        // Provide test defaults if validation fails in test
        console.warn(`Config validation warning in test: ${error.message}`);
        envVars.MONGO_URI = envVars.MONGO_URI || 'mongodb://localhost:27017/test';
        envVars.JWT_SECRET = envVars.JWT_SECRET || 'test_secret';
    }
}

module.exports = {
    env: envVars.NODE_ENV,
    port: envVars.PORT,
    mongo: {
        uri: envVars.MONGO_URI,
        maxPoolSize: envVars.MONGO_MAX_POOL_SIZE,
    },
    jwt: {
        secret: envVars.JWT_SECRET,
    },
    clientUrl: envVars.CLIENT_URL,
    http: {
        timeout: envVars.HTTP_TIMEOUT_MS
    }
};
