const OnlineIndicator = ({ isOnline, size = 'md' }) => {
  if (!isOnline) return null;

  const sizes = {
    sm: 'w-2.5 h-2.5',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  };

  return (
    <div className={`relative ${sizes[size]}`}>
      <div className="absolute inset-0 rounded-full bg-[var(--color-success)]" />
      <div className="absolute inset-0 rounded-full bg-[var(--color-success)] animate-ping opacity-60" style={{ animationDuration: '1.5s' }} />
    </div>
  );
};

export default OnlineIndicator;
