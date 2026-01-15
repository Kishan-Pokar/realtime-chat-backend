const express = require('express');
const http = require('http');
const { Server } = require('socket.io')

const { onlineUsers } = require('./data/onlineUsers.store');

const app = express();

app.use(express.json());

const healthRoutes = require('./routes/health.routes');
const userRoutes = require('./routes/user.routes');

app.use('/health', healthRoutes);

app.use('/users',userRoutes);

app.get('/',(req,res) => {
    res.json(Object.fromEntries(onlineUsers));
});


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

    socket.on('disconnect',() => {
        onlineUsers.delete(userId);
        console.log(`User ${userId} disconnected`);
    });
});


server.listen(5000, () => {
    console.log('server is running on port 5000');
})
