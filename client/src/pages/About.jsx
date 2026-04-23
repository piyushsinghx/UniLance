import { Link } from 'react-router-dom';
import { Target, Users, Zap, Award, Heart } from 'lucide-react';
import Button from '../components/Button';

const About = () => {
  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden py-20 lg:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-bg-primary to-accent/10"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-text-primary leading-tight mb-6">
            Empowering the Next Generation of <span className="gradient-text">Freelancers</span>
          </h1>
          <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto">
            UniLance is a platform built by students, for students. We're bridging the gap between classroom learning and real-world experience.
          </p>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-sm font-semibold text-primary uppercase tracking-wider mb-2 block">Our Mission</span>
              <h2 className="text-3xl font-bold text-text-primary mb-6">Why We Built UniLance</h2>
              <div className="space-y-4 text-text-secondary leading-relaxed">
                <p>University students have incredible skills, but often struggle to find flexible work that fits around their class schedules. Traditional freelance platforms are saturated with experienced professionals, making it hard for students to land their first gigs.</p>
                <p>On the other hand, startups and small businesses are constantly looking for affordable, fresh talent but struggle to reach university networks.</p>
                <p>We built UniLance to solve this. By creating an exclusive, verified network of student freelancers, we give students a launchpad to build their portfolios, earn independent income, and gain practical experience before they graduate.</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-bg-secondary rounded-2xl p-6 border border-border mt-8">
                <div className="text-4xl mb-4">🎓</div>
                <h3 className="font-bold text-text-primary mb-2">Student First</h3>
                <p className="text-sm text-text-secondary">Designed specifically around the needs of university schedules and skill levels.</p>
              </div>
              <div className="bg-bg-secondary rounded-2xl p-6 border border-border">
                <div className="text-4xl mb-4">💼</div>
                <h3 className="font-bold text-text-primary mb-2">Real Experience</h3>
                <p className="text-sm text-text-secondary">Working with real clients on real projects beats textbook theory every time.</p>
              </div>
              <div className="bg-bg-secondary rounded-2xl p-6 border border-border">
                <div className="text-4xl mb-4">🤝</div>
                <h3 className="font-bold text-text-primary mb-2">Community Driven</h3>
                <p className="text-sm text-text-secondary">A supportive peer-to-peer network where students help each other grow.</p>
              </div>
              <div className="bg-bg-secondary rounded-2xl p-6 border border-border -mt-8">
                <div className="text-4xl mb-4">🚀</div>
                <h3 className="font-bold text-text-primary mb-2">AI-Powered</h3>
                <p className="text-sm text-text-secondary">Leveraging AI to help students price fairly, write better descriptions, and match with the right buyers.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-bg-secondary/50 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '2026', label: 'Founded' },
              { value: '10K+', label: 'Student Users' },
              { value: '₹50M+', label: 'Earned by Students' },
              { value: '500+', label: 'Campuses Reached' },
            ].map(({ value, label }) => (
              <div key={label}>
                <p className="text-4xl font-extrabold text-primary mb-2">{value}</p>
                <p className="text-sm text-text-secondary font-medium uppercase tracking-wider">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-text-primary mb-4">Our Core Values</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Target, title: 'Opportunity for All', desc: 'We believe talent is distributed equally, but opportunity is not. We\'re democratizing access to freelance work for students from all backgrounds.' },
              { icon: Heart, title: 'Empathy in Business', desc: 'We foster a culture of understanding. Buyers know they are working with students learning the ropes, and sellers deliver their absolute best.' },
              { icon: Zap, title: 'Continuous Learning', desc: 'Every gig is a learning opportunity. We encourage feedback, skill development, and iteration over perfection.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="text-center p-6">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mx-auto mb-6">
                  <Icon size={32} />
                </div>
                <h3 className="text-xl font-bold text-text-primary mb-3">{title}</h3>
                <p className="text-text-secondary leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-bg-secondary/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-text-primary mb-6">Join Our Journey</h2>
          <p className="text-text-secondary mb-8 max-w-2xl mx-auto">Whether you're a student looking to start your freelance career, or a business looking for fresh talent, there's a place for you here.</p>
          <Link to="/register"><Button variant="primary" size="lg">Get Started Today</Button></Link>
        </div>
      </section>
    </div>
  );
};

export default About;
