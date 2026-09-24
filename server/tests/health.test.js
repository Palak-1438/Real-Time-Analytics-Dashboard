const request = require('supertest');
const { app } = require('../server');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const redisConfig = require('../config/redis');

jest.mock('../config/redis', () => ({
    checkRedisStatus: jest.fn().mockReturnValue(true)
}));

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.disconnect();
    await mongoose.connect(uri);
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe('Health and Readiness Endpoints', () => {
    it('should return 200 OK for /health', async () => {
        const res = await request(app).get('/health');
        expect(res.statusCode).toEqual(200);
        expect(res.body.status).toEqual('ok');
        expect(res.body).toHaveProperty('uptime');
        expect(res.body).toHaveProperty('timestamp');
    });

    it('should return 200 OK for /ready when DB and Redis are connected', async () => {
        redisConfig.checkRedisStatus.mockReturnValueOnce(true);
        const res = await request(app).get('/ready');
        expect(res.statusCode).toEqual(200);
        expect(res.body.status).toEqual('ok');
        expect(res.body.db).toEqual('connected');
        expect(res.body.redis).toEqual('connected');
    });

    it('should return 503 for /ready when DB is disconnected', async () => {
        await mongoose.disconnect();
        redisConfig.checkRedisStatus.mockReturnValueOnce(true);

        const res = await request(app).get('/ready');
        expect(res.statusCode).toEqual(503);
        expect(res.body.status).toEqual('error');
        expect(res.body.db).toEqual('disconnected');
        expect(res.body.redis).toEqual('connected');

        // Reconnect for afterAll cleanup to not fail
        const uri = mongoServer.getUri();
        await mongoose.connect(uri);
    });

    it('should return 503 for /ready when Redis is disconnected', async () => {
        redisConfig.checkRedisStatus.mockReturnValueOnce(false);

        const res = await request(app).get('/ready');
        expect(res.statusCode).toEqual(503);
        expect(res.body.status).toEqual('error');
        expect(res.body.db).toEqual('connected');
        expect(res.body.redis).toEqual('disconnected');
    });
});
