const express = require('express');
const router = express.Router();

router.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

router.get('/ready', (req, res) => {
    // Add logic to check DB connection etc.
    res.status(200).json({ status: 'ok', message: 'Ready' });
});

module.exports = router;
