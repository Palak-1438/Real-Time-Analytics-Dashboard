const express = require('express');
const router = express.Router();
const { checkDBStatus } = require('../config/db');

router.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

router.get('/ready', (req, res) => {
    const isDBReady = checkDBStatus();

    if (isDBReady) {
        res.status(200).json({
            status: 'ok',
            message: 'Ready to receive traffic',
            db: 'connected'
        });
    } else {
        res.status(503).json({
            status: 'error',
            message: 'Service Unavailable',
            db: 'disconnected'
        });
    }
});

module.exports = router;
