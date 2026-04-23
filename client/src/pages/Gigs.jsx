import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X, Sparkles } from 'lucide-react';
import GigCard from '../components/GigCard';
import { SkeletonCard } from '../components/Loader';
import Button from '../components/Button';
import PriceSlider from '../components/PriceSlider';
import { SearchEmptyState } from '../components/EmptyState';
import { getGigs } from '../services/gigService';
import { getRecommendedGigs, trackSearch } from '../services/aiService';
import useAuth from '../hooks/useAuth';

const CATEGORIES = [
  { value: '', label: 'All Categories' },
  { value: 'web-development', label: 'Web Development' },
  { value: 'design', label: 'Design' },
  { value: 'writing', label: 'Writing' },
  { value: 'video-editing', label: 'Video Editing' },
  { value: 'mobile-development', label: 'Mobile Dev' },
  { value: 'data-science', label: 'Data Science' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'other', label: 'Other' },
];

const Gigs = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [gigs, setGigs] = useState([]);
  const [recommendedGigs, setRecommendedGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recommendedLoading, setRecommendedLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    minPrice: '',
    maxPrice: '',
    skills: '',
    rating: '',
    sort: 'newest',
  });

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      search: searchParams.get('search') || '',
      category: searchParams.get('category') || '',
    }));
  }, [searchParams]);

  const fetchGigs = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await getGigs({
        ...filters,
        limit: 24
      });
      setGigs(data.gigs);
    } catch (error) {
      console.error('Failed to fetch gigs', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchGigs();
  }, [fetchGigs]);

  useEffect(() => {
    if (user && !filters.search && !filters.category && !filters.skills) {
      const fetchRecommended = async () => {
        try {
          setRecommendedLoading(true);
          const { data } = await getRecommendedGigs();
          setRecommendedGigs(data || []);
        } catch (error) {
          console.error('Failed to fetch recommendations', error);
        } finally {
          setRecommendedLoading(false);
        }
      };
      fetchRecommended();
    } else {
      setRecommendedGigs([]);
    }
  }, [user, filters.search, filters.category, filters.skills]);

  const handleSearch = (e) => {
    e.preventDefault();
    const nextParams = {};

    if (filters.search) {
      nextParams.search = filters.search;
    }

    if (filters.category) {
      nextParams.category = filters.category;
    }

    setSearchParams(nextParams);

    if (user && filters.search.trim()) {
      trackSearch(filters.search.trim()).catch(() => {});
    }
  };

  const clearFilters = () => {
    setFilters({ search: '', category: '', minPrice: '', maxPrice: '', skills: '', rating: '', sort: 'newest' });
    setSearchParams({});
  };

  const hasActiveFilters = filters.category || filters.minPrice || filters.maxPrice || filters.skills || filters.rating;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary mb-2">
          {filters.category
            ? CATEGORIES.find((c) => c.value === filters.category)?.label
            : filters.search
              ? `Results for "${filters.search}"`
              : 'Explore Gigs'}
        </h1>
        <p className="text-text-secondary">Find the perfect service for your project</p>
      </div>

      {/* Recommended Section (AI) */}
      {!filters.search && !filters.category && user && (recommendedLoading || recommendedGigs.length > 0) && (
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white shadow-lg shadow-primary/20">
              <Sparkles size={16} />
            </div>
            <h2 className="text-xl font-bold text-text-primary">AI Recommended For You</h2>
          </div>
          
          {recommendedLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {recommendedGigs.slice(0, 4).map((gig, i) => (
                <div key={gig._id} className="animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                  <GigCard gig={gig} isRecommended={true} />
                </div>
              ))}
            </div>
          )}
          <div className="h-px bg-border my-8"></div>
        </div>
      )}

      {/* Search + Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <form onSubmit={handleSearch} className="flex-1 relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            placeholder="Search gigs or skills..."
            className="w-full pl-11 pr-4 py-3 bg-bg-secondary border border-border rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm"
          />
        </form>
        <div className="flex gap-3">
          <Button variant={hasActiveFilters ? "primary" : "secondary"} onClick={() => setShowFilters(!showFilters)}>
            <SlidersHorizontal size={16} />
            Filters
            {hasActiveFilters && <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-accent rounded-full border-2 border-bg-primary"></span>}
          </Button>
          <select
            value={filters.sort}
            onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
            className="bg-bg-secondary border border-border rounded-xl px-4 py-3 text-text-primary text-sm focus:outline-none focus:border-primary"
          >
            <option value="newest">Newest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="popular">Top Rated & Popular</option>
          </select>
        </div>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="bg-bg-secondary rounded-xl border border-border p-6 mb-8 animate-fade-in shadow-xl shadow-black/10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-text-primary flex items-center gap-2">
              <SlidersHorizontal size={18} /> Advanced Filters
            </h3>
            {hasActiveFilters && (
              <button 
                onClick={clearFilters} 
                className="text-sm font-medium text-error hover:bg-error/10 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
              >
                <X size={14} /> Clear All
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <label className="block text-sm font-medium text-text-primary">Category</label>
              <select 
                value={filters.category} 
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="w-full bg-bg-primary border border-border rounded-lg px-3 py-2.5 text-text-primary text-sm focus:outline-none focus:border-primary"
              >
                {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm font-medium">
                <label className="text-text-primary">Price Range (₹)</label>
              </div>
              <PriceSlider 
                min={0} 
                max={50000} 
                initialMin={filters.minPrice ? Number(filters.minPrice) : 0} 
                initialMax={filters.maxPrice ? Number(filters.maxPrice) : 50000}
                onChange={({ min, max }) => {
                  setFilters({ ...filters, minPrice: min > 0 ? min : '', maxPrice: max < 50000 ? max : '' });
                }} 
              />
            </div>
            
            <div className="space-y-3">
              <label className="block text-sm font-medium text-text-primary">Minimum Rating</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: '', label: 'Any Rating' },
                  { value: '4.5', label: '4.5+ ⭐' },
                  { value: '4', label: '4.0+ ⭐' },
                  { value: '3', label: '3.0+ ⭐' }
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setFilters({ ...filters, rating: opt.value })}
                    className={`px-3 py-2 text-sm rounded-lg border transition-all ${filters.rating === opt.value ? 'bg-primary/10 border-primary text-primary' : 'bg-bg-primary border-border text-text-secondary hover:border-primary/50'}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3 md:col-span-3">
              <label className="block text-sm font-medium text-text-primary">Skill Tags</label>
              <input
                type="text"
                value={filters.skills}
                onChange={(e) => setFilters({ ...filters, skills: e.target.value })}
                placeholder="react, python, ui ux"
                className="w-full bg-bg-primary border border-border rounded-lg px-3 py-2.5 text-text-primary text-sm focus:outline-none focus:border-primary"
              />
              <p className="text-xs text-text-muted">Use comma-separated skills to narrow gigs by tags.</p>
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
        <SearchEmptyState query={filters.search} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {gigs.map((gig, i) => (
            <div key={gig._id} className="animate-fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
              <GigCard gig={gig} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Gigs;
