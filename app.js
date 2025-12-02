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

/* =========================
   VIEW ENGINE (EJS) SETUP
   ========================= */

// CHANGED: Tell Express that we'll use EJS templates
app.set('view engine', 'ejs');

// CHANGED: Explicitly set the "views" folder for templates
app.set('views', path.join(__dirname, 'views'));

// Global middleware
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));

// Static files (CSS, client-side JS, images)
// SAME: still serving /public for your assets
app.use(express.static(path.join(__dirname, 'public')));

/* =========================
   ROUTES
   ========================= */

// CHANGED: Instead of sending a static index.html file,
// we now render an EJS view named "index.ejs"
// This file should live at: /views/index.ejs
app.get('/', (req, res) => {
    res.render('index');  // looks for views/index.ejs
});

// Lists routes
// NOTE: Inside listRoutes, you can now use res.render('someView', data)
// for your "all lists", "new list", and "show list" pages.
app.use('/lists', listRoutes);

/* =========================
   DATABASE CONNECTION
   ========================= */

const PORT = process.env.PORT || 3000;
const uri = process.env.MONGODB_URI;

mongoose.connect(uri)
    .then(() => {
        console.log('MongoDB successfully connected');

        // Start the server ONLY after successful DB connection
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.log('Error connecting to MongoDB:', error.message);
        // Exit if DB connection is critical
        process.exit(1);
    });
