const mongoose = require('mongoose');

const connectionString = 'mongodb+srv://sohampal:2weak2slow@cluster0.vn24o.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true 
}

const connnectToDatabase = async () => {
    try {
        await mongoose.connect(connectionString, connectionParams);
        console.log('Connected to database');
    } catch (error) {
        console.log(error);
    }
}

module.exports = connnectToDatabase;