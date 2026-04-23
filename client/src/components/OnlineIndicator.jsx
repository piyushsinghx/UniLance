import { useMemo } from 'react';
import { timeAgo } from '../utils/formatDate';

const OnlineIndicator = ({ 
  isOnline, 
  lastSeen, 
  size = 'md',
  showText = false,
  className = ''
}) => {
  const sizes = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  };

  const tooltipText = useMemo(() => {
    if (isOnline) return 'Online now';
    if (!lastSeen) return 'Offline';
    return `Last seen ${timeAgo(lastSeen)}`;
  }, [isOnline, lastSeen]);

  return (
    <div className={`flex items-center gap-2 ${className}`} title={tooltipText}>
      <div className="relative">
        <div className={`${sizes[size]} rounded-full ${isOnline ? 'bg-success' : 'bg-text-muted'} border-2 border-bg-secondary`}></div>
        {isOnline && (
          <div className={`absolute top-0 left-0 ${sizes[size]} rounded-full bg-success animate-ping opacity-75`}></div>
        )}
      </div>
      {showText && (
        <span className="text-xs text-text-secondary truncate">
          {isOnline ? 'Online' : tooltipText}
        </span>
      )}
    </div>
  );
};

export default OnlineIndicator;
