const express = require('express');
const axios = require('axios');
const router = express.Router();

// Route to get discussion topics
router.get('/', async (req, res) => {
    const name = (req.query.name || (req.body && req.body.name));
    const courseId = req.query.courseId; // Assuming you pass course ID in the query
    const canvasToken = process.env.CANVAS_TOKEN; // Get token from environment variables

    if (!courseId || !canvasToken) {
        return res.status(400).json({ message: "Please provide both a course ID and a Canvas authorization token." });
    }

    try {
        const response = await axios.get(`https://canvas.ubc.ca/api/v1/courses/${courseId}/discussion_topics`, {
            headers: {
                Authorization: `Bearer ${canvasToken}`
            }
        });

        const discussions = response.data;
        return res.status(200).json(discussions);
    } catch (error) {
        console.error('Error fetching discussions:', error);
        return res.status(error.response ? error.response.status : 500).json({ message: "Error retrieving discussions from Canvas." });
    }
});

module.exports = router;
