const express = require('express');
const { sendMessage, getMessages, getConversations } = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, sendMessage);
router.get('/conversations', protect, getConversations);
router.get('/:conversationId', protect, getMessages);

module.exports = router;
