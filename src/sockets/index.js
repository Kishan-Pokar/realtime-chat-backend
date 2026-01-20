const { Server } = require('socket.io');
const handleConnections = require('./connection');
const jwt = require('jsonwebtoken');

module.exports = (server) => {
    const io = new Server(server, {
        cors: {
            origin: [
                'http://localhost:3000',
                'https://chat-app.vercel.app'
            ],
        }
    });

    io.use((socket, next) => {
        const token = socket.handshake.auth.token;

        if (!token) {
            console.warn('Connection attempt without token');
            return next(new Error('Authentication Required'));
        }

        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET);
            socket.userId = payload.userId;
            next();
        } catch (err) {
            console.log('Invalid token:', err.message);
            next(new Error('Invalid token'));
        }
    });

    io.on('connection', (socket) => {
        handleConnections(io, socket);
    });
    
    console.log('Socket.IO server initialized');
};