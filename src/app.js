const express = require('express');

const app = express();

app.use(express.json());

const healthRoutes = require('./routes/health.routes');
const userRoutes = require('./routes/user.routes');

app.use('/health', healthRoutes);

app.use('/users',userRoutes);



module.exports = app;