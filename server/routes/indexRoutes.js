const express = require('express');
const router = express.Router();
const { checkDBStatus } = require('../config/db');
const { checkRedisStatus } = require('../config/redis');

router.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

router.get('/ready', (req, res) => {
    const isDBReady = checkDBStatus();
    const isRedisReady = checkRedisStatus();

    if (isDBReady && isRedisReady) {
        res.status(200).json({
            status: 'ok',
            message: 'Ready to receive traffic',
            db: 'connected',
            redis: 'connected'
        });
    } else {
        res.status(503).json({
            status: 'error',
            message: 'Service Unavailable',
            db: isDBReady ? 'connected' : 'disconnected',
            redis: isRedisReady ? 'connected' : 'disconnected'
        });
    }
});

module.exports = router;
