const DASHBOARD_EVENTS = require('../events/dashboardEvents');
const logger = require('../../utils/logger');

let statsInterval = null;
let revenueInterval = null;
let clientsCount = 0;

const registerDashboardHandlers = (io, socket) => {
    clientsCount++;

    // Generate mock data for real-time dashboard updates
    const emitSystemStats = () => {
        const stats = {
            cpuUsage: Math.floor(Math.random() * 100),
            memoryUsage: Math.floor(Math.random() * 100),
            timestamp: new Date().toISOString()
        };
        io.emit(DASHBOARD_EVENTS.SYSTEM_STATS, stats);
    };

    const emitRevenueUpdate = () => {
        const revenue = {
            amount: Math.floor(Math.random() * 1000) + 500,
            timestamp: new Date().toISOString()
        };
        io.emit(DASHBOARD_EVENTS.REVENUE_UPDATE, revenue);
    };

    // Start intervals only if this is the first client connecting
    if (clientsCount === 1) {
        statsInterval = setInterval(emitSystemStats, 2000);
        revenueInterval = setInterval(emitRevenueUpdate, 5000);
    }

    socket.on('disconnect', () => {
        clientsCount--;
        // Clear intervals when the last client disconnects
        if (clientsCount === 0) {
            clearInterval(statsInterval);
            clearInterval(revenueInterval);
        }
    });
};

module.exports = { registerDashboardHandlers };
