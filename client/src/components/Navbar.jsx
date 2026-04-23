import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Search, Bell, MessageSquare, ChevronDown, LogOut, User, LayoutDashboard } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import NotificationDropdown from './NotificationDropdown';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowDropdown(false);
  };

  return (
    <nav className="sticky top-0 z-50 glass border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center font-bold text-white text-lg group-hover:scale-105 transition-transform">
              U
            </div>
            <span className="text-xl font-bold text-text-primary">
              Uni<span className="text-primary">Lance</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/gigs" className="text-text-secondary hover:text-text-primary transition-colors text-sm font-medium">
              Explore Gigs
            </Link>
            {user?.role === 'seller' && (
              <Link to="/dashboard" className="text-text-secondary hover:text-text-primary transition-colors text-sm font-medium">
                Dashboard
              </Link>
            )}

            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/messages" className="relative text-text-secondary hover:text-text-primary transition-colors">
                  <MessageSquare size={20} />
                </Link>
                <NotificationDropdown />

                {/* User dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center gap-2 hover:bg-bg-card rounded-lg px-3 py-1.5 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-sm font-semibold">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-text-primary hidden lg:block">{user.name}</span>
                    <ChevronDown size={14} className="text-text-secondary" />
                  </button>

                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-56 rounded-xl bg-bg-secondary border border-border shadow-2xl overflow-hidden animate-fade-in">
                      <div className="p-3 border-b border-border">
                        <p className="text-sm font-medium text-text-primary">{user.name}</p>
                        <p className="text-xs text-text-muted">{user.email}</p>
                      </div>
                      <div className="p-1">
                        <Link
                          to="/profile"
                          onClick={() => setShowDropdown(false)}
                          className="flex items-center gap-3 px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-card rounded-lg transition-colors"
                        >
                          <User size={16} />
                          Profile
                        </Link>
                        <Link
                          to="/dashboard"
                          onClick={() => setShowDropdown(false)}
                          className="flex items-center gap-3 px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-card rounded-lg transition-colors"
                        >
                          <LayoutDashboard size={16} />
                          Dashboard
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full px-3 py-2 text-sm text-error hover:bg-bg-card rounded-lg transition-colors"
                        >
                          <LogOut size={16} />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors px-4 py-2"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-medium bg-primary hover:bg-primary-hover text-white rounded-lg px-5 py-2 transition-all hover:shadow-lg hover:shadow-primary/25"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-text-secondary hover:text-text-primary transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden border-t border-border bg-bg-secondary animate-fade-in">
          <div className="p-4 space-y-3">
            <Link to="/gigs" onClick={() => setIsOpen(false)} className="block text-text-secondary hover:text-text-primary py-2 text-sm font-medium">
              Explore Gigs
            </Link>
            {user ? (
              <>
                <Link to="/dashboard" onClick={() => setIsOpen(false)} className="block text-text-secondary hover:text-text-primary py-2 text-sm font-medium">
                  Dashboard
                </Link>
                <Link to="/messages" onClick={() => setIsOpen(false)} className="block text-text-secondary hover:text-text-primary py-2 text-sm font-medium">
                  Messages
                </Link>
                <Link to="/profile" onClick={() => setIsOpen(false)} className="block text-text-secondary hover:text-text-primary py-2 text-sm font-medium">
                  Profile
                </Link>
                <button onClick={() => { handleLogout(); setIsOpen(false); }} className="block text-error py-2 text-sm font-medium">
                  Sign Out
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2 pt-2">
                <Link to="/login" onClick={() => setIsOpen(false)} className="text-center text-sm font-medium text-text-primary border border-border rounded-lg px-4 py-2.5 hover:bg-bg-card transition-colors">
                  Sign In
                </Link>
                <Link to="/register" onClick={() => setIsOpen(false)} className="text-center text-sm font-medium bg-primary hover:bg-primary-hover text-white rounded-lg px-4 py-2.5 transition-colors">
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
