const express = require('express');
const http = require('http');
const { Server } = require('socket.io')
const { v4 } = require('uuid');

const { onlineUsers } = require('./data/onlineUsers.store');
const { messages } = require('./data/messages.store');

const app = express();

app.use(express.json());

const healthRoutes = require('./routes/health.routes');
const userRoutes = require('./routes/user.routes');

app.use('/health', healthRoutes);

app.use('/users',userRoutes);

app.get('/',(req,res) => {
    res.json(Object.fromEntries(onlineUsers));
});

app.get('/messages', (req,res) => {
    res.json(Object.fromEntries(messages));
})


const server = http.createServer(app);

const io = new Server(server,{
    cors : {
        origin: '*',
    },
});

io.on('connection',(socket) => {
    const userId = socket.handshake.query.userId

    if(!userId){
        console.log("Unauthenticated socket, disconnecting");
        socket.disconnect();
        return;
    }
    onlineUsers.set(userId, socket.id);
    console.log(`User ${userId} connected with socket ${socket.id}`);

    socket.on('send_message', (payload) => {
        const { from, to, content } = payload;

        if (!from || !to || !content) {
            return;
        }

        const message = {
            id : v4(),
            from,
            to,
            content,
            timestamp: Date.now(),
            status : 'PENDING',
        };

        messages.set(message.id, message);

        const receiverSocketId = onlineUsers.get(to);

        if(!receiverSocketId) return;

        message.status = 'SENT';
        io.to(receiverSocketId).emit('receive_message',message);
    });

    socket.on('message_ack', ({ messageId }) => {
        const message = messages.get(messageId);
        if (!message) return;

        message.status = 'DELIVERED';
        console.log(`Message ${messageId} delivered`);
    });


    socket.on('disconnect',() => {
        onlineUsers.delete(userId);
        console.log(`User ${userId} disconnected`);
    });
});


server.listen(5000, () => {
    console.log('server is running on port 5000');
})
