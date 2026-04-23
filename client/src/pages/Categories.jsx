import { Link } from 'react-router-dom';
import { Code, Palette, PenTool, Video, Smartphone, BarChart3, Megaphone, Box, ArrowRight, Star, Users, TrendingUp } from 'lucide-react';

const CATEGORIES = [
  {
    slug: 'web-development',
    name: 'Web Development',
    icon: Code,
    color: 'from-blue-500 to-indigo-600',
    description: 'Custom websites, web apps, landing pages, e-commerce stores, WordPress, React, Next.js, and full-stack development.',
    skills: ['React', 'Next.js', 'Node.js', 'WordPress', 'HTML/CSS', 'PHP', 'Django', 'Vue.js'],
    avgPrice: '₹2,000 – ₹25,000',
    avgDelivery: '3-10 days',
    gigCount: '2,400+',
  },
  {
    slug: 'design',
    name: 'Design',
    icon: Palette,
    color: 'from-pink-500 to-rose-600',
    description: 'Logo design, UI/UX, brand identity, social media graphics, illustrations, infographics, and presentation design.',
    skills: ['Figma', 'Adobe XD', 'Illustrator', 'Photoshop', 'Canva', 'Blender', 'After Effects'],
    avgPrice: '₹1,000 – ₹15,000',
    avgDelivery: '2-7 days',
    gigCount: '1,800+',
  },
  {
    slug: 'writing',
    name: 'Writing & Content',
    icon: PenTool,
    color: 'from-emerald-500 to-teal-600',
    description: 'Blog posts, articles, copywriting, academic writing assistance, SEO content, product descriptions, and technical documentation.',
    skills: ['SEO Writing', 'Copywriting', 'Technical Writing', 'Blog Posts', 'Proofreading', 'Translation'],
    avgPrice: '₹500 – ₹8,000',
    avgDelivery: '1-5 days',
    gigCount: '1,200+',
  },
  {
    slug: 'video-editing',
    name: 'Video Editing',
    icon: Video,
    color: 'from-purple-500 to-violet-600',
    description: 'YouTube video editing, reels, short-form content, motion graphics, intro/outro creation, and podcast editing.',
    skills: ['Premiere Pro', 'Final Cut Pro', 'DaVinci Resolve', 'After Effects', 'CapCut', 'Motion Graphics'],
    avgPrice: '₹1,500 – ₹20,000',
    avgDelivery: '3-7 days',
    gigCount: '900+',
  },
  {
    slug: 'mobile-development',
    name: 'Mobile Development',
    icon: Smartphone,
    color: 'from-orange-500 to-amber-600',
    description: 'Android and iOS app development, React Native, Flutter, cross-platform apps, app UI/UX, and API integration.',
    skills: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Firebase', 'REST APIs'],
    avgPrice: '₹5,000 – ₹40,000',
    avgDelivery: '7-21 days',
    gigCount: '600+',
  },
  {
    slug: 'data-science',
    name: 'Data Science & AI',
    icon: BarChart3,
    color: 'from-cyan-500 to-blue-600',
    description: 'Data analysis, machine learning models, data visualization, Python scripting, web scraping, and statistical analysis.',
    skills: ['Python', 'TensorFlow', 'Pandas', 'R', 'Tableau', 'Power BI', 'SQL', 'Jupyter'],
    avgPrice: '₹3,000 – ₹30,000',
    avgDelivery: '5-14 days',
    gigCount: '500+',
  },
  {
    slug: 'marketing',
    name: 'Digital Marketing',
    icon: Megaphone,
    color: 'from-yellow-500 to-orange-600',
    description: 'Social media marketing, SEO optimization, Google Ads, content strategy, email marketing, and brand consulting.',
    skills: ['SEO', 'Google Ads', 'Facebook Ads', 'Instagram Marketing', 'Email Marketing', 'Analytics'],
    avgPrice: '₹1,000 – ₹12,000',
    avgDelivery: '3-10 days',
    gigCount: '700+',
  },
  {
    slug: 'other',
    name: 'Other Services',
    icon: Box,
    color: 'from-slate-500 to-gray-600',
    description: 'Virtual assistance, project management, research, tutoring, music production, voiceover, and any unique skills students bring.',
    skills: ['Virtual Assistant', 'Research', 'Tutoring', 'Music', 'Voiceover', 'Transcription'],
    avgPrice: '₹500 – ₹10,000',
    avgDelivery: '1-7 days',
    gigCount: '400+',
  },
];

const Categories = () => {
  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden py-20 lg:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-bg-primary to-accent/10"></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-accent/10 rounded-full blur-3xl"></div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-text-primary leading-tight mb-6">
            Explore All <span className="gradient-text">Categories</span>
          </h1>
          <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto">
            Discover talented university students across 8+ service categories. From code to content, design to data — find the skills you need.
          </p>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {CATEGORIES.map((category, i) => {
              const Icon = category.icon;
              return (
                <Link
                  key={category.slug}
                  to={`/gigs?category=${category.slug}`}
                  className="block bg-bg-secondary rounded-2xl border border-border p-6 sm:p-8 card-hover shadow-xl shadow-black/10 group"
                >
                  <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                    {/* Icon & Title */}
                    <div className="flex items-start gap-5 lg:w-1/3">
                      <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform flex-shrink-0`}>
                        <Icon size={28} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-text-primary group-hover:text-primary transition-colors">{category.name}</h3>
                        <p className="text-sm text-text-secondary mt-1 leading-relaxed">{category.description}</p>
                      </div>
                    </div>

                    {/* Skills */}
                    <div className="lg:w-1/3">
                      <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">Popular Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {category.skills.map((skill) => (
                          <span key={skill} className="px-3 py-1 text-xs bg-bg-card border border-border rounded-full text-text-secondary">{skill}</span>
                        ))}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="lg:w-1/3 flex flex-wrap gap-6 lg:justify-end">
                      <div>
                        <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Avg Price</p>
                        <p className="font-bold text-text-primary text-sm">{category.avgPrice}</p>
                      </div>
                      <div>
                        <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Delivery</p>
                        <p className="font-bold text-text-primary text-sm">{category.avgDelivery}</p>
                      </div>
                      <div>
                        <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Gigs</p>
                        <p className="font-bold text-primary text-sm">{category.gigCount}</p>
                      </div>
                      <div className="hidden lg:flex items-center text-primary group-hover:translate-x-1 transition-transform">
                        <ArrowRight size={20} />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-16 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { icon: Users, value: '10K+', label: 'Student Freelancers' },
              { icon: Star, value: '4.9', label: 'Average Rating' },
              { icon: TrendingUp, value: '50K+', label: 'Projects Completed' },
              { icon: Code, value: '8', label: 'Categories' },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label}>
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3"><Icon size={24} /></div>
                <p className="text-3xl font-bold text-text-primary">{value}</p>
                <p className="text-sm text-text-secondary">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Categories;
