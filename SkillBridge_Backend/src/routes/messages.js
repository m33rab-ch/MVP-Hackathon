const express = require('express');
const router = express.Router();
const {
  getConversations,
  getMessages,
  sendMessage,
  markAsRead
} = require('../controllers/messageController');
const { auth } = require('../middleware/auth');

// Protected routes
router.get('/conversations', auth, getConversations);
router.get('/:userId', auth, getMessages);
router.post('/:userId', auth, sendMessage);
router.put('/read/:messageId', auth, markAsRead);

module.exports = router;