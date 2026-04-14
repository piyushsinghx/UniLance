import { useState, useEffect, useRef } from 'react';
import { Send, Search, Phone, Video, MoreVertical, Smile, Paperclip, ArrowLeft } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import { timeAgo } from '../utils/formatDate';

const MOCK_CONVERSATIONS = [
  { conversationId: 'c1', otherUser: { _id: 'u1', name: 'Alex Chen', avatar: '' }, lastMessage: 'Hey! I can start working on your project today.', lastMessageDate: '2024-11-02T14:30:00', unreadCount: 2 },
  { conversationId: 'c2', otherUser: { _id: 'u2', name: 'Sarah Kim', avatar: '' }, lastMessage: 'The logo designs are ready for review!', lastMessageDate: '2024-11-02T10:15:00', unreadCount: 0 },
  { conversationId: 'c3', otherUser: { _id: 'u3', name: 'James Wilson', avatar: '' }, lastMessage: 'Sure, I can include 3 revisions in the package.', lastMessageDate: '2024-11-01T19:45:00', unreadCount: 1 },
  { conversationId: 'c4', otherUser: { _id: 'u4', name: 'Maya Patel', avatar: '' }, lastMessage: 'Thanks for the great review! 😊', lastMessageDate: '2024-10-31T08:20:00', unreadCount: 0 },
  { conversationId: 'c5', otherUser: { _id: 'u5', name: 'David Park', avatar: '' }, lastMessage: 'The mobile app is deployed to TestFlight.', lastMessageDate: '2024-10-30T22:00:00', unreadCount: 0 },
];

const MOCK_MESSAGES = {
  c1: [
    { _id: 'm1', sender: { _id: 'u1', name: 'Alex Chen' }, text: 'Hi! I saw you need a React website. I\'d love to help!', createdAt: '2024-11-02T10:00:00' },
    { _id: 'm2', sender: { _id: 'me', name: 'You' }, text: 'Yes! Can you build a landing page with a dashboard?', createdAt: '2024-11-02T10:05:00' },
    { _id: 'm3', sender: { _id: 'u1', name: 'Alex Chen' }, text: 'Absolutely! I recommend using React + Tailwind for the frontend and Node.js for the backend. I can deliver in 5 days.', createdAt: '2024-11-02T10:10:00' },
    { _id: 'm4', sender: { _id: 'me', name: 'You' }, text: 'That sounds great! What tier would you recommend?', createdAt: '2024-11-02T12:30:00' },
    { _id: 'm5', sender: { _id: 'u1', name: 'Alex Chen' }, text: 'For a landing page + dashboard, I\'d suggest the Standard tier ($120). It includes up to 5 pages, animations, and SEO setup.', createdAt: '2024-11-02T13:00:00' },
    { _id: 'm6', sender: { _id: 'me', name: 'You' }, text: 'Perfect, let me place the order!', createdAt: '2024-11-02T14:00:00' },
    { _id: 'm7', sender: { _id: 'u1', name: 'Alex Chen' }, text: 'Hey! I can start working on your project today.', createdAt: '2024-11-02T14:30:00' },
  ],
  c2: [
    { _id: 'm10', sender: { _id: 'u2', name: 'Sarah Kim' }, text: 'Hi! I\'ve started working on your logo concepts.', createdAt: '2024-11-01T09:00:00' },
    { _id: 'm11', sender: { _id: 'me', name: 'You' }, text: 'Great! I love the direction. Can we try a more minimal approach?', createdAt: '2024-11-01T15:30:00' },
    { _id: 'm12', sender: { _id: 'u2', name: 'Sarah Kim' }, text: 'The logo designs are ready for review!', createdAt: '2024-11-02T10:15:00' },
  ],
};

const Messages = () => {
  const { user } = useAuth();
  const [conversations] = useState(MOCK_CONVERSATIONS);
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileList, setShowMobileList] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (activeConv) {
      setMessages(MOCK_MESSAGES[activeConv.conversationId] || []);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  }, [activeConv]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    const msg = {
      _id: `m_${Date.now()}`,
      sender: { _id: 'me', name: user?.name || 'You' },
      text: newMessage,
      createdAt: new Date().toISOString(),
    };
    setMessages([...messages, msg]);
    setNewMessage('');
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
  };

  const selectConversation = (conv) => {
    setActiveConv(conv);
    setShowMobileList(false);
  };

  const filteredConversations = conversations.filter((c) =>
    c.otherUser.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-bg-secondary rounded-2xl border border-border overflow-hidden" style={{ height: 'calc(100vh - 10rem)' }}>
        <div className="flex h-full">
          {/* Conversation list */}
          <div className={`w-full md:w-80 lg:w-96 border-r border-border flex flex-col ${!showMobileList && activeConv ? 'hidden md:flex' : 'flex'}`}>
            <div className="p-4 border-b border-border">
              <h2 className="text-lg font-bold text-text-primary mb-3">Messages</h2>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search conversations..."
                  className="w-full pl-9 pr-4 py-2.5 bg-bg-primary border border-border rounded-lg text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:border-primary"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.map((conv) => (
                <button
                  key={conv.conversationId}
                  onClick={() => selectConversation(conv)}
                  className={`w-full flex items-center gap-3 p-4 hover:bg-bg-card transition-colors text-left ${activeConv?.conversationId === conv.conversationId ? 'bg-bg-card' : ''}`}
                >
                  <div className="relative">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                      {conv.otherUser.name.charAt(0)}
                    </div>
                    {conv.unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full text-white text-xs flex items-center justify-center font-bold">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-sm font-semibold text-text-primary truncate">{conv.otherUser.name}</span>
                      <span className="text-xs text-text-muted">{timeAgo(conv.lastMessageDate)}</span>
                    </div>
                    <p className={`text-xs truncate ${conv.unreadCount > 0 ? 'text-text-primary font-medium' : 'text-text-muted'}`}>
                      {conv.lastMessage}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Chat area */}
          <div className={`flex-1 flex flex-col ${showMobileList && !activeConv ? 'hidden md:flex' : 'flex'}`}>
            {activeConv ? (
              <>
                {/* Chat header */}
                <div className="flex items-center justify-between p-4 border-b border-border">
                  <div className="flex items-center gap-3">
                    <button onClick={() => setShowMobileList(true)} className="md:hidden text-text-secondary hover:text-text-primary">
                      <ArrowLeft size={20} />
                    </button>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-semibold text-sm">
                      {activeConv.otherUser.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-text-primary">{activeConv.otherUser.name}</p>
                      <p className="text-xs text-success">Online</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-text-secondary hover:text-text-primary hover:bg-bg-card rounded-lg transition-colors"><Phone size={18} /></button>
                    <button className="p-2 text-text-secondary hover:text-text-primary hover:bg-bg-card rounded-lg transition-colors"><Video size={18} /></button>
                    <button className="p-2 text-text-secondary hover:text-text-primary hover:bg-bg-card rounded-lg transition-colors"><MoreVertical size={18} /></button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((msg) => {
                    const isMe = msg.sender._id === 'me';
                    return (
                      <div key={msg._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[75%] ${isMe ? 'order-2' : ''}`}>
                          <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                            isMe
                              ? 'bg-primary text-white rounded-br-md'
                              : 'bg-bg-card text-text-primary rounded-bl-md'
                          }`}>
                            {msg.text}
                          </div>
                          <p className={`text-xs text-text-muted mt-1 ${isMe ? 'text-right' : ''}`}>
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <form onSubmit={handleSend} className="p-4 border-t border-border">
                  <div className="flex items-center gap-3">
                    <button type="button" className="text-text-muted hover:text-text-primary transition-colors"><Paperclip size={20} /></button>
                    <button type="button" className="text-text-muted hover:text-text-primary transition-colors"><Smile size={20} /></button>
                    <input
                      type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type a message..."
                      className="flex-1 bg-bg-primary border border-border rounded-xl px-4 py-2.5 text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:border-primary"
                    />
                    <button type="submit" disabled={!newMessage.trim()}
                      className="p-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                      <Send size={18} />
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">💬</div>
                  <h3 className="text-xl font-semibold text-text-primary mb-2">Start a conversation</h3>
                  <p className="text-text-secondary text-sm">Select a chat from the sidebar to start messaging</p>
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
