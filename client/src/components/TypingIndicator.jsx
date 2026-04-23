const TypingIndicator = () => {
  return (
    <div className="flex items-center gap-1 bg-bg-card px-3 py-2 rounded-2xl w-fit mb-2">
      <div className="w-1.5 h-1.5 bg-text-muted rounded-full animate-[bounce_1.4s_infinite_0s]"></div>
      <div className="w-1.5 h-1.5 bg-text-muted rounded-full animate-[bounce_1.4s_infinite_0.2s]"></div>
      <div className="w-1.5 h-1.5 bg-text-muted rounded-full animate-[bounce_1.4s_infinite_0.4s]"></div>
    </div>
  );
};

export default TypingIndicator;
