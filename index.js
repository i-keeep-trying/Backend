const express = require('express');
const registerRoute = require('./routes/registeredRoutes');
const cors = require('cors');
const connectToDatabase = require('./db');

const app = express();
connectToDatabase();

app.use(cors());

app.use('/api/register', registerRoute);

app.listen(3030, () => {
    console.log('Server is running on http://localhost:3030');
});