import { Link } from 'react-router-dom';
import { Search, ShoppingBag, Star, ArrowRight, Shield, Zap, Clock, CheckCircle2, Users, CreditCard, MessageSquare, UploadCloud } from 'lucide-react';
import Button from '../components/Button';

const BUYER_STEPS = [
  {
    step: '01',
    icon: Search,
    title: 'Browse & Discover',
    description: 'Explore thousands of gigs across categories like web development, design, writing, and more. Use AI-powered recommendations to find the perfect match for your project.',
    details: ['Search by category, skills, or keywords', 'Filter by price range, rating, and delivery time', 'Get AI-recommended gigs based on your history'],
    color: 'from-blue-500 to-indigo-600',
  },
  {
    step: '02',
    icon: ShoppingBag,
    title: 'Place Your Order',
    description: 'Choose the package tier (Basic, Standard, or Premium) that fits your needs. Share your project requirements and complete payment securely through Razorpay.',
    details: ['Select Basic, Standard, or Premium package', 'Describe your requirements in detail', 'Pay securely via Razorpay (UPI, Cards, Netbanking)'],
    color: 'from-purple-500 to-violet-600',
  },
  {
    step: '03',
    icon: MessageSquare,
    title: 'Collaborate & Track',
    description: 'Communicate with your freelancer in real-time through our built-in messaging system. Track order progress with live status updates and typing indicators.',
    details: ['Real-time chat with typing indicators', 'Live order status tracking', 'File sharing and attachments support'],
    color: 'from-emerald-500 to-teal-600',
  },
  {
    step: '04',
    icon: Star,
    title: 'Receive & Review',
    description: 'Get your completed work delivered on time. Review the delivery, request revisions if needed, or accept and leave a rating to help the community.',
    details: ['Download delivered files instantly', 'Request revisions if needed', 'Rate and review your experience'],
    color: 'from-orange-500 to-amber-600',
  },
];

const SELLER_STEPS = [
  {
    step: '01',
    icon: Shield,
    title: 'Verify Your Account',
    description: 'Sign up with your college email (.edu / .ac.in) for instant verification, or upload your college ID for manual review. UniLance is a student-only network.',
  },
  {
    step: '02',
    icon: UploadCloud,
    title: 'Create Your Gig',
    description: 'Set up your service listing with a compelling title, AI-generated description, portfolio images, and tiered pricing. Use AI to suggest competitive prices.',
  },
  {
    step: '03',
    icon: CreditCard,
    title: 'Get Paid Securely',
    description: 'Receive orders, deliver quality work, and get paid directly through Razorpay. Funds are released to your account once the buyer accepts delivery.',
  },
];

const HowItWorks = () => {
  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden py-20 lg:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-bg-primary to-accent/10"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8">
            <Zap size={16} /> Simple. Secure. Student-First.
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-text-primary leading-tight mb-6">
            How <span className="gradient-text">UniLance</span> Works
          </h1>
          <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto">
            From discovering talent to completing your project — our streamlined workflow makes freelancing simple for university students.
          </p>
        </div>
      </section>

      {/* For Buyers */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">For Buyers</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mt-3 mb-4">Hire Student Talent in 4 Steps</h2>
            <p className="text-text-secondary max-w-xl mx-auto">Getting quality work done has never been easier. Follow these simple steps to find, hire, and collaborate with verified student freelancers.</p>
          </div>

          <div className="space-y-8">
            {BUYER_STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={step.step} className={`flex flex-col lg:flex-row gap-8 items-center ${i % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                  <div className="flex-1 bg-bg-secondary rounded-2xl border border-border p-8 sm:p-10 shadow-xl shadow-black/10">
                    <div className="flex items-center gap-4 mb-6">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white shadow-lg`}>
                        <Icon size={24} />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-text-muted uppercase tracking-widest">Step {step.step}</span>
                        <h3 className="text-xl font-bold text-text-primary">{step.title}</h3>
                      </div>
                    </div>
                    <p className="text-text-secondary leading-relaxed mb-6">{step.description}</p>
                    <ul className="space-y-3">
                      {step.details.map((detail) => (
                        <li key={detail} className="flex items-center gap-3 text-sm text-text-secondary">
                          <CheckCircle2 size={16} className="text-success flex-shrink-0" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="hidden lg:flex w-12 items-center justify-center">
                    {i < BUYER_STEPS.length - 1 && (
                      <div className="w-0.5 h-32 bg-gradient-to-b from-primary/50 to-transparent"></div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* For Sellers */}
      <section className="py-20 bg-bg-secondary/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-accent uppercase tracking-wider">For Sellers</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mt-3 mb-4">Start Earning as a Student Freelancer</h2>
            <p className="text-text-secondary max-w-xl mx-auto">Turn your skills into income while building a professional portfolio. No experience needed — just talent and dedication.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {SELLER_STEPS.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.step} className="bg-bg-secondary rounded-2xl border border-border p-8 card-hover shadow-xl shadow-black/10">
                  <div className="text-5xl font-black text-primary/20 mb-4">{step.step}</div>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                    <Icon size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-text-primary mb-3">{step.title}</h3>
                  <p className="text-text-secondary text-sm leading-relaxed">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why UniLance */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">Why Choose <span className="gradient-text">UniLance</span>?</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Shield, title: 'Verified Students', desc: 'Every freelancer is a verified university student. Academic email or ID verification ensures trust.' },
              { icon: CreditCard, title: 'Secure Payments', desc: 'Razorpay-powered payments with escrow protection. Funds released only after buyer approval.' },
              { icon: Zap, title: 'AI-Powered', desc: 'Smart recommendations, auto-generated descriptions, and AI-suggested pricing make everything faster.' },
              { icon: Clock, title: 'Fast Delivery', desc: 'Most orders delivered within 3-7 days. Real-time tracking and communication built in.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="text-center p-6 bg-bg-secondary rounded-xl border border-border">
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

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary-dark to-accent p-10 sm:p-16 text-center">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%220%200%2040%2040%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22%23fff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M0%2040L40%200H20L0%2020zm40%200V20L20%2040z%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50"></div>
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">Ready to Get Started?</h2>
              <p className="text-white/80 max-w-lg mx-auto mb-8">Join the fastest-growing student freelance marketplace. Whether you want to hire or earn, UniLance has you covered.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/register"><Button variant="accent" size="lg">Create Free Account <ArrowRight size={18} /></Button></Link>
                <Link to="/gigs"><Button variant="secondary" size="lg" className="border-white/20 text-white hover:bg-white/10">Explore Gigs</Button></Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;
