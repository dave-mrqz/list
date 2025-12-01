// Load environment variables from .env (like your MongoDB URI)
require('dotenv').config();

// Import libraries
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const path = require('path');


// Import routes
const listRoutes = require('./routes/listRoutes');


// Create the Express app
const app = express();


// Global middleware
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));


// Add routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use('/lists', listRoutes);


// Database connection
const PORT = process.env.PORT || 3000;
const uri = process.env.MONGODB_URI;

mongoose.connect(uri)
    .then(() => {
        console.log('MondoDB successfully connected');

        // Start the server ONLY after successful DB connection
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.log('Error connecting to MongoDB:', error.message);
        // You can choose to exit the process if the connection is critical for your app to run
        process.exit(1);
    });
        


    