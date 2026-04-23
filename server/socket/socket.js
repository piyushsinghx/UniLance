const User = require('../models/User');

const setupSocket = (io) => {
  const onlineUsers = new Map();

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // User comes online
    socket.on('addUser', async (userId) => {
      onlineUsers.set(userId, socket.id);
      
      // Join personal notification room
      socket.join(`user_${userId}`);
      
      // Update online status in DB
      try {
        await User.findByIdAndUpdate(userId, { isOnline: true, lastSeen: new Date() });
      } catch (e) { /* silently fail */ }
      
      io.emit('getOnlineUsers', Array.from(onlineUsers.keys()));
    });

    // Join a conversation room
    socket.on('joinConversation', (conversationId) => {
      socket.join(conversationId);
    });

    // Leave a conversation room
    socket.on('leaveConversation', (conversationId) => {
      socket.leave(conversationId);
    });

    // Send message
    socket.on('sendMessage', (data) => {
      const { conversationId, message } = data;
      socket.to(conversationId).emit('receiveMessage', message);

      // Also notify the receiver if online
      const receiverSocketId = onlineUsers.get(data.receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('newMessageNotification', {
          conversationId,
          message,
        });
      }
    });

    // Typing indicator
    socket.on('typing', (data) => {
      socket.to(data.conversationId).emit('userTyping', {
        userId: data.userId,
        isTyping: data.isTyping,
      });
    });

    // Order status update broadcasting
    socket.on('orderUpdate', (data) => {
      const { buyerId, sellerId, order } = data;
      const buyerSocket = onlineUsers.get(buyerId);
      const sellerSocket = onlineUsers.get(sellerId);
      if (buyerSocket) io.to(buyerSocket).emit('orderStatusUpdate', order);
      if (sellerSocket) io.to(sellerSocket).emit('orderStatusUpdate', order);
    });

    // User disconnects
    socket.on('disconnect', async () => {
      let disconnectedUserId = null;
      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          disconnectedUserId = userId;
          onlineUsers.delete(userId);
          break;
        }
      }
      
      // Update offline status in DB
      if (disconnectedUserId) {
        try {
          await User.findByIdAndUpdate(disconnectedUserId, { isOnline: false, lastSeen: new Date() });
        } catch (e) { /* silently fail */ }
      }
      
      io.emit('getOnlineUsers', Array.from(onlineUsers.keys()));
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  return { onlineUsers };
};

module.exports = setupSocket;
