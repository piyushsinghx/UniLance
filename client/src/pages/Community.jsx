import { Link } from 'react-router-dom';
import { Users, MessageSquare, Trophy, Lightbulb, Heart, Globe, ArrowRight } from 'lucide-react';
import Button from '../components/Button';

const Community = () => {
  return (
    <div className="animate-fade-in">
      <section className="relative overflow-hidden py-20 lg:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-bg-primary to-accent/10"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-text-primary leading-tight mb-6">
            Join the <span className="gradient-text">Community</span>
          </h1>
          <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto">
            Connect with thousands of student freelancers, share experiences, get feedback, and grow together.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: MessageSquare, title: 'Discussion Forums', desc: 'Ask questions, share tips, and get advice from experienced student freelancers. Topics cover everything from pricing strategy to client communication.', color: 'from-blue-500 to-indigo-600' },
              { icon: Trophy, title: 'Leaderboard', desc: 'Compete with fellow students! Our monthly leaderboard ranks top sellers by earnings, ratings, and completed orders. Win recognition and badges.', color: 'from-yellow-500 to-orange-600' },
              { icon: Lightbulb, title: 'Skill Workshops', desc: 'Free monthly workshops on trending skills — React, Figma, AI/ML, and more. Taught by top-performing UniLance sellers and industry mentors.', color: 'from-emerald-500 to-teal-600' },
              { icon: Heart, title: 'Mentorship Program', desc: 'New to freelancing? Get paired with an experienced student mentor who\'ll guide you through your first gigs, pricing, and client relations.', color: 'from-pink-500 to-rose-600' },
              { icon: Users, title: 'University Chapters', desc: 'Start or join a UniLance chapter at your university. Organize meetups, hackathons, and networking events with fellow student freelancers.', color: 'from-purple-500 to-violet-600' },
              { icon: Globe, title: 'Open Source', desc: 'Contribute to UniLance\'s open-source projects on GitHub. Build your portfolio while improving the platform that powers student freelancing.', color: 'from-cyan-500 to-blue-600' },
            ].map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="bg-bg-secondary rounded-2xl border border-border p-8 card-hover shadow-xl shadow-black/10">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white shadow-lg mb-6`}>
                  <Icon size={24} />
                </div>
                <h3 className="text-xl font-bold text-text-primary mb-3">{title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-bg-secondary/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-text-primary mb-4">Community Stats</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '10K+', label: 'Active Members' },
              { value: '500+', label: 'Universities' },
              { value: '25+', label: 'Chapters' },
              { value: '100+', label: 'Workshops Hosted' },
            ].map(({ value, label }) => (
              <div key={label}>
                <p className="text-3xl font-bold text-primary">{value}</p>
                <p className="text-sm text-text-secondary mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary-dark to-accent p-10 sm:p-16 text-center">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%220%200%2040%2040%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22%23fff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M0%2040L40%200H20L0%2020zm40%200V20L20%2040z%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50"></div>
            <div className="relative z-10">
              <h2 className="text-3xl font-extrabold text-white mb-4">Become a Part of Something Bigger</h2>
              <p className="text-white/80 max-w-lg mx-auto mb-8">Join the largest student freelancer community in India. Network, learn, earn, and grow — together.</p>
              <Link to="/register"><Button variant="accent" size="lg">Join UniLance <ArrowRight size={18} /></Button></Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Community;
