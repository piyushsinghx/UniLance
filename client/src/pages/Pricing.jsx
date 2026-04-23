import { Link } from 'react-router-dom';
import { Check, ArrowRight, Sparkles, Crown, Zap, Star, Shield, Clock, Users, HelpCircle } from 'lucide-react';
import Button from '../components/Button';

const PLANS = [
  {
    name: 'Basic',
    tagline: 'Perfect for quick tasks',
    priceRange: '₹500 – ₹2,000',
    color: 'border-border',
    features: [
      'Single deliverable',
      '5-7 day delivery',
      '1 revision round',
      'Basic support',
      'File delivery up to 10MB',
    ],
    notIncluded: ['Priority support', 'Source files', 'Commercial license'],
  },
  {
    name: 'Standard',
    tagline: 'Most popular choice',
    priceRange: '₹2,000 – ₹8,000',
    color: 'border-primary',
    badge: true,
    features: [
      'Complete project delivery',
      '3-5 day delivery',
      '3 revision rounds',
      'Priority support',
      'Source files included',
      'File delivery up to 50MB',
    ],
    notIncluded: ['Commercial license'],
  },
  {
    name: 'Premium',
    tagline: 'Full-service experience',
    priceRange: '₹8,000 – ₹50,000+',
    color: 'border-accent',
    features: [
      'End-to-end project management',
      '1-3 day express delivery',
      'Unlimited revisions',
      '24/7 dedicated support',
      'Source files + commercial license',
      'File delivery unlimited',
      'Post-delivery support (7 days)',
    ],
    notIncluded: [],
  },
];

const FAQS = [
  {
    q: 'How are prices set on UniLance?',
    a: 'Each seller sets their own pricing across three tiers — Basic, Standard, and Premium. Our AI pricing engine analyzes similar gigs in the marketplace and suggests competitive rates, but sellers have full control over their final prices.',
  },
  {
    q: 'Is there a platform fee?',
    a: 'UniLance charges a 10% service fee on completed orders to maintain the platform, provide secure payments, and offer customer support. This fee is already included in the price you see.',
  },
  {
    q: 'What payment methods are accepted?',
    a: 'We use Razorpay as our payment gateway, which supports UPI, credit/debit cards (Visa, Mastercard, RuPay), net banking (all major banks), wallets (Paytm, PhonePe, etc.), and EMI options.',
  },
  {
    q: 'When do sellers get paid?',
    a: 'Funds are held securely in escrow until the buyer accepts the delivery. Once accepted, the payment (minus the 10% platform fee) is released to the seller\'s linked bank account within 2-3 business days.',
  },
  {
    q: 'Can I get a refund?',
    a: 'Yes. If a seller fails to deliver or the work is significantly different from what was promised, you can request a refund through our dispute resolution process. Our Trust & Safety team reviews each case individually.',
  },
  {
    q: 'Are there any hidden charges?',
    a: 'Absolutely not. The price you see on a gig is the total price you pay. There are no sign-up fees, subscription charges, or hidden costs. UniLance is free to join for both buyers and sellers.',
  },
];

const Pricing = () => {
  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden py-20 lg:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-bg-primary to-accent/10"></div>
        <div className="absolute top-20 right-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-8">
            <Sparkles size={16} /> Transparent. Affordable. Fair.
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-text-primary leading-tight mb-6">
            Simple, <span className="gradient-text">Student-Friendly</span> Pricing
          </h1>
          <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto">
            No subscriptions. No hidden fees. Pay only when you order. Every gig offers three transparent pricing tiers to match any budget.
          </p>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PLANS.map((plan) => (
              <div key={plan.name} className={`relative bg-bg-secondary rounded-2xl border-2 ${plan.color} p-8 shadow-xl shadow-black/10 flex flex-col`}>
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-primary text-white text-xs font-bold rounded-full shadow-lg shadow-primary/30">
                      <Crown size={12} /> Most Popular
                    </span>
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-text-primary mb-1">{plan.name}</h3>
                  <p className="text-sm text-text-secondary">{plan.tagline}</p>
                </div>
                <div className="mb-8">
                  <span className="text-3xl font-extrabold text-text-primary">{plan.priceRange}</span>
                  <p className="text-xs text-text-muted mt-1">Price varies by seller and project scope</p>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm text-text-secondary">
                      <Check size={16} className="text-success flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                  {plan.notIncluded.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm text-text-muted line-through opacity-50">
                      <Check size={16} className="flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link to="/gigs">
                  <Button variant={plan.badge ? 'primary' : 'secondary'} className="w-full" size="lg">
                    Browse Gigs <ArrowRight size={16} />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-20 bg-bg-secondary/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">Every Order Includes</h2>
            <p className="text-text-secondary max-w-xl mx-auto">Regardless of the tier, every UniLance order comes with these benefits — for free.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Shield, title: 'Payment Protection', desc: 'Secure escrow holds funds until you approve the delivery.' },
              { icon: Clock, title: 'On-Time Guarantee', desc: 'Sellers commit to delivery deadlines. Late? You can cancel.' },
              { icon: Users, title: 'Verified Sellers', desc: 'Every seller is a verified university student. No bots.' },
              { icon: Star, title: 'Quality Ratings', desc: 'Transparent reviews help you choose the best freelancer.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-bg-secondary rounded-xl border border-border p-6 text-center">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mx-auto mb-4">
                  <Icon size={24} />
                </div>
                <h3 className="font-bold text-text-primary mb-2">{title}</h3>
                <p className="text-text-secondary text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">Pricing <span className="gradient-text">FAQs</span></h2>
          </div>
          <div className="space-y-4">
            {FAQS.map(({ q, a }) => (
              <div key={q} className="bg-bg-secondary rounded-xl border border-border p-6">
                <h3 className="font-semibold text-text-primary flex items-center gap-3 mb-3">
                  <HelpCircle size={18} className="text-primary flex-shrink-0" /> {q}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed pl-9">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;
