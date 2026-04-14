const setupSocket = (io) => {
  const onlineUsers = new Map();

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // User comes online
    socket.on('addUser', (userId) => {
      onlineUsers.set(userId, socket.id);
      io.emit('getOnlineUsers', Array.from(onlineUsers.keys()));
    });

    // Join a conversation room
    socket.on('joinConversation', (conversationId) => {
      socket.join(conversationId);
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

    // User disconnects
    socket.on('disconnect', () => {
      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          break;
        }
      }
      io.emit('getOnlineUsers', Array.from(onlineUsers.keys()));
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};

module.exports = setupSocket;
