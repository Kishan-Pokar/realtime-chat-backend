const { Server } = require('socket.io');
const handleConnections = require('./connection');
const jwt = require('jsonwebtoken');


module.exports = (server) => {
    const io = new Server(server, {
        cors: {
            origin: '*',
        }
    });

    io.use((socket, next) => {
        const token = socket.handshake.auth.token;

        if (!token) {
            return next(new Error('Authentication Required'));
        }

        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET);
            socket.userId = payload.userId;
            next();
            console.log("Authentication Complete, user connected");
        } catch (err) {
            next(new Error('Invalid token'));
        }
    });

    io.on('connection', (socket) => {
        handleConnections(io, socket);
    });
};