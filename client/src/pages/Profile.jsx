import { useState } from 'react';
import { Star, MapPin, Calendar, GraduationCap, Edit3, ExternalLink, Shield, Award, Briefcase } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import Button from '../components/Button';
import GigCard from '../components/GigCard';
import { formatDate } from '../utils/formatDate';

const MOCK_PORTFOLIO = [
  { title: 'E-Commerce Platform', description: 'Full-stack e-commerce built with Next.js and Stripe', image: '', link: '#' },
  { title: 'Finance Dashboard', description: 'Real-time analytics dashboard with D3.js visualizations', image: '', link: '#' },
  { title: 'Social Media App', description: 'Instagram-like app with React Native and Firebase', image: '', link: '#' },
  { title: 'AI Chat Interface', description: 'ChatGPT-style interface with streaming responses', image: '', link: '#' },
];

const MOCK_REVIEWS = [
  { _id: 'r1', user: { name: 'John Doe' }, rating: 5, comment: 'Exceptional work! Delivered ahead of schedule with excellent code quality.', createdAt: '2024-10-25' },
  { _id: 'r2', user: { name: 'Emily Carter' }, rating: 5, comment: 'Great communication and stunning design work. Highly recommended!', createdAt: '2024-10-18' },
  { _id: 'r3', user: { name: 'Michael Brown' }, rating: 4, comment: 'Very professional. Understood the requirements perfectly and delivered on time.', createdAt: '2024-10-10' },
];

const MOCK_GIGS = [
  { _id: '1', title: 'Modern React Website with Tailwind CSS', category: 'web-development', pricing: { basic: { price: 50 } }, rating: 4.9, reviewCount: 127, seller: { name: 'Alex Chen', university: 'MIT' }, images: [] },
  { _id: '2', title: 'Full-Stack Node.js API Development', category: 'web-development', pricing: { basic: { price: 80 } }, rating: 4.7, reviewCount: 62, seller: { name: 'Alex Chen', university: 'MIT' }, images: [] },
];

const Profile = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('portfolio');

  const profileUser = {
    name: user?.name || 'Alex Chen',
    email: user?.email || 'alex@mit.edu',
    role: user?.role || 'seller',
    university: user?.university || 'MIT',
    bio: 'Senior CS student passionate about building beautiful web experiences. Specializing in React, Next.js, and modern full-stack development with 3+ years of freelance experience.',
    skills: ['React', 'Next.js', 'Tailwind CSS', 'Node.js', 'MongoDB', 'TypeScript', 'Python', 'Docker'],
    rating: 4.9,
    reviewCount: 127,
    isVerified: true,
    createdAt: '2023-01-15',
  };

  const tabs = [
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'gigs', label: 'Gigs' },
    { id: 'reviews', label: 'Reviews' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile header */}
      <div className="bg-bg-secondary rounded-2xl border border-border overflow-hidden mb-8 animate-fade-in">
        {/* Banner */}
        <div className="h-36 bg-gradient-to-r from-primary via-primary-dark to-accent relative">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%220%200%2040%2040%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22%23fff%22%20fill-opacity%3D%220.06%22%3E%3Cpath%20d%3D%22M0%2040L40%200H20L0%2020zm40%200V20L20%2040z%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E')]"></div>
        </div>

        <div className="px-6 sm:px-8 pb-8">
          <div className="flex flex-col sm:flex-row items-start gap-6 -mt-14">
            <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-4xl font-bold border-4 border-bg-secondary shadow-xl flex-shrink-0">
              {profileUser.name.charAt(0)}
            </div>
            <div className="flex-1 pt-2 sm:pt-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
                <h1 className="text-2xl font-bold text-text-primary">{profileUser.name}</h1>
                <div className="flex items-center gap-2">
                  {profileUser.isVerified && (
                    <span className="flex items-center gap-1 text-xs bg-success/10 text-success px-2.5 py-1 rounded-full font-medium">
                      <Shield size={12} /> Verified
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-medium capitalize">
                    <Briefcase size={12} /> {profileUser.role}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary mb-4">
                <span className="flex items-center gap-1"><GraduationCap size={14} /> {profileUser.university}</span>
                <span className="flex items-center gap-1"><Star size={14} className="fill-warning text-warning" /> {profileUser.rating} ({profileUser.reviewCount} reviews)</span>
                <span className="flex items-center gap-1"><Calendar size={14} /> Joined {formatDate(profileUser.createdAt)}</span>
              </div>

              <p className="text-sm text-text-secondary leading-relaxed max-w-2xl">{profileUser.bio}</p>
            </div>
            <Button variant="secondary" size="sm" className="flex-shrink-0">
              <Edit3 size={14} /> Edit Profile
            </Button>
          </div>

          {/* Skills */}
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-text-primary mb-3">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {profileUser.skills.map((skill) => (
                <span key={skill} className="px-3 py-1.5 text-xs font-medium bg-bg-card border border-border rounded-lg text-text-secondary hover:text-primary hover:border-primary/30 transition-colors cursor-default">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-bg-secondary rounded-xl border border-border mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
              activeTab === tab.id ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="animate-fade-in">
        {activeTab === 'portfolio' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {MOCK_PORTFOLIO.map((item, i) => (
              <div key={i} className="bg-bg-secondary rounded-xl border border-border overflow-hidden card-hover group">
                <div className="h-44 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <span className="text-4xl">🖥️</span>
                </div>
                <div className="p-5">
                  <h3 className="text-base font-semibold text-text-primary group-hover:text-primary transition-colors mb-1">{item.title}</h3>
                  <p className="text-sm text-text-secondary mb-3">{item.description}</p>
                  <a href={item.link} className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary-hover font-medium transition-colors">
                    View Project <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'gigs' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {MOCK_GIGS.map((gig) => <GigCard key={gig._id} gig={gig} />)}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-4">
            {MOCK_REVIEWS.map((review) => (
              <div key={review._id} className="bg-bg-secondary rounded-xl border border-border p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-bg-card flex items-center justify-center text-text-secondary font-semibold text-sm">
                    {review.user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text-primary">{review.user.name}</p>
                    <div className="flex items-center gap-2">
                      <div className="flex">{Array.from({ length: review.rating }).map((_, i) => <Star key={i} size={12} className="fill-warning text-warning" />)}</div>
                      <span className="text-xs text-text-muted">{formatDate(review.createdAt)}</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
