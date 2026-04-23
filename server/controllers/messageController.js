const Message = require('../models/Message');
const User = require('../models/User');
const { createNotification } = require('./notificationController');

// @desc    Send a message
// @route   POST /api/messages
const sendMessage = async (req, res) => {
  try {
    const receiver = req.body.receiver || req.body.receiverId;
    const text = req.body.text?.trim();
    const sender = req.user._id;

    if (!receiver || !text) {
      return res.status(400).json({ message: 'Receiver and message text are required' });
    }

    if (sender.toString() === receiver.toString()) {
      return res.status(400).json({ message: 'You cannot message yourself' });
    }

    const receiverUser = await User.findById(receiver).select('name avatar');
    if (!receiverUser) {
      return res.status(404).json({ message: 'Receiver not found' });
    }

    const conversationId = [sender.toString(), receiver.toString()].sort().join('_');

    const message = await Message.create({
      conversationId,
      sender,
      receiver,
      text,
    });

    const populated = await Message.findById(message._id)
      .populate('sender', 'name avatar')
      .populate('receiver', 'name avatar');

    const io = req.app.get('io');
    await createNotification(io, receiver, {
      type: 'new_message',
      title: `New message from ${req.user.name}`,
      message: text.length > 90 ? `${text.slice(0, 87)}...` : text,
      data: {
        userId: sender,
        link: `/messages?to=${sender}`,
      },
    });

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get messages for a conversation
// @route   GET /api/messages/:conversationId
const getMessages = async (req, res) => {
  try {
    const conversationId = req.params.conversationId;
    const userId = req.user._id;

    await Message.updateMany(
      {
        conversationId,
        receiver: userId,
        read: false,
      },
      {
        read: true,
      }
    );

    const messages = await Message.find({
      conversationId,
      $or: [{ sender: userId }, { receiver: userId }],
    })
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

    const populatedConversations = await Promise.all(
      messages.map(async (conv) => {
        const otherUserId = conv.sender.toString() === userId.toString() ? conv.receiver : conv.sender;
        const otherUser = await User.findById(otherUserId).select('name avatar isOnline lastSeen');

        if (!otherUser) {
          return null;
        }

        return {
          conversationId: conv._id,
          otherUser,
          lastMessage: conv.lastMessage,
          lastMessageDate: conv.lastMessageDate,
          unreadCount: conv.unreadCount,
        };
      })
    );

    res.json(populatedConversations.filter(Boolean));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { sendMessage, getMessages, getConversations };
