const { Server } = require('socket.io');
const { createAdapter } = require('@socket.io/redis-adapter');
const { registerDashboardHandlers } = require('./handlers/dashboardHandler');
const { getRedisClients } = require('../config/redis');
const logger = require('../utils/logger');
const config = require('../config/env');

let io;

const initializeSocket = (server) => {
    // Need pubClient and subClient for Socket.IO Redis Adapter
    const { pubClient, subClient } = getRedisClients();

    io = new Server(server, {
        cors: {
            origin: config.clientUrl,
            methods: ['GET', 'POST']
        },
        adapter: createAdapter(pubClient, subClient)
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
