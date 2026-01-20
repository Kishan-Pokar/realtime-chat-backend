const { setOnline, setOffline } = require('../services/presence.service');
const registerMessaging = require('./messaging');

module.exports = async (io, socket) => {
    const userId = socket.userId;
    
    
    if (!userId) {
        console.error('Unauthenticated user attempted connection');
        socket.disconnect();
        return;
    }

    await setOnline(userId, socket.id);
    console.log(`User ${userId} connected`);

    registerMessaging(io, socket, userId);

    socket.on('disconnect', async () => {
        await setOffline(userId);
        console.log(`User ${userId} disconnected`);
    });
};