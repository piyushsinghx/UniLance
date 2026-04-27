import { useState } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, ShoppingBag, Package, MessageSquare, User,
  PlusCircle, LogOut, X, ChevronLeft, ChevronRight, Star,
  DollarSign, BarChart2, Settings, Zap,
} from 'lucide-react';
import useAuth from '../hooks/useAuth';

const Sidebar = ({ isOpen, onClose, collapsed, onToggleCollapse }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const links = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Overview', section: 'main' },
    { to: '/dashboard/orders', icon: ShoppingBag, label: 'Orders', section: 'main' },
    ...(user?.role === 'seller' ? [
      { to: '/dashboard/gigs', icon: Package, label: 'My Gigs', section: 'management' },
      { to: '/dashboard/create-gig', icon: PlusCircle, label: 'Create Gig', section: 'management' },
      { to: '/messages', icon: MessageSquare, label: 'Messages', section: 'management' },
    ] : [
      { to: '/messages', icon: MessageSquare, label: 'Messages', section: 'main' },
    ]),
    { to: '/profile', icon: User, label: 'Profile', section: 'settings' },
  ];

  const handleLogout = () => { logout(); navigate('/'); };

  const sidebarW = collapsed ? 72 : 240;

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <motion.aside
        animate={{ width: sidebarW }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className={`
          fixed top-0 left-0 z-50 h-full bg-[var(--bg-secondary)] border-r border-[var(--border)] flex flex-col
          transform transition-transform duration-300 ease-in-out
          lg:static lg:transform-none lg:z-auto overflow-hidden
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
        style={{ width: sidebarW }}
      >
        {/* Logo header */}
        <div className="flex items-center gap-3 px-4 h-16 border-b border-[var(--border)] shrink-0">
          <Link to="/" className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center shrink-0 shadow-lg">
              <Zap size={15} className="text-white" />
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="text-base font-bold whitespace-nowrap overflow-hidden"
                >
                  <span className="gradient-text">Uni</span>
                  <span className="text-[var(--text-primary)]">Lance</span>
                </motion.span>
              )}
            </AnimatePresence>
          </Link>

          <button onClick={onClose} className="ml-auto lg:hidden text-[var(--text-muted)] hover:text-[var(--text-primary)]">
            <X size={18} />
          </button>
        </div>

        {/* User info */}
        <div className={`px-3 py-4 border-b border-[var(--border)] shrink-0 ${collapsed ? 'flex justify-center' : ''}`}>
          <div className={`flex items-center gap-3 ${collapsed ? '' : 'min-w-0'}`}>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center text-white font-bold shrink-0 ring-2 ring-[var(--color-primary)]/20">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="min-w-0 overflow-hidden"
                >
                  <p className="text-sm font-semibold text-[var(--text-primary)] truncate">{user?.name}</p>
                  <p className="text-xs text-[var(--text-muted)] capitalize">{user?.role}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto no-scrollbar">
          {links.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/dashboard'}
              onClick={onClose}
              title={collapsed ? label : undefined}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all relative group ${
                  isActive
                    ? 'sidebar-active'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={18} className={isActive ? 'text-[var(--color-primary)]' : ''} />
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        className="whitespace-nowrap overflow-hidden"
                      >
                        {label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {/* Tooltip when collapsed */}
                  {collapsed && (
                    <div className="absolute left-full ml-3 px-2 py-1 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg text-xs text-[var(--text-primary)] whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none z-50 transition-opacity shadow-xl">
                      {label}
                    </div>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom actions */}
        <div className="p-2 border-t border-[var(--border)] space-y-0.5 shrink-0">
          {/* Collapse toggle (desktop) */}
          <button
            onClick={onToggleCollapse}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="hidden lg:flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors"
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            {!collapsed && <span>Collapse</span>}
          </button>

          <button
            onClick={handleLogout}
            title={collapsed ? 'Sign Out' : undefined}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-[var(--color-error)] hover:bg-[var(--color-error)]/10 transition-colors"
          >
            <LogOut size={18} />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
