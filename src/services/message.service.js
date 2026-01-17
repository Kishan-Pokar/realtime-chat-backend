

const { v4: uuidv4 } = require('uuid');

const { saveMessage, updateMessageStatus, getUndeliveredMessages } = require('../repositories/message.repo');
const { getSocketId } = require('./presence.service');

const createMessage = async (io, payload, socket) => {
    const { to, content } = payload;
    const from = socket.userId;

    if (!from || !to || !content) {
        return;
    }

    const message = {
        id: uuidv4(),
        from,
        to,
        content,
        timestamp: Date.now(),
        status: 'PENDING',
    };
    await saveMessage(message);

    const receiverSocketId = await getSocketId(to);

    if (!receiverSocketId) {
        return;
    }

    updateMessageStatus(message.id, 'SENT');

    io.to(receiverSocketId).emit('receive_message', message);

}

const markDelivered = async (messageId) => {
    await updateMessageStatus(messageId, 'DELIVERED');
    console.log(`message ${messageId} delivered`);
}

const deliverPendingMessage = async (socket, userId) => {
    const pendingMessages = await getUndeliveredMessages(userId);

    for (const msg of pendingMessages) {
        await updateMessageStatus(msg.id, 'SENT');
        socket.emit('receive_message', msg);
    }
}

module.exports = {
    createMessage,
    markDelivered,
    deliverPendingMessage,
};