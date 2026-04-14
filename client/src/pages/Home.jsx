import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Code, Palette, PenTool, Video, Smartphone, BarChart3, Megaphone, Star, ArrowRight, Users, Shield, Zap, TrendingUp } from 'lucide-react';
import Button from '../components/Button';
import GigCard from '../components/GigCard';

// Mock featured gigs
const FEATURED_GIGS = [
  {
    _id: '1',
    title: 'I will build a modern React website with Tailwind CSS',
    category: 'web-development',
    pricing: { basic: { price: 50, deliveryDays: 3 } },
    rating: 4.9,
    reviewCount: 127,
    seller: { name: 'Alex Chen', university: 'MIT', avatar: '' },
    images: [],
  },
  {
    _id: '2',
    title: 'Professional logo and brand identity design',
    category: 'design',
    pricing: { basic: { price: 35, deliveryDays: 2 } },
    rating: 4.8,
    reviewCount: 89,
    seller: { name: 'Sarah Kim', university: 'Stanford', avatar: '' },
    images: [],
  },
  {
    _id: '3',
    title: 'SEO-optimized blog posts and article writing',
    category: 'writing',
    pricing: { basic: { price: 25, deliveryDays: 1 } },
    rating: 4.7,
    reviewCount: 203,
    seller: { name: 'James Wilson', university: 'Harvard', avatar: '' },
    images: [],
  },
  {
    _id: '4',
    title: 'Cinematic video editing with motion graphics',
    category: 'video-editing',
    pricing: { basic: { price: 75, deliveryDays: 5 } },
    rating: 5.0,
    reviewCount: 56,
    seller: { name: 'Maya Patel', university: 'UCLA', avatar: '' },
    images: [],
  },
  {
    _id: '5',
    title: 'Full-stack mobile app development in React Native',
    category: 'mobile-development',
    pricing: { basic: { price: 150, deliveryDays: 7 } },
    rating: 4.9,
    reviewCount: 34,
    seller: { name: 'David Park', university: 'CMU', avatar: '' },
    images: [],
  },
  {
    _id: '6',
    title: 'Data analysis and visualization with Python',
    category: 'data-science',
    pricing: { basic: { price: 45, deliveryDays: 3 } },
    rating: 4.6,
    reviewCount: 78,
    seller: { name: 'Emma Liu', university: 'Berkeley', avatar: '' },
    images: [],
  },
  {
    _id: '7',
    title: 'Social media marketing strategy and content',
    category: 'marketing',
    pricing: { basic: { price: 40, deliveryDays: 4 } },
    rating: 4.8,
    reviewCount: 112,
    seller: { name: 'Ryan Taylor', university: 'NYU', avatar: '' },
    images: [],
  },
  {
    _id: '8',
    title: 'Custom UI/UX design for web and mobile apps',
    category: 'design',
    pricing: { basic: { price: 60, deliveryDays: 4 } },
    rating: 4.9,
    reviewCount: 95,
    seller: { name: 'Lily Zhang', university: 'Parsons', avatar: '' },
    images: [],
  },
];

const CATEGORIES = [
  { name: 'Web Development', slug: 'web-development', icon: Code, color: 'from-blue-500 to-indigo-600' },
  { name: 'Design', slug: 'design', icon: Palette, color: 'from-pink-500 to-rose-600' },
  { name: 'Writing', slug: 'writing', icon: PenTool, color: 'from-emerald-500 to-teal-600' },
  { name: 'Video Editing', slug: 'video-editing', icon: Video, color: 'from-purple-500 to-violet-600' },
  { name: 'Mobile Dev', slug: 'mobile-development', icon: Smartphone, color: 'from-orange-500 to-amber-600' },
  { name: 'Data Science', slug: 'data-science', icon: BarChart3, color: 'from-cyan-500 to-blue-600' },
  { name: 'Marketing', slug: 'marketing', icon: Megaphone, color: 'from-yellow-500 to-orange-600' },
];

const STATS = [
  { value: '10K+', label: 'Student Freelancers', icon: Users },
  { value: '50K+', label: 'Projects Completed', icon: TrendingUp },
  { value: '500+', label: 'Universities', icon: Shield },
  { value: '4.9', label: 'Average Rating', icon: Star },
];

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/gigs?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-bg-primary to-accent/10 animate-gradient"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8 animate-fade-in">
              <Zap size={16} />
              The #1 Student Freelance Marketplace
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-text-primary leading-tight mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              Hire Student Talent.{' '}
              <span className="gradient-text">Build Real Projects.</span>
            </h1>

            <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Connect with talented university students for web development, design, writing, and more. Quality work at student-friendly prices.
            </p>

            {/* Search bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-12 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="relative group">
                <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder='Try "website design", "video editing", "blog writing"...'
                  className="w-full pl-14 pr-32 py-4 bg-bg-secondary border border-border rounded-2xl text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-base"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary hover:bg-primary-hover text-white font-semibold px-6 py-2.5 rounded-xl transition-all hover:shadow-lg hover:shadow-primary/25"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Popular tags */}
            <div className="flex flex-wrap justify-center gap-2 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <span className="text-sm text-text-muted">Popular:</span>
              {['React Developer', 'Logo Design', 'Content Writing', 'Video Editing'].map((tag) => (
                <Link
                  key={tag}
                  to={`/gigs?search=${encodeURIComponent(tag)}`}
                  className="px-3 py-1 text-sm text-text-secondary hover:text-primary bg-bg-card hover:bg-primary/10 border border-border rounded-full transition-all"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map(({ value, label, icon: Icon }, i) => (
              <div key={label} className="text-center animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-3">
                  <Icon size={24} />
                </div>
                <p className="text-3xl font-bold text-text-primary mb-1">{value}</p>
                <p className="text-sm text-text-secondary">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
              Explore <span className="gradient-text">Categories</span>
            </h2>
            <p className="text-text-secondary max-w-xl mx-auto">
              Find the perfect student freelancer for your project across popular categories
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
            {CATEGORIES.map(({ name, slug, icon: Icon, color }, i) => (
              <Link
                key={slug}
                to={`/gigs?category=${slug}`}
                className="group flex flex-col items-center gap-3 p-6 bg-bg-secondary rounded-xl border border-border hover:border-primary/30 card-hover animate-fade-in"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <Icon size={24} className="text-white" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-text-secondary group-hover:text-text-primary transition-colors text-center">
                  {name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Gigs */}
      <section className="py-20 bg-bg-secondary/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-2">
                Featured <span className="gradient-text">Gigs</span>
              </h2>
              <p className="text-text-secondary">Top-rated services from verified student freelancers</p>
            </div>
            <Link to="/gigs" className="hidden sm:flex items-center gap-2 text-primary hover:text-primary-hover font-medium text-sm transition-colors">
              View All <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURED_GIGS.map((gig, i) => (
              <div key={gig._id} className="animate-fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
                <GigCard gig={gig} />
              </div>
            ))}
          </div>

          <div className="text-center mt-10 sm:hidden">
            <Link to="/gigs">
              <Button variant="outline">View All Gigs</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
              How It <span className="gradient-text">Works</span>
            </h2>
            <p className="text-text-secondary max-w-xl mx-auto">Get started in three simple steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Find a Service', desc: 'Browse through thousands of student-created gigs across multiple categories.' },
              { step: '02', title: 'Place an Order', desc: 'Choose your package, share your requirements, and place your order securely.' },
              { step: '03', title: 'Get Results', desc: 'Receive quality work from talented students. Rate and review your experience.' },
            ].map(({ step, title, desc }, i) => (
              <div key={step} className="relative group animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="p-8 bg-bg-secondary rounded-2xl border border-border group-hover:border-primary/30 card-hover">
                  <div className="text-5xl font-black text-primary/20 mb-4">{step}</div>
                  <h3 className="text-xl font-bold text-text-primary mb-3">{title}</h3>
                  <p className="text-text-secondary text-sm leading-relaxed">{desc}</p>
                </div>
                {i < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 text-text-muted">
                    <ArrowRight size={24} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary-dark to-accent p-10 sm:p-16 text-center">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%220%200%2040%2040%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22%23fff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M0%2040L40%200H20L0%2020zm40%200V20L20%2040z%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50"></div>
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-6">
                Ready to Get Started?
              </h2>
              <p className="text-lg text-white/80 max-w-xl mx-auto mb-10">
                Join thousands of university students already using UniLance to build portfolios, earn income, and gain real-world experience.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/register">
                  <Button variant="accent" size="xl">
                    Join as a Freelancer <ArrowRight size={20} />
                  </Button>
                </Link>
                <Link to="/gigs">
                  <Button variant="secondary" size="xl" className="border-white/20 text-white hover:bg-white/10">
                    Hire Talent
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
