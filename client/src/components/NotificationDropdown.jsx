import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Check, Circle, ShoppingCart, MessageSquare, Star, CheckCircle } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';
import { timeAgo } from '../utils/formatDate';
import { Link } from 'react-router-dom';

const TYPE_CONFIG = {
  new_order:       { icon: ShoppingCart, color: 'text-[var(--color-primary)] bg-[var(--color-primary)]/10', emoji: '🎉' },
  order_update:    { icon: CheckCircle,  color: 'text-[var(--color-accent)] bg-[var(--color-accent)]/10', emoji: '🔄' },
  order_delivered: { icon: CheckCircle,  color: 'text-[var(--color-success)] bg-[var(--color-success)]/10', emoji: '📦' },
  order_completed: { icon: CheckCircle,  color: 'text-[var(--color-success)] bg-[var(--color-success)]/10', emoji: '✅' },
  new_message:     { icon: MessageSquare,color: 'text-[var(--color-accent)] bg-[var(--color-accent)]/10', emoji: '💬' },
  new_review:      { icon: Star,         color: 'text-[var(--color-warning)] bg-[var(--color-warning)]/10', emoji: '⭐' },
  payment:         { icon: CheckCircle,  color: 'text-[var(--color-success)] bg-[var(--color-success)]/10', emoji: '💰' },
};

const getLink = (n) => {
  if (n.data?.link) return n.data.link;
  switch (n.type) {
    case 'new_order':
    case 'order_update':
    case 'order_delivered':
    case 'order_completed':
      return n.data?.orderId ? `/dashboard/orders/${n.data.orderId}` : '/dashboard/orders';
    case 'new_message':
      return n.data?.userId ? `/messages?to=${n.data.userId}` : '/messages';
    case 'new_review':
      return `/gigs/${n.data?.gigId}`;
    default:
      return '#';
  }
};

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { notifications, unreadCount, handleMarkAsRead, handleMarkAllAsRead } = useNotification();

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-9 h-9 flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--color-primary)] hover:bg-[var(--bg-hover)] rounded-xl transition-colors focus-ring"
      >
        <Bell size={18} />
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-[var(--color-error)] text-[9px] font-black text-white flex items-center justify-center rounded-full px-1 border-2 border-[var(--bg-primary)] badge-pulse"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute right-0 mt-2 w-80 sm:w-96 glass shadow-2xl rounded-2xl overflow-hidden border border-[var(--border)] z-50"
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-[var(--border)] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-[var(--text-primary)] text-sm">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="flex items-center gap-1 text-xs font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors"
                >
                  <Check size={13} /> Mark all read
                </button>
              )}
            </div>

            {/* List */}
            <div className="max-h-[380px] overflow-y-auto no-scrollbar">
              {notifications.length === 0 ? (
                <div className="py-12 text-center">
                  <Bell size={32} className="mx-auto mb-3 text-[var(--text-muted)] opacity-40" />
                  <p className="text-sm text-[var(--text-muted)]">You're all caught up!</p>
                </div>
              ) : (
                <div className="divide-y divide-[var(--border)]">
                  {notifications.map((n) => {
                    const cfg = TYPE_CONFIG[n.type] || {};
                    const Icon = cfg.icon || Bell;
                    return (
                      <motion.div
                        key={n._id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`flex items-start gap-3 p-4 hover:bg-[var(--bg-hover)]/30 transition-colors ${!n.read ? 'bg-[var(--color-primary)]/5' : ''}`}
                      >
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${cfg.color || 'text-[var(--text-muted)] bg-[var(--bg-hover)]'}`}>
                          <Icon size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <Link
                            to={getLink(n)}
                            onClick={() => { if (!n.read) handleMarkAsRead(n._id); setIsOpen(false); }}
                            className="block group"
                          >
                            <p className="text-xs font-semibold text-[var(--text-primary)] group-hover:text-[var(--color-primary)] transition-colors line-clamp-1">
                              {n.title}
                            </p>
                            <p className="text-xs text-[var(--text-muted)] mt-0.5 line-clamp-2">{n.message}</p>
                            <p className="text-[10px] text-[var(--text-muted)]/60 mt-1">{timeAgo(n.createdAt)}</p>
                          </Link>
                        </div>
                        {!n.read && (
                          <button
                            onClick={() => handleMarkAsRead(n._id)}
                            className="shrink-0 mt-1 text-[var(--color-primary)] hover:text-[var(--color-primary-hover)]"
                            title="Mark as read"
                          >
                            <Circle size={8} className="fill-current" />
                          </button>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="px-4 py-3 border-t border-[var(--border)] text-center">
                <Link
                  to="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="text-xs font-semibold text-[var(--color-primary)] hover:underline"
                >
                  View all in dashboard →
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationDropdown;
