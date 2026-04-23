import { Link } from 'react-router-dom';
import { Star, Clock, Sparkles } from 'lucide-react';
import { formatPrice, truncate } from '../utils/formatDate';
import OnlineIndicator from './OnlineIndicator';

const GigCard = ({ gig, isRecommended = false }) => {
  const {
    _id,
    title,
    images,
    pricing,
    rating,
    reviewCount,
    seller,
    category,
  } = gig;

  const categoryLabels = {
    'web-development': 'Web Dev',
    'design': 'Design',
    'writing': 'Writing',
    'video-editing': 'Video',
    'mobile-development': 'Mobile',
    'data-science': 'Data Science',
    'marketing': 'Marketing',
    'other': 'Other',
  };

  const categoryColors = {
    'web-development': 'from-blue-500 to-indigo-600',
    'design': 'from-pink-500 to-rose-600',
    'writing': 'from-emerald-500 to-teal-600',
    'video-editing': 'from-purple-500 to-violet-600',
    'mobile-development': 'from-orange-500 to-amber-600',
    'data-science': 'from-cyan-500 to-blue-600',
    'marketing': 'from-yellow-500 to-orange-600',
    'other': 'from-gray-500 to-slate-600',
  };

  return (
    <Link to={`/gigs/${_id}`} className="group block">
      <div className="bg-bg-secondary rounded-xl border border-border overflow-hidden card-hover">
        {/* Image */}
        <div className="relative h-44 bg-bg-card overflow-hidden">
          {images && images.length > 0 ? (
            <img src={images[0]} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${categoryColors[category] || 'from-primary to-accent'} flex items-center justify-center`}>
              <span className="text-white/80 text-4xl font-bold">{title?.charAt(0)}</span>
            </div>
          )}
          <div className="absolute top-3 left-3">
            <span className="px-2.5 py-1 text-xs font-medium text-white bg-black/40 backdrop-blur-sm rounded-full">
              {categoryLabels[category] || category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 relative">
          {/* AI Badge */}
          {isRecommended && (
            <div className="absolute -top-3 right-3 bg-gradient-to-r from-primary to-accent text-white text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1 shadow-lg shadow-primary/30">
              <Sparkles size={10} />
              AI Recommended
            </div>
          )}

          {/* Seller */}
          <div className="flex items-center gap-2 mb-2">
            <div className="relative">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xs font-semibold">
                {seller?.name?.charAt(0) || 'U'}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5">
                <OnlineIndicator isOnline={seller?.isOnline} size="sm" />
              </div>
            </div>
            <span className="text-xs text-text-secondary font-medium">{seller?.name || 'Unknown'}</span>
            {seller?.university && (
              <span className="text-xs text-text-muted">• {seller.university}</span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-sm font-semibold text-text-primary group-hover:text-primary transition-colors leading-snug mb-3">
            {truncate(title, 60)}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-3">
            <Star size={14} className="fill-warning text-warning" />
            <span className="text-sm font-semibold text-warning">{rating?.toFixed(1) || '0.0'}</span>
            <span className="text-xs text-text-muted">({reviewCount || 0})</span>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between pt-3 border-t border-border">
            <span className="text-xs text-text-muted uppercase tracking-wide">Starting at</span>
            <span className="text-lg font-bold text-text-primary">
              {formatPrice(pricing?.basic?.price || 0)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default GigCard;
