import { useState, useRef, useEffect } from 'react';
import { Bell, Check, Circle } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';
import { timeAgo } from '../utils/formatDate';
import { Link } from 'react-router-dom';

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { notifications, unreadCount, handleMarkAsRead, handleMarkAllAsRead } = useNotification();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getLink = (notification) => {
    if (notification.data?.link) {
      return notification.data.link;
    }

    switch (notification.type) {
      case 'new_order':
      case 'order_update':
      case 'order_delivered':
      case 'order_completed':
        return notification.data?.orderId ? `/dashboard/orders/${notification.data.orderId}` : '/dashboard/orders';
      case 'new_message':
        return notification.data?.userId ? `/messages?to=${notification.data.userId}` : '/messages';
      case 'new_review':
        return `/gigs/${notification.data?.gigId}`;
      default:
        return '#';
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'new_order': return '🎉';
      case 'order_update': return '🔄';
      case 'order_delivered': return '📦';
      case 'order_completed': return '✅';
      case 'new_message': return '💬';
      case 'new_review': return '⭐';
      case 'payment': return '💰';
      default: return '🔔';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-text-secondary hover:text-text-primary hover:bg-bg-card rounded-full transition-colors focus-ring"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-error text-[10px] font-bold text-white flex items-center justify-center rounded-full border-2 border-bg-primary">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-bg-secondary border border-border shadow-2xl rounded-xl overflow-hidden animate-fade-in z-50">
          <div className="p-4 border-b border-border flex items-center justify-between bg-bg-card/50">
            <h3 className="font-semibold text-text-primary">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-xs font-medium text-primary hover:text-primary-hover flex items-center gap-1 transition-colors"
              >
                <Check size={14} /> Mark all read
              </button>
            )}
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-text-muted text-sm">
                No notifications yet.
              </div>
            ) : (
              <div className="divide-y divide-border">
                {notifications.map((notification) => (
                  <div
                    key={notification._id}
                    className={`flex items-start gap-4 p-4 hover:bg-bg-card transition-colors ${!notification.read ? 'bg-primary/5' : ''}`}
                  >
                    <div className="text-xl shrink-0 mt-1">
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link
                        to={getLink(notification)}
                        onClick={() => {
                          if (!notification.read) handleMarkAsRead(notification._id);
                          setIsOpen(false);
                        }}
                        className="block group"
                      >
                        <p className="text-sm font-medium text-text-primary group-hover:text-primary transition-colors">
                          {notification.title}
                        </p>
                        <p className="text-xs text-text-secondary mt-1 break-words">
                          {notification.message}
                        </p>
                        <p className="text-[11px] text-text-muted mt-2">
                          {timeAgo(notification.createdAt)}
                        </p>
                      </Link>
                    </div>
                    {!notification.read && (
                      <button
                        onClick={() => handleMarkAsRead(notification._id)}
                        className="p-1 text-primary hover:text-primary-hover shrink-0 mt-1"
                        title="Mark as read"
                      >
                        <Circle size={10} className="fill-current" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {notifications.length > 0 && (
            <div className="p-3 border-t border-border bg-bg-card/30 text-center">
              <Link to="/dashboard" className="text-xs text-text-secondary hover:text-primary transition-colors">
                Open dashboard
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
