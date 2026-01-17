const { setOnline, setOffline } = require('../services/presence.service');
const registerMessaging = require('./messaging');

module.exports = async  (io,socket) => {
    const userId = socket.handshake.query.userId;
    if(!userId){
        console.log('Unauthenticated User disconnecting!!!');
        socket.disconnect();
    }

    await setOnline(userId,socket.id);
    console.log(`User ${userId} connected with socket ${socket.id}`);

    registerMessaging(io,socket,userId);

    socket.on('disconnect', async () => {
        await setOffline(userId);
        console.log(`user ${userId} disconnected`);
        socket.disconnect();
    });
};