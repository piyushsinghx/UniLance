const Message = require('../models/Message');

// @desc    Send a message
// @route   POST /api/messages
const sendMessage = async (req, res) => {
  try {
    const { receiver, text } = req.body;
    const sender = req.user._id;

    // Create a consistent conversationId from both user IDs
    const conversationId = [sender, receiver].sort().join('_');

    const message = await Message.create({
      conversationId,
      sender,
      receiver,
      text,
    });

    const populated = await Message.findById(message._id)
      .populate('sender', 'name avatar')
      .populate('receiver', 'name avatar');

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get messages for a conversation
// @route   GET /api/messages/:conversationId
const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ conversationId: req.params.conversationId })
      .populate('sender', 'name avatar')
      .populate('receiver', 'name avatar')
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all conversations for a user
// @route   GET /api/messages/conversations
const getConversations = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find all unique conversation IDs where user is sender or receiver
    const messages = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: userId }, { receiver: userId }],
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $group: {
          _id: '$conversationId',
          lastMessage: { $first: '$text' },
          lastMessageDate: { $first: '$createdAt' },
          sender: { $first: '$sender' },
          receiver: { $first: '$receiver' },
          unreadCount: {
            $sum: {
              $cond: [{ $and: [{ $eq: ['$read', false] }, { $eq: ['$receiver', userId] }] }, 1, 0],
            },
          },
        },
      },
      {
        $sort: { lastMessageDate: -1 },
      },
    ]);

    // Populate the other user's info
    const populatedConversations = await Promise.all(
      messages.map(async (conv) => {
        const otherUserId = conv.sender.toString() === userId.toString() ? conv.receiver : conv.sender;
        const User = require('../models/User');
        const otherUser = await User.findById(otherUserId).select('name avatar');
        return {
          conversationId: conv._id,
          otherUser,
          lastMessage: conv.lastMessage,
          lastMessageDate: conv.lastMessageDate,
          unreadCount: conv.unreadCount,
        };
      })
    );

    res.json(populatedConversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { sendMessage, getMessages, getConversations };
