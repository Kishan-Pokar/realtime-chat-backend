const express = require('express');

const app = express();

app.use(express.json());

const healthRoutes = require('./routes/health.routes');

app.use('/health', healthRoutes);

app.get('/', (req,res) => {
    res.send('Server is running');
});

app.listen(5000, () => {
    console.log('server is running on port 5000');
})
