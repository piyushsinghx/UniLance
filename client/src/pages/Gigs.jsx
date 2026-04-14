import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import GigCard from '../components/GigCard';
import { SkeletonCard } from '../components/Loader';
import Button from '../components/Button';

// Mock data for demo
const MOCK_GIGS = [
  { _id: '1', title: 'I will build a modern React website with Tailwind CSS', category: 'web-development', pricing: { basic: { price: 50, deliveryDays: 3 } }, rating: 4.9, reviewCount: 127, seller: { name: 'Alex Chen', university: 'MIT' }, images: [] },
  { _id: '2', title: 'Professional logo and brand identity design', category: 'design', pricing: { basic: { price: 35, deliveryDays: 2 } }, rating: 4.8, reviewCount: 89, seller: { name: 'Sarah Kim', university: 'Stanford' }, images: [] },
  { _id: '3', title: 'SEO-optimized blog posts and article writing', category: 'writing', pricing: { basic: { price: 25, deliveryDays: 1 } }, rating: 4.7, reviewCount: 203, seller: { name: 'James Wilson', university: 'Harvard' }, images: [] },
  { _id: '4', title: 'Cinematic video editing with motion graphics', category: 'video-editing', pricing: { basic: { price: 75, deliveryDays: 5 } }, rating: 5.0, reviewCount: 56, seller: { name: 'Maya Patel', university: 'UCLA' }, images: [] },
  { _id: '5', title: 'Full-stack mobile app development in React Native', category: 'mobile-development', pricing: { basic: { price: 150, deliveryDays: 7 } }, rating: 4.9, reviewCount: 34, seller: { name: 'David Park', university: 'CMU' }, images: [] },
  { _id: '6', title: 'Data analysis and visualization with Python', category: 'data-science', pricing: { basic: { price: 45, deliveryDays: 3 } }, rating: 4.6, reviewCount: 78, seller: { name: 'Emma Liu', university: 'Berkeley' }, images: [] },
  { _id: '7', title: 'Social media marketing strategy and content', category: 'marketing', pricing: { basic: { price: 40, deliveryDays: 4 } }, rating: 4.8, reviewCount: 112, seller: { name: 'Ryan Taylor', university: 'NYU' }, images: [] },
  { _id: '8', title: 'Custom UI/UX design for web and mobile apps', category: 'design', pricing: { basic: { price: 60, deliveryDays: 4 } }, rating: 4.9, reviewCount: 95, seller: { name: 'Lily Zhang', university: 'Parsons' }, images: [] },
  { _id: '9', title: 'Node.js and Express REST API development', category: 'web-development', pricing: { basic: { price: 80, deliveryDays: 5 } }, rating: 4.7, reviewCount: 62, seller: { name: 'Tom Miller', university: 'Georgia Tech' }, images: [] },
  { _id: '10', title: 'WordPress website design and customization', category: 'web-development', pricing: { basic: { price: 30, deliveryDays: 2 } }, rating: 4.5, reviewCount: 145, seller: { name: 'Sophia Lee', university: 'USC' }, images: [] },
  { _id: '11', title: 'Professional resume and cover letter writing', category: 'writing', pricing: { basic: { price: 20, deliveryDays: 1 } }, rating: 4.9, reviewCount: 320, seller: { name: 'Michael Brown', university: 'UPenn' }, images: [] },
  { _id: '12', title: 'Animated explainer video creation', category: 'video-editing', pricing: { basic: { price: 100, deliveryDays: 7 } }, rating: 4.8, reviewCount: 42, seller: { name: 'Isabella Martinez', university: 'Emerson' }, images: [] },
];

const CATEGORIES = [
  { value: '', label: 'All Categories' },
  { value: 'web-development', label: 'Web Development' },
  { value: 'design', label: 'Design' },
  { value: 'writing', label: 'Writing' },
  { value: 'video-editing', label: 'Video Editing' },
  { value: 'mobile-development', label: 'Mobile Dev' },
  { value: 'data-science', label: 'Data Science' },
  { value: 'marketing', label: 'Marketing' },
];

const Gigs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    minPrice: '',
    maxPrice: '',
    rating: '',
    sort: 'newest',
  });

  useEffect(() => {
    setLoading(true);
    // Simulate API call with filtering
    const timer = setTimeout(() => {
      let filtered = [...MOCK_GIGS];
      if (filters.category) filtered = filtered.filter((g) => g.category === filters.category);
      if (filters.search) {
        const q = filters.search.toLowerCase();
        filtered = filtered.filter((g) => g.title.toLowerCase().includes(q) || g.category.includes(q));
      }
      if (filters.minPrice) filtered = filtered.filter((g) => g.pricing.basic.price >= Number(filters.minPrice));
      if (filters.maxPrice) filtered = filtered.filter((g) => g.pricing.basic.price <= Number(filters.maxPrice));
      if (filters.rating) filtered = filtered.filter((g) => g.rating >= Number(filters.rating));

      if (filters.sort === 'price-low') filtered.sort((a, b) => a.pricing.basic.price - b.pricing.basic.price);
      if (filters.sort === 'price-high') filtered.sort((a, b) => b.pricing.basic.price - a.pricing.basic.price);
      if (filters.sort === 'rating') filtered.sort((a, b) => b.rating - a.rating);

      setGigs(filtered);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [filters]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams(filters.search ? { search: filters.search } : {});
  };

  const clearFilters = () => {
    setFilters({ search: '', category: '', minPrice: '', maxPrice: '', rating: '', sort: 'newest' });
    setSearchParams({});
  };

  const hasActiveFilters = filters.category || filters.minPrice || filters.maxPrice || filters.rating;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary mb-2">
          {filters.category
            ? CATEGORIES.find((c) => c.value === filters.category)?.label
            : filters.search
              ? `Results for "${filters.search}"`
              : 'Explore All Gigs'}
        </h1>
        <p className="text-text-secondary">{gigs.length} services available</p>
      </div>

      {/* Search + Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <form onSubmit={handleSearch} className="flex-1 relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            placeholder="Search gigs..."
            className="w-full pl-11 pr-4 py-3 bg-bg-secondary border border-border rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm"
          />
        </form>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => setShowFilters(!showFilters)}>
            <SlidersHorizontal size={16} />
            Filters
            {hasActiveFilters && <span className="w-2 h-2 bg-primary rounded-full"></span>}
          </Button>
          <select
            value={filters.sort}
            onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
            className="bg-bg-secondary border border-border rounded-xl px-4 py-3 text-text-primary text-sm focus:outline-none focus:border-primary"
          >
            <option value="newest">Newest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="bg-bg-secondary rounded-xl border border-border p-6 mb-8 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-text-primary">Filters</h3>
            {hasActiveFilters && (
              <button onClick={clearFilters} className="text-sm text-primary hover:text-primary-hover flex items-center gap-1">
                <X size={14} /> Clear all
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs text-text-secondary mb-1.5">Category</label>
              <select value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="w-full bg-bg-primary border border-border rounded-lg px-3 py-2.5 text-text-primary text-sm focus:outline-none focus:border-primary">
                {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-text-secondary mb-1.5">Min Price ($)</label>
              <input type="number" value={filters.minPrice} onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })} placeholder="0"
                className="w-full bg-bg-primary border border-border rounded-lg px-3 py-2.5 text-text-primary text-sm focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-xs text-text-secondary mb-1.5">Max Price ($)</label>
              <input type="number" value={filters.maxPrice} onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })} placeholder="1000"
                className="w-full bg-bg-primary border border-border rounded-lg px-3 py-2.5 text-text-primary text-sm focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-xs text-text-secondary mb-1.5">Min Rating</label>
              <select value={filters.rating} onChange={(e) => setFilters({ ...filters, rating: e.target.value })}
                className="w-full bg-bg-primary border border-border rounded-lg px-3 py-2.5 text-text-primary text-sm focus:outline-none focus:border-primary">
                <option value="">Any</option>
                <option value="4.5">4.5+</option>
                <option value="4">4.0+</option>
                <option value="3.5">3.5+</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : gigs.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-text-primary mb-2">No gigs found</h3>
          <p className="text-text-secondary mb-6">Try adjusting your filters or search terms</p>
          <Button variant="outline" onClick={clearFilters}>Clear Filters</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {gigs.map((gig, i) => (
            <div key={gig._id} className="animate-fade-in" style={{ animationDelay: `${i * 0.03}s` }}>
              <GigCard gig={gig} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Gigs;
