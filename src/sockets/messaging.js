const { createMessage, markDelivered, deliverPendingMessage } = require('../services/message.service');

module.exports = (io, socket, userId) => {
    
    console.log(`Message handlers registered for user ${userId}`);
    
    socket.on('send_message', async (payload) => {
        await createMessage(io, payload, socket);
    });

    socket.on('message_ack', async ({ messageId }) => {
        await markDelivered(messageId);
    });

    socket.on('fetch_offline_messages', async () => {
        await deliverPendingMessage(socket, userId);
    });
    
};