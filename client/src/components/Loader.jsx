// Skeleton loaders with shimmer animation

const SkeletonBlock = ({ className = '' }) => (
  <div className={`skeleton rounded-xl ${className}`} />
);

export const SkeletonCard = () => (
  <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border)] overflow-hidden">
    <div className="skeleton" style={{ aspectRatio: '16/9' }} />
    <div className="p-4 space-y-3">
      <SkeletonBlock className="h-4 w-3/4" />
      <SkeletonBlock className="h-3 w-1/2" />
      <div className="flex gap-1 pt-1">
        {[1,2,3,4,5].map(i => <SkeletonBlock key={i} className="h-3 w-3 rounded-sm" />)}
      </div>
      <div className="flex justify-between pt-2 border-t border-[var(--border)]">
        <SkeletonBlock className="h-3 w-16" />
        <SkeletonBlock className="h-5 w-20" />
      </div>
    </div>
  </div>
);

export const SkeletonRow = () => (
  <div className="flex items-center gap-4 p-4">
    <SkeletonBlock className="h-10 w-10 rounded-full shrink-0" />
    <div className="flex-1 space-y-2">
      <SkeletonBlock className="h-3 w-1/3" />
      <SkeletonBlock className="h-3 w-1/2" />
    </div>
    <SkeletonBlock className="h-6 w-16 rounded-full" />
  </div>
);

export const SkeletonDashboard = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border)] p-5 space-y-3">
          <SkeletonBlock className="h-10 w-10 rounded-xl" />
          <SkeletonBlock className="h-7 w-24" />
          <SkeletonBlock className="h-3 w-16" />
        </div>
      ))}
    </div>
    <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border)] p-6">
      <SkeletonBlock className="h-5 w-32 mb-4" />
      <SkeletonBlock className="h-56 w-full" />
    </div>
  </div>
);

export const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
      </div>
      <p className="text-sm text-[var(--text-muted)] font-medium">Loading...</p>
    </div>
  </div>
);

// Legacy default export
const Loader = ({ fullScreen = false }) => {
  if (fullScreen) return <PageLoader />;
  return (
    <div className="flex items-center justify-center p-8">
      <div className="w-8 h-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
    </div>
  );
};

export default Loader;
