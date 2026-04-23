import { Link } from 'react-router-dom';
import { FileText, BookOpen, TrendingUp, Lightbulb, ArrowRight, Calendar, Clock, Tag } from 'lucide-react';

const BLOG_POSTS = [
  {
    category: 'Getting Started',
    title: 'How to Build a Killer Freelance Profile as a College Student',
    excerpt: 'Your profile is the first thing potential buyers see. Learn how to craft a compelling bio, showcase your skills, and set yourself apart from other student freelancers on UniLance.',
    date: 'March 15, 2026',
    readTime: '5 min read',
    tag: 'Seller Tips',
  },
  {
    category: 'Pricing Strategy',
    title: 'How to Price Your Services: A Student Freelancer\'s Guide',
    excerpt: 'Pricing too low devalues your work. Pricing too high scares buyers away. Here\'s how to use UniLance\'s AI pricing tool and market research to find your sweet spot.',
    date: 'March 10, 2026',
    readTime: '7 min read',
    tag: 'Strategy',
  },
  {
    category: 'Success Stories',
    title: 'From ₹0 to ₹50,000/Month: Meet Priya from IIT Delhi',
    excerpt: 'Priya started selling UI/UX design services on UniLance in her second year. Within 6 months, she was earning more than most internships pay. Here\'s her story.',
    date: 'March 5, 2026',
    readTime: '4 min read',
    tag: 'Inspiration',
  },
  {
    category: 'Buyer Guide',
    title: '5 Mistakes to Avoid When Hiring a Student Freelancer',
    excerpt: 'Hiring on UniLance is easy, but getting the best results requires clear communication. Learn the common pitfalls and how to write requirements that get you exactly what you need.',
    date: 'February 28, 2026',
    readTime: '6 min read',
    tag: 'Buyer Tips',
  },
  {
    category: 'Platform Updates',
    title: 'New Feature: AI-Powered Gig Recommendations',
    excerpt: 'We\'ve launched an intelligent recommendation engine that suggests gigs based on your search history, skills, and browsing behavior. Here\'s how it works under the hood.',
    date: 'February 20, 2026',
    readTime: '3 min read',
    tag: 'Product',
  },
  {
    category: 'Industry Insights',
    title: 'Why Companies Are Hiring College Students for Freelance Work',
    excerpt: 'A growing number of startups and SMBs are turning to student freelancers for fresh perspectives, affordable rates, and cutting-edge skills. Here\'s why the trend is accelerating.',
    date: 'February 15, 2026',
    readTime: '8 min read',
    tag: 'Trends',
  },
];

const QUICK_LINKS = [
  { icon: Lightbulb, title: 'Seller Tips', desc: 'Grow your freelance business', count: 12 },
  { icon: TrendingUp, title: 'Success Stories', desc: 'Real students, real earnings', count: 8 },
  { icon: BookOpen, title: 'Buyer Guides', desc: 'Get the best results', count: 6 },
  { icon: FileText, title: 'Platform Updates', desc: 'What\'s new on UniLance', count: 15 },
];

const Blog = () => {
  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden py-20 lg:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-bg-primary to-accent/10"></div>
        <div className="absolute top-20 right-20 w-72 h-72 bg-accent/10 rounded-full blur-3xl"></div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-text-primary leading-tight mb-6">
            UniLance <span className="gradient-text">Blog</span>
          </h1>
          <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto">
            Tips, strategies, success stories, and platform updates for student freelancers and buyers.
          </p>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-12 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {QUICK_LINKS.map(({ icon: Icon, title, desc, count }) => (
              <div key={title} className="bg-bg-secondary rounded-xl border border-border p-5 hover:border-primary/30 transition-colors cursor-pointer group">
                <Icon size={20} className="text-primary mb-3" />
                <h3 className="text-sm font-bold text-text-primary group-hover:text-primary transition-colors">{title}</h3>
                <p className="text-xs text-text-secondary mt-1">{desc}</p>
                <p className="text-xs text-text-muted mt-2">{count} articles</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {BLOG_POSTS.map((post, i) => (
              <article key={i} className="bg-bg-secondary rounded-2xl border border-border overflow-hidden card-hover group shadow-xl shadow-black/10">
                <div className="h-48 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center relative">
                  <span className="text-5xl opacity-30 group-hover:scale-110 transition-transform">📝</span>
                  <span className="absolute top-4 left-4 px-3 py-1 text-[10px] font-bold uppercase tracking-wider bg-primary/20 text-primary rounded-full border border-primary/20">
                    {post.category}
                  </span>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 text-xs text-text-muted mb-3">
                    <span className="flex items-center gap-1"><Calendar size={12} /> {post.date}</span>
                    <span className="flex items-center gap-1"><Clock size={12} /> {post.readTime}</span>
                  </div>
                  <h3 className="text-lg font-bold text-text-primary mb-3 group-hover:text-primary transition-colors leading-snug">{post.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed mb-4">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-xs text-text-muted"><Tag size={12} /> {post.tag}</span>
                    <span className="text-primary text-sm font-medium group-hover:underline flex items-center gap-1">
                      Read More <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-bg-secondary/50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-text-primary mb-4">Stay Updated</h2>
          <p className="text-text-secondary mb-8">Get the latest tips, success stories, and platform news delivered to your inbox.</p>
          <form className="flex flex-col sm:flex-row gap-3" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 bg-bg-primary border border-border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
            <button className="bg-primary hover:bg-primary-hover text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-lg shadow-primary/20">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Blog;
