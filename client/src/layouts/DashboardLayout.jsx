import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import { Menu, Bell, Search } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';
import NotificationDropdown from '../components/NotificationDropdown';
import useAuth from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  exit:    { opacity: 0, y: -8, transition: { duration: 0.2 } },
};

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  // Build breadcrumb from path
  const pathParts = location.pathname.split('/').filter(Boolean);
  const breadcrumb = pathParts.map((p, i) => ({
    label: p.charAt(0).toUpperCase() + p.slice(1).replace(/-/g, ' '),
    path: '/' + pathParts.slice(0, i + 1).join('/'),
  }));

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(c => !c)}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">

        {/* Dashboard top bar */}
        <header className="sticky top-0 z-30 h-16 glass border-b border-[var(--border)] flex items-center gap-4 px-4 sm:px-6">

          {/* Mobile logo + hamburger */}
          <div className="flex items-center gap-3 lg:hidden">
            <button
              onClick={() => setSidebarOpen(true)}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] transition-colors"
            >
              <Menu size={20} />
            </button>
            <Link to="/" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center">
                <Zap size={13} className="text-white" />
              </div>
              <span className="text-base font-bold">
                <span className="gradient-text">Uni</span>
                <span className="text-[var(--text-primary)]">Lance</span>
              </span>
            </Link>
          </div>

          {/* Breadcrumb (desktop) */}
          <nav className="hidden lg:flex items-center gap-1 text-sm text-[var(--text-muted)]">
            {breadcrumb.map((crumb, i) => (
              <span key={crumb.path} className="flex items-center gap-1">
                {i > 0 && <span className="text-[var(--border-strong)]">/</span>}
                <Link
                  to={crumb.path}
                  className={i === breadcrumb.length - 1
                    ? 'text-[var(--text-primary)] font-medium'
                    : 'hover:text-[var(--text-primary)] transition-colors capitalize'}
                >
                  {crumb.label}
                </Link>
              </span>
            ))}
          </nav>

          <div className="flex-1" />

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <NotificationDropdown />
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center text-white text-xs font-bold ring-2 ring-[var(--color-primary)]/20">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page content */}
        <AnimatePresence mode="wait">
          <motion.main
            key={location.pathname}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex-1 p-4 sm:p-6 lg:p-8"
          >
            <Outlet />
          </motion.main>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DashboardLayout;
