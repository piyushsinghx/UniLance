import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Clock, RefreshCw, Check, MessageSquare, Heart, Share2, ArrowLeft, Shield, Award } from 'lucide-react';
import Button from '../components/Button';
import { formatPrice } from '../utils/formatDate';
import useAuth from '../hooks/useAuth';

// Mock gig data
const MOCK_GIG = {
  _id: '1',
  title: 'I will build a modern React website with Tailwind CSS and responsive design',
  description: `Are you looking for a modern, fast, and responsive website? I'm a senior CS student at MIT specializing in React, Next.js, and Tailwind CSS development.\n\n**What you'll get:**\n- Clean, modular React code\n- Fully responsive design (mobile, tablet, desktop)\n- Modern UI with animations and transitions\n- SEO optimization\n- Cross-browser compatibility\n- Source code and documentation\n\n**Technologies:** React, Next.js, Tailwind CSS, Node.js, MongoDB\n\nI've completed 100+ projects for clients worldwide and maintain a 4.9-star rating. Let's build something amazing together!`,
  category: 'web-development',
  images: [],
  pricing: {
    basic: { title: 'Basic', description: 'Simple landing page with responsive design', price: 50, deliveryDays: 3, features: ['1 Page', 'Responsive Design', 'Source Code', '1 Revision'] },
    standard: { title: 'Standard', description: 'Multi-page website with animations', price: 120, deliveryDays: 5, features: ['Up to 5 Pages', 'Responsive Design', 'Source Code', 'Animations', '3 Revisions', 'SEO Setup'] },
    premium: { title: 'Premium', description: 'Full-stack web application', price: 250, deliveryDays: 10, features: ['Unlimited Pages', 'Full-Stack App', 'Database Integration', 'Authentication', 'API Development', 'Unlimited Revisions', 'Priority Support'] },
  },
  rating: 4.9,
  reviewCount: 127,
  orderCount: 234,
  tags: ['react', 'tailwind', 'nextjs', 'responsive'],
  seller: {
    _id: 's1',
    name: 'Alex Chen',
    university: 'MIT',
    bio: 'Senior CS student passionate about building beautiful web experiences. 3+ years of freelance experience.',
    skills: ['React', 'Next.js', 'Tailwind CSS', 'Node.js', 'MongoDB', 'TypeScript'],
    avatar: '',
    rating: 4.9,
    reviewCount: 127,
    createdAt: '2023-01-15',
  },
};

const MOCK_REVIEWS = [
  { _id: 'r1', user: { name: 'John Doe', avatar: '' }, rating: 5, comment: 'Incredible work! Alex delivered a stunning website ahead of schedule. The code quality was top-notch and communication was excellent throughout.', createdAt: '2024-10-15' },
  { _id: 'r2', user: { name: 'Emily Carter', avatar: '' }, rating: 5, comment: 'Exactly what I needed for my startup. The design is modern, responsive, and the performance is great. Highly recommended!', createdAt: '2024-09-28' },
  { _id: 'r3', user: { name: 'Michael Brown', avatar: '' }, rating: 4, comment: 'Great developer with excellent communication skills. Delivered on time with all requested features. Would hire again.', createdAt: '2024-09-10' },
];

const GigDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [selectedTier, setSelectedTier] = useState('basic');
  const [saved, setSaved] = useState(false);
  const gig = MOCK_GIG;

  const tiers = ['basic', 'standard', 'premium'];
  const tierColors = { basic: 'border-border', standard: 'border-primary', premium: 'border-accent' };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back */}
      <Link to="/gigs" className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary text-sm mb-6 transition-colors">
        <ArrowLeft size={16} /> Back to Gigs
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Title */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 text-xs font-medium text-primary bg-primary/10 rounded-full border border-primary/20">Web Development</span>
              <div className="flex items-center gap-1">
                <Star size={14} className="fill-warning text-warning" />
                <span className="text-sm font-semibold text-warning">{gig.rating}</span>
                <span className="text-sm text-text-muted">({gig.reviewCount} reviews)</span>
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-text-primary leading-tight">{gig.title}</h1>
          </div>

          {/* Cover image */}
          <div className="h-64 sm:h-80 bg-gradient-to-br from-blue-500/20 to-indigo-600/20 rounded-2xl border border-border flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-3">💻</div>
              <p className="text-text-secondary text-sm">Project Preview</p>
            </div>
          </div>

          {/* Description */}
          <div className="bg-bg-secondary rounded-2xl border border-border p-6 sm:p-8">
            <h2 className="text-lg font-bold text-text-primary mb-4">About this gig</h2>
            <div className="text-text-secondary text-sm leading-relaxed whitespace-pre-line">{gig.description}</div>
            <div className="flex flex-wrap gap-2 mt-6">
              {gig.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 text-xs bg-bg-card rounded-full text-text-secondary border border-border">{tag}</span>
              ))}
            </div>
          </div>

          {/* Seller */}
          <div className="bg-bg-secondary rounded-2xl border border-border p-6 sm:p-8">
            <h2 className="text-lg font-bold text-text-primary mb-6">About the Seller</h2>
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                {gig.seller.name.charAt(0)}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-text-primary">{gig.seller.name}</h3>
                <p className="text-sm text-primary font-medium mb-1">{gig.seller.university}</p>
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center gap-1">
                    <Star size={14} className="fill-warning text-warning" />
                    <span className="text-sm font-semibold text-text-primary">{gig.seller.rating}</span>
                  </div>
                  <span className="text-sm text-text-muted">{gig.seller.reviewCount} reviews</span>
                  <span className="flex items-center gap-1 text-sm text-success"><Shield size={12} /> Verified</span>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed mb-4">{gig.seller.bio}</p>
                <div className="flex flex-wrap gap-2">
                  {gig.seller.skills.map((skill) => (
                    <span key={skill} className="px-2.5 py-1 text-xs bg-primary/10 text-primary rounded-full">{skill}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-border">
              <Link to="/messages">
                <Button variant="secondary" className="w-full sm:w-auto">
                  <MessageSquare size={16} /> Contact Seller
                </Button>
              </Link>
            </div>
          </div>

          {/* Reviews */}
          <div className="bg-bg-secondary rounded-2xl border border-border p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-text-primary">Reviews ({MOCK_REVIEWS.length})</h2>
              <div className="flex items-center gap-1">
                <Star size={16} className="fill-warning text-warning" />
                <span className="font-bold text-text-primary">{gig.rating}</span>
              </div>
            </div>
            <div className="space-y-6">
              {MOCK_REVIEWS.map((review) => (
                <div key={review._id} className="pb-6 border-b border-border last:border-0 last:pb-0">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-bg-card flex items-center justify-center text-text-secondary font-semibold text-sm">
                      {review.user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-text-primary">{review.user.name}</p>
                      <div className="flex items-center gap-2">
                        <div className="flex">{Array.from({ length: review.rating }).map((_, i) => <Star key={i} size={12} className="fill-warning text-warning" />)}</div>
                        <span className="text-xs text-text-muted">{new Date(review.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-text-secondary leading-relaxed">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pricing sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-20 space-y-6">
            {/* Tier selector */}
            <div className="bg-bg-secondary rounded-2xl border border-border overflow-hidden">
              <div className="grid grid-cols-3">
                {tiers.map((tier) => (
                  <button
                    key={tier}
                    onClick={() => setSelectedTier(tier)}
                    className={`py-3 text-sm font-medium capitalize transition-all ${
                      selectedTier === tier 
                        ? 'bg-primary text-white' 
                        : 'text-text-secondary hover:text-text-primary hover:bg-bg-card'
                    }`}
                  >
                    {tier}
                  </button>
                ))}
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-text-primary">{gig.pricing[selectedTier].title}</h3>
                  <span className="text-2xl font-bold text-text-primary">{formatPrice(gig.pricing[selectedTier].price)}</span>
                </div>
                <p className="text-sm text-text-secondary mb-4">{gig.pricing[selectedTier].description}</p>
                <div className="flex items-center gap-4 mb-6 text-sm text-text-secondary">
                  <span className="flex items-center gap-1"><Clock size={14} /> {gig.pricing[selectedTier].deliveryDays} day delivery</span>
                  <span className="flex items-center gap-1"><RefreshCw size={14} /> Revisions</span>
                </div>
                <ul className="space-y-2.5 mb-6">
                  {gig.pricing[selectedTier].features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-text-secondary">
                      <Check size={14} className="text-success flex-shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <Button className="w-full" size="lg">
                  Continue ({formatPrice(gig.pricing[selectedTier].price)})
                </Button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button variant="secondary" className="flex-1" onClick={() => setSaved(!saved)}>
                <Heart size={16} className={saved ? 'fill-error text-error' : ''} />
                {saved ? 'Saved' : 'Save'}
              </Button>
              <Button variant="secondary" className="flex-1">
                <Share2 size={16} /> Share
              </Button>
            </div>

            {/* Trust badges */}
            <div className="bg-bg-secondary rounded-2xl border border-border p-5 space-y-3">
              {[
                { icon: Shield, text: 'Secure Payment Protection' },
                { icon: Clock, text: 'On-time Delivery Guarantee' },
                { icon: Award, text: 'Verified Student Seller' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3 text-sm text-text-secondary">
                  <Icon size={16} className="text-success flex-shrink-0" /> {text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GigDetails;
