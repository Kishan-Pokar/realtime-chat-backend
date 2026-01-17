const { Server } = require('socket.io');
const handleConnections = require('./connection');


module.exports = (server) => {
    const io = new Server(server,{
        cors: {
            origin:'*',
        }
    });

    io.on('connection',(socket) => {
        handleConnections(io,socket);
    });
};