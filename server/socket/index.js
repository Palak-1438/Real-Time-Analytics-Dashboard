const { Server } = require('socket.io');
const { registerDashboardHandlers } = require('./handlers/dashboardHandler');
const logger = require('../utils/logger');

let io;

const initializeSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: process.env.CLIENT_URL || 'http://localhost:5173',
            methods: ['GET', 'POST']
        }
    });

    io.on('connection', (socket) => {
        // Register handlers
        registerDashboardHandlers(io, socket);
    });

    return io;
};

const getIo = () => {
    if (!io) {
        throw new Error('Socket.io not initialized!');
    }
    return io;
};

module.exports = { initializeSocket, getIo };
