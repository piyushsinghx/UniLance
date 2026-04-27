import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Clock, Heart, Sparkles, ShoppingBag } from 'lucide-react';
import { formatPrice, truncate } from '../utils/formatDate';
import OnlineIndicator from './OnlineIndicator';

const categoryColors = {
  'web-development':   'from-blue-500 to-indigo-600',
  'design':            'from-pink-500 to-rose-600',
  'writing':           'from-emerald-500 to-teal-600',
  'video-editing':     'from-purple-500 to-violet-600',
  'mobile-development':'from-orange-500 to-amber-600',
  'data-science':      'from-cyan-500 to-blue-600',
  'marketing':         'from-yellow-500 to-orange-600',
  'other':             'from-gray-500 to-slate-600',
};

const categoryLabels = {
  'web-development':   'Web Dev',
  'design':            'Design',
  'writing':           'Writing',
  'video-editing':     'Video',
  'mobile-development':'Mobile',
  'data-science':      'Data Science',
  'marketing':         'Marketing',
  'other':             'Other',
};

const GigCard = ({ gig, isRecommended = false }) => {
  const { _id, title, images, pricing, rating, reviewCount, seller, category, orderCount } = gig;
  const [liked, setLiked] = useState(false);

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="group relative bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border)] overflow-hidden cursor-pointer"
      style={{ perspective: '1000px' }}
    >
      {/* Glow on hover */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ boxShadow: '0 0 0 1px rgba(99,102,241,0.4), 0 20px 40px rgba(99,102,241,0.12)' }} />

      <Link to={`/gigs/${_id}`} className="block">
        {/* Image — 16:9 aspect ratio */}
        <div className="relative overflow-hidden" style={{ aspectRatio: '16/9' }}>
          {images?.length > 0 ? (
            <img
              src={images[0]}
              alt={title}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${categoryColors[category] || 'from-[var(--color-primary)] to-[var(--color-accent)]'} flex items-center justify-center`}>
              <span className="text-white/70 text-5xl font-black">{title?.charAt(0)}</span>
            </div>
          )}

          {/* Bottom overlay with seller info */}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/70 to-transparent flex items-end p-3">
            <div className="flex items-center gap-2">
              <div className="relative shrink-0">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center text-white text-xs font-bold ring-2 ring-white/20">
                  {seller?.name?.charAt(0) || 'U'}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5">
                  <OnlineIndicator isOnline={seller?.isOnline} size="sm" />
                </div>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate">{seller?.name || 'Unknown'}</p>
                {seller?.university && <p className="text-[10px] text-white/60 truncate">{seller.university}</p>}
              </div>
            </div>
          </div>

          {/* Category badge */}
          <div className="absolute top-3 left-3">
            <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white bg-black/50 backdrop-blur-sm rounded-full">
              {categoryLabels[category] || category}
            </span>
          </div>

          {/* Recommended badge */}
          {isRecommended && (
            <div className="absolute top-3 right-10">
              <span className="flex items-center gap-1 px-2 py-1 text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] text-white rounded-full shadow-lg">
                <Sparkles size={9} /> AI Pick
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Title */}
          <h3 className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-[var(--color-primary)] transition-colors leading-snug mb-3 line-clamp-2">
            {truncate(title, 65)}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-3">
            {[1,2,3,4,5].map(s => (
              <Star key={s} size={12} className={s <= Math.round(rating || 0) ? 'fill-[var(--color-warning)] text-[var(--color-warning)]' : 'text-[var(--text-muted)]'} />
            ))}
            <span className="text-xs font-bold text-[var(--color-warning)] ml-1">{(rating || 0).toFixed(1)}</span>
            <span className="text-xs text-[var(--text-muted)]">({reviewCount || 0})</span>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-[var(--border)]">
            <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
              {pricing?.basic?.deliveryDays && (
                <span className="flex items-center gap-1">
                  <Clock size={11} /> {pricing.basic.deliveryDays}d delivery
                </span>
              )}
              {orderCount > 0 && (
                <span className="flex items-center gap-1">
                  <ShoppingBag size={11} /> {orderCount}
                </span>
              )}
            </div>
            <div className="text-right">
              <p className="text-[10px] text-[var(--text-muted)]">Starting at</p>
              <p className="text-base font-black text-[var(--color-primary)]">
                {formatPrice(pricing?.basic?.price || 0)}
              </p>
            </div>
          </div>
        </div>
      </Link>

      {/* Heart button (outside link) */}
      <button
        onClick={(e) => { e.preventDefault(); setLiked(!liked); }}
        className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center transition-all hover:scale-110"
      >
        <motion.div animate={{ scale: liked ? [1, 1.4, 1] : 1 }} transition={{ duration: 0.3 }}>
          <Heart size={13} className={liked ? 'fill-red-500 text-red-500' : 'text-white'} />
        </motion.div>
      </button>
    </motion.div>
  );
};

export default GigCard;
