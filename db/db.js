
const mongoose = require('mongoose');

const uri = 'mongodb+srv://Andrii:qwerty1@cluster0.3rhqzfu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const connection = mongoose.connection;

connection.on('error', console.error.bind(console, 'Connection error:'));
connection.once('open', () => {
    console.log('Database connection successful');
});
