const express = require('express');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());
const healthRoutes = require('./routes/health.routes');
const userRoutes = require('./routes/user.routes');

app.use('/health', healthRoutes);

app.use('/users', userRoutes);



module.exports = app;