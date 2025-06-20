// server.js
const express = require('express');
const connectToDatabase = require('./config/db');

const userRoutes = require('./routes/userRoutes');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json())

connectToDatabase();

app.use('/api/users', userRoutes);


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


