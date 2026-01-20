const { v4: uuidv4 } = require('uuid');

const { saveMessage, updateMessageStatus, getUndeliveredMessages } = require('../repositories/message.repo');
const { getSocketId } = require('./presence.service');

const createMessage = async (io, payload, socket) => {
    const { to, content } = payload;
    const from = socket.userId;

    if (!from || !to || !content) {
        console.error('Invalid message payload');
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
    try {
        await saveMessage(message);
        
        const receiverSocketId = await getSocketId(to);

        if (!receiverSocketId) {
            console.log(`User ${to} offline, message saved as pending`);
            return;
        }

        await updateMessageStatus(message.id, 'SENT');
        io.to(receiverSocketId).emit('receive_message', message);
    } catch (error) {
        console.error('Error creating message:', error); 
    }
}

const markDelivered = async (messageId) => {
    try {
        await updateMessageStatus(messageId, 'DELIVERED');
    } catch (error) {
        console.error('Error marking message delivered:', error); // KEEP
    }
}

const deliverPendingMessage = async (socket, userId) => {
    try {
        const pendingMessages = await getUndeliveredMessages(userId);
        
        if (pendingMessages.length > 0) {
            console.log(`Delivering ${pendingMessages.length} pending messages to ${userId}`); // KEEP
            
            for (const msg of pendingMessages) {
                await updateMessageStatus(msg.id, 'SENT');
            }
            
            socket.emit('offline_messages', pendingMessages);
        }
    } catch (error) {
           console.error('Error delivering pending messages:', error); // KEEP
    }
      
}

module.exports = {
    createMessage,
    markDelivered,
    deliverPendingMessage,
};