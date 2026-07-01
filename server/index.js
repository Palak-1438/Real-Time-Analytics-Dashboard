const { app, server, PORT } = require('./server');
const { initializeSocket } = require('./socket');

// Initialize Socket.io
initializeSocket(server);

// Start listening
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
