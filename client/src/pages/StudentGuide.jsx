import { Link } from 'react-router-dom';
import { BookOpen, CheckCircle2, ArrowRight, GraduationCap, Target, Lightbulb, TrendingUp, Star, Shield, Clock, Users } from 'lucide-react';
import Button from '../components/Button';

const StudentGuide = () => {
  return (
    <div className="animate-fade-in">
      <section className="relative overflow-hidden py-20 lg:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-bg-primary to-accent/10"></div>
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-accent/10 rounded-full blur-3xl"></div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mx-auto mb-6">
            <GraduationCap size={32} />
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-text-primary leading-tight mb-6">
            Student <span className="gradient-text">Guide</span>
          </h1>
          <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto">
            Everything you need to know to start, grow, and succeed as a student freelancer on UniLance.
          </p>
        </div>
      </section>

      {/* Getting Started */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">Chapter 1</span>
            <h2 className="text-3xl font-bold text-text-primary mt-3 mb-4">Getting Started</h2>
          </div>

          <div className="space-y-6">
            {[
              { title: 'Create Your Account', content: 'Sign up at UniLance with your college email for instant verification. Choose "Sell Services" to become a freelancer. Complete your profile with a professional photo, compelling bio, and relevant skills. The more detailed your profile, the more likely buyers are to trust and hire you.' },
              { title: 'Identify Your Skills', content: 'What are you good at? Web development, graphic design, writing, video editing, data analysis? Even skills like PowerPoint presentations, research, or tutoring are in high demand. List 5-10 skills you\'re confident in and focus your first gig around your strongest skill.' },
              { title: 'Research the Market', content: 'Before creating your first gig, browse UniLance to see what other sellers in your category are offering. Note their pricing, delivery times, and descriptions. Use this research to differentiate yourself — maybe you offer faster delivery, more revisions, or a unique specialization.' },
              { title: 'Create Your First Gig', content: 'Navigate to Dashboard → Create Gig. Write a clear, specific title (e.g., "I will build a responsive React website"). Use the AI Description Generator to create a professional description. Set competitive prices using the AI Pricing tool. Upload portfolio samples if you have them.' },
            ].map((item, i) => (
              <div key={i} className="bg-bg-secondary rounded-xl border border-border p-6 sm:p-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">{i + 1}</div>
                  <h3 className="text-lg font-bold text-text-primary">{item.title}</h3>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed pl-14">{item.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Growth Tips */}
      <section className="py-20 bg-bg-secondary/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-accent uppercase tracking-wider">Chapter 2</span>
            <h2 className="text-3xl font-bold text-text-primary mt-3 mb-4">Growth Strategies</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { icon: Target, title: 'Niche Down', desc: 'Instead of "I do web development," try "I build fast, SEO-optimized Next.js landing pages." Specificity attracts serious buyers who know exactly what they need.' },
              { icon: Star, title: 'Deliver Excellence', desc: 'Over-deliver on your first 10 orders. Fast delivery, extra revisions, and bonus assets earn you 5-star reviews that compound into more orders.' },
              { icon: Clock, title: 'Respond Fast', desc: 'Buyers often message 3-4 sellers and go with whoever responds first. Enable notifications and aim to respond within 30 minutes during active hours.' },
              { icon: TrendingUp, title: 'Use AI Tools', desc: 'Leverage UniLance\'s AI description generator and pricing suggestions. AI-written descriptions are 40% more likely to convert into orders.' },
              { icon: Users, title: 'Build Relationships', desc: 'Returning buyers are gold. After completing an order, thank them and let them know you\'re available for future projects. Repeat clients mean steady income.' },
              { icon: Lightbulb, title: 'Update Regularly', desc: 'Refresh your gig descriptions, add new portfolio pieces, and adjust pricing quarterly. Active profiles rank higher in search results.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-bg-secondary rounded-xl border border-border p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Icon size={18} className="text-primary" />
                  <h3 className="font-bold text-text-primary">{title}</h3>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dos and Don'ts */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">Chapter 3</span>
            <h2 className="text-3xl font-bold text-text-primary mt-3 mb-4">Do's & Don'ts</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-bg-secondary rounded-xl border border-success/20 p-6 sm:p-8">
              <h3 className="text-lg font-bold text-success mb-6 flex items-center gap-2"><CheckCircle2 size={20} /> Do's</h3>
              <ul className="space-y-4">
                {[
                  'Communicate clearly and promptly with buyers',
                  'Set realistic delivery deadlines',
                  'Include samples in your gig gallery',
                  'Ask clarifying questions before starting work',
                  'Deliver work in organized, labeled files',
                  'Request reviews after successful completion',
                  'Keep your skills and pricing updated',
                  'Use the platform\'s messaging system for all communication',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-text-secondary">
                    <CheckCircle2 size={14} className="text-success flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-bg-secondary rounded-xl border border-error/20 p-6 sm:p-8">
              <h3 className="text-lg font-bold text-error mb-6 flex items-center gap-2">❌ Don'ts</h3>
              <ul className="space-y-4">
                {[
                  'Never share personal contact info to bypass the platform',
                  'Don\'t accept payment outside UniLance\'s system',
                  'Avoid copying others\' gig descriptions or portfolio',
                  'Don\'t over-promise and under-deliver',
                  'Never submit AI-generated work as your own without disclosure',
                  'Don\'t argue with buyers publicly — use private messages',
                  'Avoid taking on more orders than you can handle',
                  'Don\'t use fake reviews or misleading information',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-text-secondary">
                    <span className="text-error flex-shrink-0 mt-0.5">✕</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-text-primary mb-4">Ready to Start Earning?</h2>
          <p className="text-text-secondary max-w-lg mx-auto mb-8">Apply what you've learned and create your first gig today. Every expert was once a beginner.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register"><Button variant="primary" size="lg">Create Account <ArrowRight size={18} /></Button></Link>
            <Link to="/how-it-works"><Button variant="secondary" size="lg">How It Works</Button></Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default StudentGuide;
