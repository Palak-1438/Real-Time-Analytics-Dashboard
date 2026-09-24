const request = require('supertest');
const { app } = require('../server');

describe('Middleware functionality', () => {
    it('should append x-request-id to responses', async () => {
        const res = await request(app).get('/health');
        expect(res.headers).toHaveProperty('x-request-id');
        expect(res.headers['x-request-id']).toBeDefined();
    });

    it('should use incoming x-request-id if provided', async () => {
        const customId = 'test-custom-id-123';
        const res = await request(app).get('/health').set('x-request-id', customId);
        expect(res.headers['x-request-id']).toEqual(customId);
    });
});
