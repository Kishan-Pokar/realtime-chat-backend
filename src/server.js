const http = require('http');
require('dotenv').config();
const app = require('./app');
const initSockets = require('./sockets/index.js');

const server = http.createServer(app);
initSockets(server);

server.listen(5000, () => {
    console.log('server running on port 5000');
});