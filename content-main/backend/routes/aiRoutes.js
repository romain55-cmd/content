const express = require('express');
const router = express.Router();
const { generateContent, generateContentIdeas, chatWithAgent } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');
const { logAction } = require('../middleware/actionLogMiddleware');

router.post('/generate', protect, generateContent);
router.post('/ideas', protect, logAction('get_ideas'), generateContentIdeas);
router.post('/chat', protect, logAction('chat_with_agent'), chatWithAgent);

module.exports = router;
