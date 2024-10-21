const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors'); // Import CORS middleware
const discussionsRouter = require('./routes/discussions');
const discussionEntriesRouter = require('./routes/discussionEntries'); // Import the new route

const app = express();
const PORT = process.env.PORT || 4000;
const BASE_URL= process.env.BASE_URL;

// Load environment variables from .env file
dotenv.config();

// Middleware to parse JSON bodies
app.use(express.json());

// Enable CORS for all origins
app.use(cors({
    origin: '*', // Allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Specify allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed headers
}));

// Use the discussions route
app.use('/discussions', discussionsRouter);
app.use('/discussion-entries', discussionEntriesRouter); // Use the discussion entries route

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on ${BASE_URL}:${PORT}`);
});
