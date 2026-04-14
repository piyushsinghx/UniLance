import { Link } from 'react-router-dom';
import { GitBranch, MessageCircle, Link as LinkIcon, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-bg-secondary border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center font-bold text-white text-lg">
                U
              </div>
              <span className="text-xl font-bold text-text-primary">
                Uni<span className="text-primary">Lance</span>
              </span>
            </Link>
            <p className="text-text-secondary text-sm leading-relaxed">
              The premier freelance marketplace built exclusively for university students. Hire talent, build projects, grow skills.
            </p>
            <div className="flex gap-3 mt-4">
              {[GitBranch, MessageCircle, LinkIcon, Mail].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-lg bg-bg-card hover:bg-primary/20 flex items-center justify-center text-text-secondary hover:text-primary transition-all">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-4">Platform</h4>
            <ul className="space-y-2.5">
              {['Explore Gigs', 'How It Works', 'Pricing', 'Categories'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-text-secondary hover:text-text-primary transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-4">Resources</h4>
            <ul className="space-y-2.5">
              {['Help Center', 'Blog', 'Community', 'Student Guide'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-text-secondary hover:text-text-primary transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-4">Legal</h4>
            <ul className="space-y-2.5">
              {['Terms of Service', 'Privacy Policy', 'Cookie Policy', 'Trust & Safety'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-text-secondary hover:text-text-primary transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-text-muted">
            © {new Date().getFullYear()} UniLance. All rights reserved.
          </p>
          <p className="text-sm text-text-muted">
            Made with ❤️ by students, for students.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
