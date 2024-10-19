const express = require('express');
const axios = require('axios');
const router = express.Router();

// Route to get discussion entries
router.get('/', async (req, res) => {
    const courseId = req.query.courseId; // Course ID as a query parameter
    const discussionId = req.query.discussionId; // Discussion ID as a query parameter
    const canvasToken = process.env.CANVAS_TOKEN; // Get token from environment variables

    if (!courseId || !discussionId) {
        return res.status(400).json({ message: "Please provide both courseId and discussionId as query parameters." });
    }

    try {
        // Fetch discussion entries from Canvas API
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
            message: entry.message,
            created_at: entry.created_at
        }));

        return res.status(200).json(filteredReplies); // Return the filtered replies

    } catch (error) {
        console.error('Error fetching data from Canvas API:', error.message);
        return res.status(error.response?.status || 500).json({ message: error.response?.data || "An error occurred while fetching replies." });
    }
});

module.exports = router;
