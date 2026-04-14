import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { Menu } from 'lucide-react';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-bg-primary">
      <Navbar />
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 min-h-[calc(100vh-4rem)]">
          {/* Mobile sidebar toggle */}
          <div className="lg:hidden p-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary bg-bg-secondary border border-border rounded-lg px-3 py-2 transition-colors"
            >
              <Menu size={18} />
              Menu
            </button>
          </div>
          <div className="p-4 lg:p-8">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
