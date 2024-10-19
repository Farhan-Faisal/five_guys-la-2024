const express = require('express');
const dotenv = require('dotenv');
const discussionsRouter = require('./routes/discussions');
const discussionEntriesRouter = require('./routes/discussionEntries'); // Import the new route

const app = express();
const PORT = process.env.PORT || 3000;

// Load environment variables from .env file
dotenv.config();

// Middleware to parse JSON bodies
app.use(express.json());

// Use the discussions route
app.use('/discussions', discussionsRouter);
app.use('/discussion-entries', discussionEntriesRouter); // Use the discussion entries route

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
