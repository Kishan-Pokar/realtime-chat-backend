const http = require('http');
require('dotenv').config();
const app = require('./app');
const initSockets = require('./sockets/index.js');
const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
initSockets(server);

server.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});