import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Code, Palette, PenTool, Video, Smartphone, BarChart3, Megaphone, Star, ArrowRight, Users, Shield, Zap, TrendingUp, CheckCircle } from 'lucide-react';
import GigCard from '../components/GigCard';
import { SkeletonCard } from '../components/Loader';
import { getFeaturedGigs } from '../services/gigService';
import HeroCanvas from '../components/HeroCanvas';
import GradientOrb from '../components/GradientOrb';
import TypeWriter from '../components/TypeWriter';
import CountUp from '../components/CountUp';

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
  { end: 10000, suffix: '+', label: 'Student Freelancers', icon: Users },
  { end: 50000, suffix: '+', label: 'Projects Completed', icon: TrendingUp },
  { end: 500, suffix: '+', label: 'Universities', icon: Shield },
  { end: 4.9, suffix: '', label: 'Average Rating', icon: Star, decimals: 1 },
];

const TRUST_BADGES = [
  '10,000+ Students',
  '500+ Universities',
  '4.9★ Rating',
  '₹50L+ Earned',
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5, ease: 'easeOut' } }),
};

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredGigs, setFeaturedGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getFeaturedGigs()
      .then(({ data }) => setFeaturedGigs(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/gigs?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <div className="overflow-x-hidden">

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* 3D WebGL background */}
        <HeroCanvas />

        {/* Gradient orbs */}
        <GradientOrb size={600} color="#6366F1" top="-10%" left="-10%" />
        <GradientOrb size={500} color="#22D3EE" bottom="-15%" right="-5%" delay={3} />
        <GradientOrb size={400} color="#8B5CF6" top="40%" left="40%" delay={6} />

        {/* Perspective grid */}
        <div className="perspective-grid" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 lg:py-40">
          <div className="max-w-3xl mx-auto text-center">

            {/* Trust badge */}
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-[var(--color-primary)]/30 text-[var(--color-primary)] text-sm font-semibold mb-8"
            >
              <Zap size={14} className="text-[var(--color-accent)]" />
              Trusted by 10,000+ University Students
              <CheckCircle size={14} className="text-[var(--color-success)]" />
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight mb-4"
            >
              <span className="text-[var(--text-primary)]">Hire Student Talent.</span>
              <br />
              <span className="gradient-text-animated">Build Real Projects.</span>
            </motion.h1>

            {/* Typewriter subheadline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="text-lg sm:text-xl text-[var(--text-secondary)] mb-3 min-h-[2rem]"
            >
              Students who{' '}
              <TypeWriter
                phrases={['build stunning websites.', 'design beautiful brands.', 'write compelling content.', 'edit cinematic videos.', 'analyze complex data.']}
                className="text-[var(--color-accent)] font-semibold"
              />
            </motion.p>

            {/* Search bar */}
            <motion.form
              onSubmit={handleSearch}
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="max-w-2xl mx-auto mb-6 mt-8"
            >
              <div className="relative group">
                <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-[var(--color-primary)] transition-colors" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder='Try "React website", "logo design", "video editing"...'
                  className="w-full pl-14 pr-36 py-4 h-14 glass border border-[var(--border)] rounded-2xl text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all text-base"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white font-semibold px-6 py-2.5 rounded-xl transition-all hover:shadow-lg hover:shadow-[var(--color-primary)]/30 hover:-translate-y-[calc(50%+2px)] active:scale-95"
                >
                  Search
                </button>
              </div>
            </motion.form>

            {/* Popular tags */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.75 }}
              className="flex flex-wrap justify-center gap-2 mb-10"
            >
              <span className="text-sm text-[var(--text-muted)]">Popular:</span>
              {['React Developer', 'Logo Design', 'Content Writing', 'Video Editing', 'UI/UX Design'].map((tag) => (
                <Link
                  key={tag}
                  to={`/gigs?search=${encodeURIComponent(tag)}`}
                  className="px-3 py-1 text-sm text-[var(--text-secondary)] hover:text-[var(--color-primary)] glass border border-[var(--border)] rounded-full transition-all hover:border-[var(--color-primary)]/40"
                >
                  {tag}
                </Link>
              ))}
            </motion.div>

            {/* Trust badges row */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="flex flex-wrap items-center justify-center gap-3"
            >
              {TRUST_BADGES.map((badge) => (
                <span
                  key={badge}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[var(--text-secondary)] glass border border-[var(--border)] rounded-full"
                >
                  <CheckCircle size={12} className="text-[var(--color-success)]" />
                  {badge}
                </span>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--bg-primary)] to-transparent pointer-events-none" />
      </section>

      {/* ── STATS ── */}
      <section className="py-16 border-y border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map(({ end, suffix, label, icon: Icon, decimals = 0 }, i) => (
              <motion.div
                key={label}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                custom={i}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] mb-3">
                  <Icon size={22} />
                </div>
                <p className="text-3xl font-black text-[var(--text-primary)] mb-1">
                  <CountUp end={end} suffix={suffix} decimals={decimals} />
                </p>
                <p className="text-sm text-[var(--text-secondary)]">{label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-4">
              Explore <span className="gradient-text">Categories</span>
            </h2>
            <p className="text-[var(--text-secondary)] max-w-xl mx-auto">
              Find the perfect student freelancer across every popular skill
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4" style={{ perspective: '1000px' }}>
            {CATEGORIES.map(({ name, slug, icon: Icon, color }, i) => (
              <motion.div
                key={slug}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                custom={i}
                whileHover={{ scale: 1.05, rotateY: 5 }}
                whileTap={{ scale: 0.96 }}
              >
                <Link
                  to={`/gigs?category=${slug}`}
                  className="group flex flex-col items-center justify-center gap-3 p-5 min-h-[140px] bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border)] hover:border-[var(--color-primary)]/40 transition-all card-hover"
                >
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <Icon size={24} className="text-white" />
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors text-center leading-tight min-h-[2rem] flex items-center">
                    {name}
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED GIGS ── */}
      <section className="py-20 bg-[var(--bg-secondary)]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-2">
                Featured <span className="gradient-text">Gigs</span>
              </h2>
              <p className="text-[var(--text-secondary)]">Top-rated services from verified student freelancers</p>
            </motion.div>
            <Link to="/gigs" className="hidden sm:flex items-center gap-2 text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] font-medium text-sm transition-colors group">
              View All <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" style={{ perspective: '1000px' }}>
            {loading
              ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
              : featuredGigs.length > 0
                ? featuredGigs.slice(0, 4).map((gig, i) => (
                    <motion.div
                      key={gig._id}
                      variants={fadeUp}
                      initial="hidden"
                      whileInView="show"
                      viewport={{ once: true }}
                      custom={i}
                    >
                      <GigCard gig={gig} />
                    </motion.div>
                  ))
                : <p className="col-span-full text-center py-8 text-[var(--text-muted)]">No featured gigs yet.</p>
            }
          </div>

          <div className="text-center mt-10 sm:hidden">
            <Link to="/gigs" className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-primary)] text-white font-semibold rounded-xl hover:bg-[var(--color-primary-hover)] transition-colors">
              View All Gigs <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-4">
              How It <span className="gradient-text">Works</span>
            </h2>
            <p className="text-[var(--text-secondary)] max-w-xl mx-auto">Get started in three simple steps</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Find a Service', desc: 'Browse thousands of student-created gigs across categories.' },
              { step: '02', title: 'Place an Order', desc: 'Choose your package, share requirements, and pay securely.' },
              { step: '03', title: 'Get Results', desc: 'Receive quality work from talented students. Rate and review.' },
            ].map(({ step, title, desc }, i) => (
              <motion.div
                key={step}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                custom={i}
                className="relative group"
              >
                <div className="p-8 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border)] group-hover:border-[var(--color-primary)]/40 card-hover relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-primary)]/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                  <div className="text-6xl font-black bg-gradient-to-br from-[var(--color-primary)]/30 to-[var(--color-accent)]/20 bg-clip-text text-transparent mb-4">{step}</div>
                  <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">{title}</h3>
                  <p className="text-[var(--text-secondary)] text-sm leading-relaxed">{desc}</p>
                </div>
                {i < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-5 z-10 text-[var(--color-primary)]/40">
                    <ArrowRight size={24} />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-accent)] p-10 sm:p-16 text-center"
          >
            {/* Decorative orbs */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/4 translate-y-1/4" />

            <div className="relative z-10">
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-6">
                Ready to Get Started?
              </h2>
              <p className="text-lg text-white/80 max-w-xl mx-auto mb-10">
                Join thousands of university students already using UniLance to build portfolios, earn income, and gain real-world experience.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link to="/register" className="inline-flex items-center gap-2 bg-white text-[var(--color-primary)] font-bold px-8 py-4 rounded-2xl hover:shadow-2xl transition-all">
                    Join as a Freelancer <ArrowRight size={18} />
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link to="/gigs" className="inline-flex items-center gap-2 border-2 border-white/30 text-white font-bold px-8 py-4 rounded-2xl hover:bg-white/10 transition-all">
                    Hire Talent
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default Home;
