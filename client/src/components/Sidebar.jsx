import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, Package, MessageSquare, User, PlusCircle, LogOut, X } from 'lucide-react';
import useAuth from '../hooks/useAuth';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const links = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Overview' },
    { to: '/dashboard/orders', icon: ShoppingBag, label: 'Orders' },
    ...(user?.role === 'seller' ? [
      { to: '/dashboard/gigs', icon: Package, label: 'My Gigs' },
      { to: '/dashboard/create-gig', icon: PlusCircle, label: 'Create Gig' },
    ] : []),
    { to: '/messages', icon: MessageSquare, label: 'Messages' },
    { to: '/profile', icon: User, label: 'Profile' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />
      )}

      <aside className={`
        fixed top-0 left-0 z-50 h-full w-64 bg-bg-secondary border-r border-border
        transform transition-transform duration-300 ease-in-out
        lg:static lg:transform-none lg:z-auto
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary">{user?.name}</p>
                  <p className="text-xs text-text-muted capitalize">{user?.role}</p>
                </div>
              </div>
              <button onClick={onClose} className="lg:hidden text-text-secondary hover:text-text-primary">
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {links.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/dashboard'}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-primary/10 text-primary border border-primary/20'
                      : 'text-text-secondary hover:text-text-primary hover:bg-bg-card'
                  }`
                }
              >
                <Icon size={18} />
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-border">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm font-medium text-error hover:bg-error/10 transition-colors"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
