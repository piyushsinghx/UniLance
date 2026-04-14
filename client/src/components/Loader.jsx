const Loader = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`${sizes[size]} border-3 border-border border-t-primary rounded-full animate-spin`}></div>
    </div>
  );
};

export const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-bg-primary">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-3 border-border border-t-primary rounded-full animate-spin"></div>
      <p className="text-text-secondary text-sm">Loading...</p>
    </div>
  </div>
);

export const SkeletonCard = () => (
  <div className="bg-bg-secondary rounded-xl border border-border overflow-hidden animate-pulse">
    <div className="h-44 bg-bg-card"></div>
    <div className="p-4 space-y-3">
      <div className="h-4 bg-bg-card rounded w-3/4"></div>
      <div className="h-3 bg-bg-card rounded w-1/2"></div>
      <div className="flex justify-between">
        <div className="h-4 bg-bg-card rounded w-1/4"></div>
        <div className="h-4 bg-bg-card rounded w-1/4"></div>
      </div>
    </div>
  </div>
);

export default Loader;
