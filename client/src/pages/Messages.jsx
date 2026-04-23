import { useState, useEffect, useRef, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Send, Search, Phone, Video, MoreVertical, Smile, Paperclip, ArrowLeft, MessageSquare } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import { SocketContext } from '../context/SocketContext';
import { getConversations, getMessages, sendMessage } from '../services/messageService';
import { getUserProfile } from '../services/userService';
import { timeAgo } from '../utils/formatDate';
import OnlineIndicator from '../components/OnlineIndicator';
import TypingIndicator from '../components/TypingIndicator';
import { PageLoader } from '../components/Loader';

const upsertConversation = (currentConversations, payload) => {
  const existingIndex = currentConversations.findIndex(
    (conversation) => conversation.conversationId === payload.conversationId
  );

  if (existingIndex === -1) {
    return [payload, ...currentConversations];
  }

  const updatedConversation = {
    ...currentConversations[existingIndex],
    ...payload,
  };

  return [
    updatedConversation,
    ...currentConversations.filter((conversation) => conversation.conversationId !== payload.conversationId),
  ];
};

const Messages = () => {
  const { user } = useAuth();
  const { socket, onlineUsers } = useContext(SocketContext);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileList, setShowMobileList] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [isOtherUserTyping, setIsOtherUserTyping] = useState(false);

  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const seenMessageIdsRef = useRef(new Set());

  const scrollToBottom = (behavior = 'smooth') => {
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior }), 50);
  };

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        const { data } = await getConversations();
        setConversations(data);

        const toUserId = searchParams.get('to');
        if (toUserId) {
          const existing = data.find((conversation) => conversation.otherUser?._id === toUserId);

          if (existing) {
            setActiveConv(existing);
            setShowMobileList(false);
            return;
          }

          const userResponse = await getUserProfile(toUserId);
          setActiveConv({
            conversationId: 'new',
            otherUser: userResponse.data,
            isNew: true,
          });
          setShowMobileList(false);
          return;
        }

        if (data.length > 0 && window.innerWidth >= 768) {
          setActiveConv(data[0]);
        }
      } catch (error) {
        console.error('Failed to fetch conversations', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [searchParams]);

  useEffect(() => {
    if (!activeConv || activeConv.isNew) {
      setMessages([]);
      setIsOtherUserTyping(false);
      return undefined;
    }

    const fetchConversationMessages = async () => {
      setLoadingMessages(true);
      try {
        const { data } = await getMessages(activeConv.conversationId);
        setMessages(data);
        scrollToBottom('auto');
      } catch (error) {
        console.error('Failed to load messages', error);
      } finally {
        setLoadingMessages(false);
      }
    };

    fetchConversationMessages();

    if (socket) {
      socket.emit('joinConversation', activeConv.conversationId);
    }

    return () => {
      if (socket) {
        socket.emit('leaveConversation', activeConv.conversationId);
      }
    };
  }, [activeConv, socket]);

  useEffect(() => {
    if (!socket) {
      return undefined;
    }

    const handleIncomingMessage = (message) => {
      if (message?._id && seenMessageIdsRef.current.has(message._id)) {
        return;
      }

      if (message?._id) {
        seenMessageIdsRef.current.add(message._id);
      }

      const senderId = message.sender?._id || message.sender;
      const receiverId = message.receiver?._id || message.receiver;
      const otherUserId = senderId === user._id ? receiverId : senderId;

      if (activeConv && message.conversationId === activeConv.conversationId) {
        setMessages((prev) => {
          if (prev.some((entry) => entry._id === message._id)) {
            return prev;
          }
          return [...prev, message];
        });
        setIsOtherUserTyping(false);
        scrollToBottom();
      }

      setConversations((prev) =>
        upsertConversation(prev, {
          conversationId: message.conversationId,
          otherUser: activeConv?.otherUser?._id === otherUserId
            ? activeConv.otherUser
            : prev.find((conversation) => conversation.conversationId === message.conversationId)?.otherUser || {
                _id: otherUserId,
                name: senderId === user._id ? activeConv?.otherUser?.name || 'User' : message.sender?.name || 'User',
                avatar: senderId === user._id ? activeConv?.otherUser?.avatar : message.sender?.avatar,
              },
          lastMessage: message.text,
          lastMessageDate: message.createdAt,
          unreadCount:
            activeConv && message.conversationId === activeConv.conversationId
              ? 0
              : (prev.find((conversation) => conversation.conversationId === message.conversationId)?.unreadCount || 0) +
                (senderId === user._id ? 0 : 1),
        })
      );
    };

    const handleTyping = ({ userId, isTyping }) => {
      if (activeConv?.otherUser?._id === userId) {
        setIsOtherUserTyping(isTyping);
      }
    };

    socket.on('receiveMessage', handleIncomingMessage);
    socket.on('newMessageNotification', handleIncomingMessage);
    socket.on('userTyping', handleTyping);

    return () => {
      socket.off('receiveMessage', handleIncomingMessage);
      socket.off('newMessageNotification', handleIncomingMessage);
      socket.off('userTyping', handleTyping);
    };
  }, [socket, activeConv, user._id]);

  useEffect(() => () => clearTimeout(typingTimeoutRef.current), []);

  const handleInputChange = (value) => {
    setNewMessage(value);

    if (!socket || !activeConv || activeConv.isNew || !activeConv.conversationId) {
      return;
    }

    socket.emit('typing', {
      conversationId: activeConv.conversationId,
      userId: user._id,
      isTyping: true,
    });

    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('typing', {
        conversationId: activeConv.conversationId,
        userId: user._id,
        isTyping: false,
      });
    }, 1200);
  };

  const handleSend = async (e) => {
    e.preventDefault();

    if (!newMessage.trim() || !activeConv) {
      return;
    }

    const receiverId = activeConv.otherUser._id;
    const text = newMessage.trim();
    const optimisticConversationId =
      activeConv.conversationId !== 'new'
        ? activeConv.conversationId
        : [user._id, receiverId].sort().join('_');
    const tempId = `temp_${Date.now()}`;
    const tempMessage = {
      _id: tempId,
      sender: user,
      receiver: activeConv.otherUser,
      text,
      createdAt: new Date().toISOString(),
      conversationId: optimisticConversationId,
    };

    setNewMessage('');
    setMessages((prev) => [...prev, tempMessage]);
    scrollToBottom();

    if (socket && activeConv.conversationId !== 'new') {
      socket.emit('typing', {
        conversationId: activeConv.conversationId,
        userId: user._id,
        isTyping: false,
      });
    }

    try {
      const { data } = await sendMessage({
        receiver: receiverId,
        text,
      });

      setMessages((prev) => prev.map((message) => (message._id === tempId ? data : message)));

      const nextConversation = {
        conversationId: data.conversationId,
        otherUser: activeConv.otherUser,
        lastMessage: data.text,
        lastMessageDate: data.createdAt,
        unreadCount: 0,
      };

      setConversations((prev) => upsertConversation(prev, nextConversation));

      if (activeConv.isNew) {
        setActiveConv({
          ...nextConversation,
          isNew: false,
        });
      }

      if (socket) {
        socket.emit('sendMessage', {
          conversationId: data.conversationId,
          receiverId,
          message: data,
        });
      }
    } catch (error) {
      console.error(error);
      setMessages((prev) => prev.filter((message) => message._id !== tempId));
    }
  };

  const selectConversation = (conversation) => {
    setActiveConv({ ...conversation, isNew: false });
    setShowMobileList(false);
    setIsOtherUserTyping(false);

    if (conversation.unreadCount > 0) {
      setConversations((prev) =>
        prev.map((entry) =>
          entry.conversationId === conversation.conversationId ? { ...entry, unreadCount: 0 } : entry
        )
      );
    }
  };

  const filteredConversations = conversations.filter((conversation) =>
    conversation.otherUser?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <PageLoader />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="bg-bg-secondary rounded-2xl border border-border overflow-hidden shadow-xl shadow-black/10" style={{ height: 'calc(100vh - 10rem)' }}>
        <div className="flex h-full">
          <div className={`w-full md:w-80 lg:w-96 border-r border-border flex flex-col ${!showMobileList && activeConv ? 'hidden md:flex' : 'flex'}`}>
            <div className="p-4 border-b border-border bg-bg-card/50">
              <h2 className="text-lg font-bold text-text-primary mb-4">Messages</h2>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search conversations..."
                  className="w-full pl-9 pr-4 py-2.5 bg-bg-primary border border-border rounded-xl text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {filteredConversations.length === 0 ? (
                <div className="p-8 text-center text-text-muted text-sm">
                  {searchQuery ? 'No matches found' : 'No conversations yet. Start messaging sellers from their gig pages.'}
                </div>
              ) : (
                filteredConversations.map((conversation) => {
                  const isOnline = onlineUsers.includes(conversation.otherUser._id);
                  return (
                    <button
                      key={conversation.conversationId}
                      onClick={() => selectConversation(conversation)}
                      className={`w-full flex items-center gap-3 p-4 hover:bg-bg-card transition-colors text-left border-b border-border/50 last:border-0 ${activeConv?.conversationId === conversation.conversationId ? 'bg-primary/5' : ''}`}
                    >
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-inner">
                          {conversation.otherUser?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 border-2 border-bg-secondary rounded-full bg-bg-secondary">
                          <OnlineIndicator isOnline={isOnline} lastSeen={conversation.otherUser?.lastSeen} />
                        </div>
                        {conversation.unreadCount > 0 && (
                          <span className="absolute -top-1 -right-1 w-5 h-5 bg-error rounded-full text-white text-[10px] flex items-center justify-center font-bold border-2 border-bg-secondary">
                            {conversation.unreadCount}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-semibold text-text-primary truncate">{conversation.otherUser?.name}</span>
                          <span className="text-xs text-text-muted whitespace-nowrap ml-2">{timeAgo(conversation.lastMessageDate)}</span>
                        </div>
                        <p className={`text-xs truncate ${conversation.unreadCount > 0 ? 'text-primary font-medium' : 'text-text-secondary'}`}>
                          {conversation.lastMessage}
                        </p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          <div className={`flex-1 flex flex-col bg-[#0f172a] ${showMobileList && !activeConv ? 'hidden md:flex bg-bg-secondary' : 'flex'}`}>
            {activeConv ? (
              <>
                <div className="flex items-center justify-between p-4 border-b border-border bg-bg-secondary h-[76px]">
                  <div className="flex items-center gap-3">
                    <button onClick={() => setShowMobileList(true)} className="md:hidden text-text-secondary hover:text-text-primary p-2 -ml-2">
                      <ArrowLeft size={20} />
                    </button>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold flex-shrink-0">
                      {activeConv.otherUser?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-text-primary">{activeConv.otherUser?.name}</p>
                      <OnlineIndicator
                        showText={true}
                        isOnline={onlineUsers.includes(activeConv.otherUser._id)}
                        lastSeen={activeConv.otherUser?.lastSeen}
                        className="mt-0.5"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button className="p-2 text-text-secondary hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"><Phone size={18} /></button>
                    <button className="p-2 text-text-secondary hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"><Video size={18} /></button>
                    <button className="p-2 text-text-secondary hover:text-text-primary hover:bg-bg-card rounded-lg transition-colors"><MoreVertical size={18} /></button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {loadingMessages ? (
                    <div className="flex justify-center items-center h-full">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-text-muted">
                      <div className="text-4xl mb-3">Hi</div>
                      <p className="text-sm">Say hello to {activeConv.otherUser?.name}.</p>
                    </div>
                  ) : (
                    messages.map((message, index) => {
                      const senderId = message.sender?._id || message.sender;
                      const nextSenderId = messages[index + 1]?.sender?._id || messages[index + 1]?.sender;
                      const isMe = senderId === user._id;
                      const showAvatar = !isMe && (index === messages.length - 1 || nextSenderId !== senderId);

                      return (
                        <div key={message._id} className={`flex max-w-[80%] ${isMe ? 'ml-auto justify-end' : 'mr-auto justify-start'}`}>
                          {!isMe && (
                            <div className="w-8 shrink-0 mr-2 flex items-end">
                              {showAvatar && (
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xs font-bold shadow-md">
                                  {activeConv.otherUser?.name?.charAt(0).toUpperCase()}
                                </div>
                              )}
                            </div>
                          )}
                          <div>
                            <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${isMe ? 'bg-primary text-white rounded-br-sm' : 'bg-bg-secondary border border-border text-text-primary rounded-bl-sm'}`}>
                              {message.text}
                            </div>
                            <p className={`text-[10px] text-text-muted mt-1 px-1 ${isMe ? 'text-right' : ''}`}>
                              {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}

                  {isOtherUserTyping && (
                    <div className="flex justify-start">
                      <TypingIndicator />
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                <form onSubmit={handleSend} className="p-4 border-t border-border bg-bg-secondary">
                  <div className="flex items-center gap-2">
                    <button type="button" className="p-2 text-text-muted hover:text-text-primary hover:bg-bg-card rounded-full transition-colors"><Paperclip size={20} /></button>
                    <button type="button" className="p-2 text-text-muted hover:text-text-primary hover:bg-bg-card rounded-full transition-colors"><Smile size={20} /></button>
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => handleInputChange(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 bg-bg-primary border border-border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:border-primary shadow-inner"
                    />
                    <button
                      type="submit"
                      disabled={!newMessage.trim()}
                      className="p-3 bg-primary hover:bg-primary-hover text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20 active:scale-95"
                    >
                      <Send size={18} className="translate-x-[2px] -translate-y-[2px]" />
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center p-8 bg-bg-secondary/50 rounded-3xl border border-border block">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <MessageSquare className="text-primary w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-bold text-text-primary mb-2">Your Messages</h3>
                  <p className="text-text-secondary text-sm max-w-sm">Select a conversation from the sidebar to start chatting, or explore gigs to find sellers.</p>
                  <button onClick={() => navigate('/gigs')} className="mt-6 text-primary font-medium hover:text-primary-hover text-sm underline-offset-4 hover:underline">
                    Explore Gigs
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
