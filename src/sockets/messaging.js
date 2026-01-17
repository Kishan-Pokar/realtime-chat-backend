const { createMessage, markDelivered, deliverPendingMessage } = require('../services/message.service');

module.exports = (io, socket, userId) => {
    socket.on('send_message', async (payload) => {
        await createMessage(io, payload, socket);
    });

    socket.on('message_ack', async ({ messageId }) => {
        await markDelivered(messageId);
    })

    deliverPendingMessage(socket, userId);


}