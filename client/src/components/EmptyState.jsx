import { SearchX, Inbox, PackageMinus, MapPinOff } from 'lucide-react';
import Button from './Button';
import { Link } from 'react-router-dom';

const EmptyState = ({
  icon: Icon = Inbox,
  title = 'Nothing to see here',
  description = 'There are no items to display at this time.',
  actionLabel,
  actionLink,
  actionOnClick,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 md:p-12 text-center rounded-xl border border-dashed border-border bg-bg-card/20 ${className}`}>
      <div className="w-16 h-16 rounded-full bg-bg-card flex items-center justify-center mb-4 shadow-inner">
        <Icon size={32} className="text-text-muted" />
      </div>
      <h3 className="text-lg font-semibold text-text-primary mb-2">{title}</h3>
      <p className="text-text-secondary text-sm max-w-md mx-auto mb-6">{description}</p>
      
      {actionLabel && (
        actionLink ? (
          <Link to={actionLink}>
            <Button variant="primary" size="sm">{actionLabel}</Button>
          </Link>
        ) : (
          <Button variant="primary" size="sm" onClick={actionOnClick}>
            {actionLabel}
          </Button>
        )
      )}
    </div>
  );
};

export const SearchEmptyState = ({ query }) => (
  <EmptyState
    icon={SearchX}
    title="No results found"
    description={query ? `We couldn't find any matches for "${query}". Try adjusting your search or filters.` : "Start typing to search."}
  />
);

export const OrderEmptyState = ({ isSeller }) => (
  <EmptyState
    icon={PackageMinus}
    title="No active orders"
    description={isSeller ? "You don't have any active orders right now. Optimize your gigs to get more views!" : "You haven't placed any orders yet. Explore gigs to find what you need."}
    actionLabel={isSeller ? "View My Gigs" : "Explore Gigs"}
    actionLink={isSeller ? "/dashboard/gigs" : "/gigs"}
  />
);

export default EmptyState;
