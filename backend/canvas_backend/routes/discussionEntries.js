const express = require('express');
const axios = require('axios');
const { convert } = require('html-to-text'); // Import the html-to-text package
const router = express.Router();

// Route to get a list of level 1 discussion replies
router.get('/', async (req, res) => {
    const courseId = req.query.courseId;
    const discussionId = req.query.discussionId;
    const canvasToken = process.env.CANVAS_TOKEN;

    if (!courseId || !discussionId) {
        return res.status(400).json({ message: "Please provide both courseId and discussionId as query parameters." });
    }

    try {
        // Fetch discussion replies from Canvas API
        const apiUrl = `https://canvas.ubc.ca/api/v1/courses/${courseId}/discussion_topics/${discussionId}/entries?per_page=100&page=1`;
        const response = await axios.get(apiUrl, {
            headers: {
                Authorization: `Bearer ${canvasToken}`
            }
        });

        const entries = response.data;

        // Map to get user_name, message, and created_at from entries
        const filteredReplies = entries.map(entry => ({
            user_name: entry.user_name,
            // Convert HTML to text and remove newline characters
            message: convert(entry.message, { wordwrap: 130 }).replace(/\n/g, ' '), // Replace newline characters with space
            created_at: entry.created_at
        }));

        return res.status(200).json(filteredReplies); // Return the filtered replies

    } catch (error) {
        console.error('Error fetching data from Canvas API:', error.message);
        return res.status(error.response?.status || 500).json({ message: error.response?.data || "An error occurred while fetching replies." });
    }
});

module.exports = router;
